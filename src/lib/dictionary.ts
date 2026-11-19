// Look up any word, in either direction, beyond the course vocabulary.
//
// Course words (WORDS) always come first: they carry transliteration, audio
// and examples. Everything else comes from the static dictionary in
// public/data/dict/ (built by scripts/build-dictionary.mjs from VahidN's
// English-to-Persian dictionaries, Apache-2.0), loaded one letter at a time.

import { WORDS, type Word } from "@/content/words";
import { normalize } from "./answer";
import { cleanFa } from "./spell";

export interface DictEntry {
  /** English headword (for EN→FA) or the English words a Persian meaning maps to. */
  en: string;
  /** Persian meanings, best first. */
  fa: string[];
  /** Example sentences [english, persian]. */
  examples: [string, string][];
  /** A course word that matches, when there is one. */
  course?: Word;
}

type EnShard = Record<string, { m: string[]; s?: number[] }>;
type FaShard = Record<string, string[]>;

const base = () => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/data/dict`;
const cache = new Map<string, Promise<unknown>>();

function getJson<T>(path: string, fetcher: typeof fetch = fetch): Promise<T | null> {
  if (!cache.has(path)) {
    cache.set(
      path,
      fetcher(`${base()}/${path}`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    );
  }
  return cache.get(path) as Promise<T | null>;
}

let sentences: Promise<[string, string][] | null> | null = null;
function getSentences(): Promise<[string, string][] | null> {
  if (!sentences) sentences = getJson<[string, string][]>("sentences.json");
  return sentences;
}

const faShardKey = (w: string) => w[0].codePointAt(0)!.toString(16);

/** Strips common Persian endings and prefixes to find a dictionary form. */
export function faStems(word: string): string[] {
  const w = cleanFa(word).replace(/[.،؛:!?؟«»"]/g, "");
  const out = new Set<string>([w]);
  const ends = ["‌هایی", "‌های", "‌ها", "هایی", "های", "ها", "‌ای", "ای", "یی", "ی", "م", "ت", "ش", "مان", "تان", "شان", "ان", "ید", "یم", "ند", "د"];
  const starts = ["‌می", "می‌", "می", "نمی‌", "نمی", "ب", "ن"];
  for (const e of ends) if (w.endsWith(e) && w.length - e.length >= 2) out.add(w.slice(0, -e.length).replace(/‌$/, ""));
  for (const s of starts) if (w.startsWith(s) && w.length - s.length >= 2) out.add(w.slice(s.length).replace(/^‌/, ""));
  return [...out];
}

function courseByFa(word: string): Word | undefined {
  const k = cleanFa(word).replace(/‌/g, "");
  return WORDS.find((x) => cleanFa(x.fa).replace(/‌/g, "").replace(/[.،؟!]/g, "") === k);
}

function courseByEn(word: string): Word | undefined {
  const k = normalize(word, "en");
  return WORDS.find((x) => normalize(x.en, "en") === k || x.alt?.some((a) => normalize(a, "en") === k));
}

/** English → Persian. */
export async function lookupEnglish(query: string): Promise<DictEntry | null> {
  const q = query.trim().toLowerCase();
  if (!/^[a-z]/.test(q)) return null;
  const course = courseByEn(q);
  const shard = await getJson<EnShard>(`en/${q[0]}.json`);
  const hit = shard?.[q] ?? (q.endsWith("s") ? shard?.[q.slice(0, -1)] : undefined);
  if (!hit && !course) return null;
  const all = hit?.s?.length ? await getSentences() : null;
  return {
    en: q,
    fa: [...new Set([...(course ? [course.fa] : []), ...(hit?.m ?? [])])],
    examples: (hit?.s ?? []).map((i) => all?.[i]).filter((x): x is [string, string] => !!x),
    course,
  };
}

/** Persian → English (tries the word, then likely stems). */
export async function lookupPersian(query: string): Promise<DictEntry | null> {
  const q = cleanFa(query);
  if (!q) return null;
  for (const stem of faStems(q)) {
    const course = courseByFa(stem);
    if (course) return { en: course.en, fa: [course.fa], examples: [[course.example.en, course.example.fa]], course };
    const shard = await getJson<FaShard>(`fa/${faShardKey(stem)}.json`);
    const hit = shard?.[stem] ?? shard?.[stem.replace(/‌/g, " ")];
    if (hit?.length) return { en: hit.join(", "), fa: [stem], examples: [] };
  }
  return null;
}

/** Either direction, by script. */
export function lookup(query: string): Promise<DictEntry | null> {
  return /[؀-ۿ]/.test(query) ? lookupPersian(query) : lookupEnglish(query);
}
