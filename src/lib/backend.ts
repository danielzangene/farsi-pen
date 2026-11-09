// The optional Farsi Pen API (a Cloudflare Worker, see /worker). Every feature
// that uses it is hidden unless NEXT_PUBLIC_API_URL is set at build time.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
export const hasBackend = API_URL !== "";

export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code);
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  if (!hasBackend) throw new ApiError("off", 0);
  let r: Response;
  try {
    r = await fetch(`${API_URL}${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  } catch {
    throw new ApiError("network", 0);
  }
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError((body as { error?: string }).error ?? "error", r.status);
  return body as T;
}

export interface TutorReply {
  fa: string;
  tr: string;
  en: string;
  fix: string;
}

export type TutorScenario = "chat" | "cafe" | "taxi" | "bazaar" | "guest" | "pharmacy" | "directions";

export function askTutor(messages: { role: "user" | "assistant"; content: string }[], scenario: TutorScenario, level: string) {
  return api<TutorReply>("/tutor", { method: "POST", body: JSON.stringify({ messages, scenario, level }) });
}

export function sendFeedback(entry: { kind: "general" | "content"; text: string; itemId?: string; context?: string; page?: string; rating?: number }) {
  return api<{ ok: true }>("/feedback", { method: "POST", body: JSON.stringify(entry) });
}
