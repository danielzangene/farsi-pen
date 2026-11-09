// Farsi Pen API — a small Cloudflare Worker (free plan) with three jobs:
//   POST /tutor          AI conversation partner, proxied to NVIDIA's API so the key stays here
//   GET|PUT /sync/:code  progress sync between devices, keyed by a random code (no accounts)
//   POST /feedback       feedback and content reports from the app
// Storage is one KV namespace. Nothing here stores names, emails or IP addresses:
// rate limits use a salted hash of the IP that changes every day.

const MAX_SYNC_BYTES = 1_000_000;
const SYNC_TTL = 60 * 60 * 24 * 400; // ~13 months, refreshed on every save
const FEEDBACK_TTL = 60 * 60 * 24 * 365;
const CODE_RE = /^[a-z2-7]{26}$/; // 130-bit base32

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") ?? "";
    const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim());
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0] ?? "",
      "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (origin && !allowed.includes(origin)) return json({ error: "origin" }, 403, cors);

    const url = new URL(req.url);
    try {
      if (url.pathname === "/health") return json({ ok: true, tutor: !!env.NVIDIA_API_KEY }, 200, cors);
      if (url.pathname === "/tutor" && req.method === "POST") return await tutor(req, env, cors);
      if (url.pathname === "/feedback" && req.method === "POST") return await feedback(req, env, cors);
      const m = url.pathname.match(/^\/sync\/([^/]+)$/);
      if (m) return await sync(req, env, cors, m[1]);
      return json({ error: "not found" }, 404, cors);
    } catch (e) {
      return json({ error: "server", detail: String(e?.message ?? e).slice(0, 200) }, 500, cors);
    }
  },
};

function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });
}

const today = () => new Date().toISOString().slice(0, 10);

async function visitor(req) {
  const ip = req.headers.get("CF-Connecting-IP") ?? "unknown";
  const data = new TextEncoder().encode(`${ip}|${today()}|farsi-pen`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash).slice(0, 12)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Counts one use; returns false once the limit for today is reached. */
async function take(env, key, limit) {
  const n = Number((await env.KV.get(key)) ?? 0);
  if (n >= limit) return false;
  await env.KV.put(key, String(n + 1), { expirationTtl: 60 * 60 * 26 });
  return true;
}

// ---------- Tutor ----------

const SCENARIOS = {
  chat: "a friendly Iranian about the learner's age, chatting about everyday life",
  cafe: "a waiter in a Tehran café taking the learner's order",
  taxi: "a shared-taxi driver in Tehran; the learner needs to get somewhere",
  bazaar: "a shopkeeper in a bazaar; the learner wants to buy something and may bargain",
  guest: "a host welcoming the learner into their home, with plenty of ta'ârof",
  pharmacy: "a pharmacist; the learner isn't feeling well",
  directions: "a passer-by; the learner is lost and asks the way",
};

function systemPrompt(scenario, level) {
  const role = SCENARIOS[scenario] ?? SCENARIOS.chat;
  return [
    `You are a Persian conversation partner in a language app. Play ${role}.`,
    `The learner is at CEFR level ${level}. Keep every reply short (one or two sentences) and at that level.`,
    "Speak natural, polite colloquial Tehrani Persian (spoken forms like می‌خوام, میاد, رو).",
    "Stay in role and keep the conversation going with a simple question.",
    "The learner may write in Persian script or in Latin transliteration (Finglish); understand both.",
    "If the learner's last message has a mistake, give a short, kind correction in English; otherwise leave it empty.",
    "Never discuss politics, religion debates or anything unsafe; steer back to the scene.",
    'Answer ONLY with JSON: {"fa": "<reply in Persian script>", "tr": "<the reply in simple transliteration: â for long a, kh, gh, sh, ch>", "en": "<English translation>", "fix": "<correction or empty>"}',
  ].join("\n");
}

async function tutor(req, env, cors) {
  if (!env.NVIDIA_API_KEY) return json({ error: "tutor-off" }, 503, cors);
  const body = await req.json().catch(() => null);
  const messages = Array.isArray(body?.messages) ? body.messages.slice(-12) : null;
  if (!messages?.length) return json({ error: "bad request" }, 400, cors);
  const clean = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 600) }));
  if (!clean.length || clean[clean.length - 1].role !== "user") return json({ error: "bad request" }, 400, cors);

  const day = today();
  if (!(await take(env, `rl:g:${day}`, Number(env.TUTOR_GLOBAL_PER_DAY ?? 3000)))) return json({ error: "busy" }, 429, cors);
  if (!(await take(env, `rl:v:${day}:${await visitor(req)}`, Number(env.TUTOR_PER_DAY ?? 40)))) return json({ error: "limit" }, 429, cors);

  const level = ["A1", "A2", "B1", "B2"].includes(body.level) ? body.level : "A1";
  const r = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.NVIDIA_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: env.MODEL ?? "meta/llama-3.3-70b-instruct",
      messages: [{ role: "system", content: systemPrompt(body.scenario, level) }, ...clean],
      temperature: 0.6,
      max_tokens: 300,
    }),
  });
  if (!r.ok) return json({ error: "upstream", status: r.status }, 502, cors);
  const data = await r.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  return json(parseReply(text), 200, cors);
}

