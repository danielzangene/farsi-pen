// Shared answer checker for vocabulary, practice and grammar (spec §4.2 / §7.4).
//
// Both sides are reduced to a comparison key: lower case, no punctuation or
// spaces, Arabic ك/ي mapped to Persian ک/ی, ZWNJ and diacritics removed
// (so â == a). Keys that are not identical but within a small edit distance
// count as "almost" — accepted, with a spelling nudge.

export type Verdict = "correct" | "almost" | "wrong";

export interface CheckResult {
  verdict: Verdict;
  /** The accepted answer that matched best (as written in the content). */
  closest: string;
}

// Common informal spellings, applied only when the expected answer is English.
const EN_VARIANTS: [RegExp, string][] = [
  [/\bnite\b/g, "night"],
  [/\bthx\b/g, "thanks"],
  [/\bpl[sz]\b/g, "please"],
  [/\bu\b/g, "you"],
  [/\bur\b/g, "your"],
];

const CONTRACTIONS: [RegExp, string][] = [
  [/\bi'm\b/g, "i am"],
  [/\byou're\b/g, "you are"],
  [/\bwhat's\b/g, "what is"],
  [/\bthat's\b/g, "that is"],
  [/\bit's\b/g, "it is"],
];

export interface CheckOptions {
  /** "en" enables informal English spellings (nite, thx, u). */
  lang?: "en" | "fa";
  /** Answers of other items: an exact match with one of these is never "almost". */
  reject?: string[];
}

export function normalize(raw: string, lang: "en" | "fa" = "fa"): string {
  let s = raw
    .replace(/[’‘`´]/g, "'")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ") // drop notes like "(polite)"
    .replace(/ك/g, "ک")
    .replace(/[يى]/g, "ی")
    .replace(/[\u200c\u200d]/g, "")
    .trim();
  for (const [re, full] of CONTRACTIONS) s = s.replace(re, full);
  if (lang === "en") for (const [re, full] of EN_VARIANTS) s = s.replace(re, full);
  s = s.replace(/^(a|an|the|to)\s+(?=\S+\s*$)/, ""); // "a book" → "book", "to go" → "go" (single-word answers only)
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Latin accents: â → a
    .replace(/[\u064b-\u065f\u0670]/g, "") // Arabic harakat, madda, hamza above
    .replace(/[^\p{L}\p{N}]/gu, ""); // punctuation, apostrophes, hyphens, spaces
}

export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const up = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = up;
    }
  }
  return prev[b.length];
}

/**
 * Typos allowed for an answer of this length. The spec allows 1 for words up
 * to 6 letters; we make 1–2 letter answers exact, since one edit there turns
 * "na" (no) into "ne" or "do" (two) into "to" (you).
 */
export function tolerance(len: number): number {
  if (len <= 2) return 0;
  if (len <= 6) return 1;
  return 2;
}

export function checkAnswer(input: string, accepted: string[], opts: CheckOptions = {}): CheckResult {
  const key = normalize(input, opts.lang);
  let best: CheckResult = { verdict: "wrong", closest: accepted[0] ?? "" };
  let bestDist = Infinity;
  if (!key) return best;
  // "grandmother" is two edits from "grandfather" — knowing it's another
  // word's answer stops it being accepted as a typo.
  const isOtherAnswer = opts.reject?.some((r) => normalize(r, opts.lang) === key) ?? false;

  for (const answer of accepted) {
    const target = normalize(answer, opts.lang);
    if (!target) continue;
    const d = editDistance(key, target);
    if (d === 0) return { verdict: "correct", closest: answer };
    if (d < bestDist) {
      bestDist = d;
      const close = d <= tolerance(target.length) && !isOtherAnswer;
      best = { verdict: close ? "almost" : "wrong", closest: answer };
    }
  }
  return best;
}
