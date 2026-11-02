// Persian spelling suggestions ("Did you mean …?").
//
// Peter Norvig's corrector (as adapted for Persian by shahind's
// Persian-Spell-Corrector-PHP), re-implemented here with two learner-specific
// tweaks: swapping letters that sound alike (س/ص/ث, ز/ذ/ض/ظ, ت/ط, ه/ح, ق/غ, ا/آ/ع)
// counts as a smaller mistake than any other edit, and the course's own words
// (including spoken forms) always rank first.
//
// The lexicon is the course vocabulary plus public/data/fa-words.txt (built by
// scripts/build-lexicon.mjs from Persian-Words-Database), loaded on demand.

const LETTERS = "آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی‌".split("");

const SOUND_GROUPS = ["سصث", "زذضظ", "تط", "هح", "قغ", "اآع", "یئ", "وؤ"];
const SOUND_ALIKE = new Map<string, string>();
for (const g of SOUND_GROUPS) for (const ch of g) SOUND_ALIKE.set(ch, g);

export function cleanFa(word: string): string {
  return word
    .trim()
    .replace(/ك/g, "ک")
    .replace(/[يى]/g, "ی")
    .replace(/[ً-ٰٟ]/g, "") // vowel marks
    .replace(/‍/g, "");
}

export interface Lexicon {
  /** word → rank (lower is more common / more relevant). */
  rank: Map<string, number>;
}

export function buildLexicon(priority: string[], general: string[]): Lexicon {
  const rank = new Map<string, number>();
  let i = 0;
  for (const w of priority) {
    const c = cleanFa(w);
    if (c && !rank.has(c)) rank.set(c, i++);
  }
  const offset = 100_000; // general words always rank after course words
  general.forEach((w, j) => {
    const c = cleanFa(w);
    if (c && !rank.has(c)) rank.set(c, offset + j);
  });
  return { rank };
}

/** All strings one edit away; sound-alike substitutions are tagged as cheap. */
function edits1(word: string): Map<string, number> {
  const out = new Map<string, number>();
  const add = (w: string, cost: number) => {
    const prev = out.get(w);
    if (prev === undefined || cost < prev) out.set(w, cost);
  };
  for (let i = 0; i <= word.length; i++) {
    const a = word.slice(0, i);
    const b = word.slice(i);
    if (b) add(a + b.slice(1), 1); // delete
    if (b.length > 1) add(a + b[1] + b[0] + b.slice(2), 1); // transpose
    for (const ch of LETTERS) {
      if (b) {
        const group = SOUND_ALIKE.get(b[0]);
        add(a + ch + b.slice(1), group && group.includes(ch) ? 0.4 : 1); // replace
      }
      add(a + ch + b, ch === "‌" ? 0.3 : 1); // insert (a missing half-space is a tiny slip)
    }
  }
  out.delete(word);
  return out;
}

export interface Suggestion {
  word: string;
  /** Edit cost: < 1 means only sound-alike letters or half-spaces differ. */
  cost: number;
}

/** True when the word (cleaned) is in the lexicon. */
export function isKnown(word: string, lex: Lexicon): boolean {
  return lex.rank.has(cleanFa(word));
}

/** Up to `n` known words close to `word`, best first. Empty when the word is already known. */
export function suggest(word: string, lex: Lexicon, n = 3): Suggestion[] {
  const w = cleanFa(word);
  if (!w || lex.rank.has(w)) return [];
  const found = new Map<string, number>();
  const e1 = edits1(w);
  for (const [cand, cost] of e1) if (lex.rank.has(cand)) found.set(cand, Math.min(found.get(cand) ?? Infinity, cost));
  // Two edits only when one wasn't enough (and for words long enough to be worth it).
  if (found.size === 0 && w.length >= 3) {
    for (const [mid, c1] of e1) {
      for (const [cand, c2] of edits1(mid)) {
        if (!lex.rank.has(cand)) continue;
        const cost = c1 + c2;
        if (cost < (found.get(cand) ?? Infinity)) found.set(cand, cost);
      }
    }
  }
  return [...found.entries()]
    .sort((a, b) => a[1] - b[1] || (lex.rank.get(a[0]) ?? 0) - (lex.rank.get(b[0]) ?? 0))
    .slice(0, n)
    .map(([word, cost]) => ({ word, cost }));
}

// ── Loading ────────────────────────────────────────────────────────────────

let loading: Promise<Lexicon> | null = null;

/** Loads the full lexicon once (course words first, then the general word list). */
export function loadLexicon(priority: string[]): Promise<Lexicon> {
  if (!loading) {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    loading = fetch(`${base}/data/fa-words.txt`)
      .then((r) => (r.ok ? r.text() : ""))
      .catch(() => "")
      .then((text) => buildLexicon(priority, text.split("\n")));
  }
  return loading;
}