/** Models sometimes wrap JSON in prose or code fences; take the first object. */
export function parseReply(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (m) {
    try {
      const o = JSON.parse(m[0]);
      if (typeof o.fa === "string" && o.fa.trim())
        return { fa: o.fa.trim(), tr: String(o.tr ?? "").trim(), en: String(o.en ?? "").trim(), fix: String(o.fix ?? "").trim() };
    } catch {}
  }
  return { fa: text.trim().slice(0, 400), tr: "", en: "", fix: "" };
}

// ---------- Sync ----------

async function sync(req, env, cors, code) {
  if (!CODE_RE.test(code)) return json({ error: "bad code" }, 400, cors);
  const key = `sync:${code}`;
  if (req.method === "GET") {
    const v = await env.KV.get(key);
    return v ? new Response(v, { headers: { ...cors, "Content-Type": "application/json" } }) : json({ error: "not found" }, 404, cors);
  }
  if (req.method === "PUT") {
    if (!(await take(env, `rl:s:${today()}:${code}`, 500))) return json({ error: "limit" }, 429, cors);
    const text = await req.text();
    if (text.length > MAX_SYNC_BYTES) return json({ error: "too large" }, 413, cors);
    const o = JSON.parse(text);
    if (typeof o?.updatedAt !== "string" || typeof o?.state !== "object") return json({ error: "bad body" }, 400, cors);
    await env.KV.put(key, text, { expirationTtl: SYNC_TTL });
    return json({ ok: true }, 200, cors);
  }
  return json({ error: "method" }, 405, cors);
}

// ---------- Feedback ----------

async function feedback(req, env, cors) {
  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, 2000) : "";
  if (!text && !body?.itemId) return json({ error: "empty" }, 400, cors);
  if (!(await take(env, `rl:f:${today()}:${await visitor(req)}`, 30))) return json({ error: "limit" }, 429, cors);
  const entry = {
    at: new Date().toISOString(),
    kind: body.kind === "content" ? "content" : "general",
    text,
    itemId: typeof body.itemId === "string" ? body.itemId.slice(0, 200) : undefined,
    context: typeof body.context === "string" ? body.context.slice(0, 500) : undefined,
    page: typeof body.page === "string" ? body.page.slice(0, 200) : undefined,
    rating: Number.isInteger(body.rating) && body.rating >= 1 && body.rating <= 5 ? body.rating : undefined,
  };
  await env.KV.put(`fb:${entry.at}:${crypto.randomUUID().slice(0, 8)}`, JSON.stringify(entry), { expirationTtl: FEEDBACK_TTL });
  return json({ ok: true }, 200, cors);
}
