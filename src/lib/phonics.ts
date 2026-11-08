// Sound-by-sound pronunciation feedback. The recogniser gives up to five
// guesses at what it heard; each letter of the target is aligned against
// every guess (after folding letters that sound alike, see pronounce.ts).
// A letter heard in the best guess is "good", one heard only in a weaker
// guess is "close" (the recogniser wasn't sure), and one never heard is
// "missed" or "off". Letters that carry no sound of their own (diacritics,
// the light glottal ع) are "silent" and never marked.

import { soundKey } from "./pronounce";

export type LetterStatus = "good" | "close" | "off" | "missed" | "silent";

export interface LetterMark {
  /** The letter as written, with any vowel marks that follow it. */
  text: string;
  /** Base letter (no marks). */
  char: string;
  status: LetterStatus;
  /** 0–100 for this letter. */
  score: number;
  /** Sound id (see content/sounds.ts), or "" for spaces/silent marks. */
  sound: string;
  /** Short Latin label for the sound in this position, e.g. "kh", "â". */
  label: string;
  /** Joins to the letter before / after it in cursive script. */
  joinPrev: boolean;
  joinNext: boolean;
  space?: boolean;
}

export interface SoundScore {
  sound: string;
  label: string;
  char: string;
  score: number;
  /** Index into `letters`. */
  index: number;
}

export interface PhonicsResult {
  letters: LetterMark[];
  sounds: SoundScore[];
  /** Mean letter score, 0–100. */
  accuracy: number;
  /** Share of the target's sounds that were heard at all, 0–100. */
  completeness: number;
  /** The guess the marks are based on. */
  heard: string;
}

const MARK = /[ً-ٰٟٓ-ٕ]/;
const LETTER = /[ء-يٱ-ۓۺ-ۿ]/;
/** Letters that never join to the letter after them. */
const NON_JOINING = new Set([..."اآأإدذرزژوؤءة"]);

// sound id + default label per letter (context rules adjust vowels below)
const SOUND: Record<string, [string, string]> = {
  آ: ["aa", "â"], ا: ["aa", "â"], أ: ["aa", "a"], إ: ["aa", "e"],
  ب: ["b", "b"], پ: ["p", "p"], ت: ["t", "t"], ط: ["t", "t"], ث: ["s", "s"], س: ["s", "s"], ص: ["s", "s"],
  ج: ["j", "j"], چ: ["ch", "ch"], ح: ["h", "h"], ه: ["h", "h"], ة: ["h", "e"], خ: ["kh", "kh"],
  د: ["d", "d"], ذ: ["z", "z"], ز: ["z", "z"], ض: ["z", "z"], ظ: ["z", "z"], ر: ["r", "r"], ژ: ["zh", "zh"],
  ش: ["sh", "sh"], ع: ["glottal", "’"], ء: ["glottal", "’"], غ: ["gh", "gh"], ق: ["gh", "gh"],
  ف: ["f", "f"], ک: ["k", "k"], ك: ["k", "k"], گ: ["g", "g"], ل: ["l", "l"], م: ["m", "m"], ن: ["n", "n"],
  و: ["u", "u"], ؤ: ["u", "u"], ی: ["i", "i"], ي: ["i", "i"], ى: ["i", "i"], ئ: ["i", "i"],
};

/** Splits Persian text into letters (with trailing marks) and spaces. */
function split(text: string): { char: string; text: string; space?: boolean }[] {
  const out: { char: string; text: string; space?: boolean; ws?: boolean }[] = [];
  for (const ch of text) {
    const last = out[out.length - 1];
    if (MARK.test(ch) && last && !last.space) last.text += ch;
    else if (/\s|\u200c/.test(ch)) {
      // Collapse runs of whitespace; a half-space shows as nothing but still separates words.
      if (!last?.ws) out.push({ char: " ", text: ch === "\u200c" ? "" : " ", space: true, ws: true });
      else if (ch !== "\u200c" && !last.text) last.text = " ";
    } else if (LETTER.test(ch)) out.push({ char: ch, text: ch });
    else if (!/[\u200d]/.test(ch)) out.push({ char: ch, text: ch, space: true }); // punctuation: shown, not scored
  }
  return out;
}

function soundOf(parts: { char: string; space?: boolean }[], i: number): [string, string] {
  const c = parts[i].char;
  const base = SOUND[c];
  if (!base) return ["", ""];
  const prev = parts[i - 1];
  const next = parts[i + 1];
  const atStart = !prev || prev.space;
  const atEnd = !next || next.space;
  if (c === "ا" && atStart) return ["a", "a/e/o"];
  if (c === "و") {
    if (atStart) return ["v", "v"];
    if (atEnd && prev && !prev.space && SOUND[prev.char]?.[0] !== "aa") return ["o", "o/u"];
    if (next && SOUND[next.char] && "aa u i".includes(SOUND[next.char][0])) return ["v", "v"];
    return ["u", "u"];
  }
  if (c === "ی" || c === "ي" || c === "ى") {
    if (atStart || (next && SOUND[next.char]?.[0] === "aa")) return ["y", "y"];
    if (prev && SOUND[prev.char]?.[0] === "aa") return ["y", "y"];
    return ["i", "i"];
  }
  if (c === "ه" && atEnd && prev && !prev.space && !"اآو".includes(prev.char)) return ["e", "e"];
  return base;
}

/** Edit-distance alignment: for each char of `t`, whether it is matched, substituted or deleted in `h`. */
export function alignChars(t: string, h: string): ("match" | "sub" | "del")[] {
  const n = t.length;
  const m = h.length;
  const d: number[][] = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (t[i - 1] === h[j - 1] ? 0 : 1));
  const out: ("match" | "sub" | "del")[] = new Array(n).fill("del");
  let i = n;
  let j = m;
  while (i > 0) {
    if (j > 0 && d[i][j] === d[i - 1][j - 1] + (t[i - 1] === h[j - 1] ? 0 : 1)) {
      out[i - 1] = t[i - 1] === h[j - 1] ? "match" : "sub";
      i--;
      j--;
    } else if (d[i][j] === d[i - 1][j] + 1) {
      out[i - 1] = "del";
      i--;
    } else j--;
  }
  return out;
}

/**
 * Letter-by-letter marks for `target` given the recogniser's guesses (best first).
 * With several accepted spellings, pass the one shown to the learner.
 */
export function analyzeSpoken(transcripts: string[], target: string): PhonicsResult {
  const parts = split(target);
  // Key char per part ("" for silent / spaces), and where each key char came from.
  const keyOf = parts.map((p) => (p.space ? "" : soundKey(p.char)));
  const owner: number[] = [];
  let key = "";
  keyOf.forEach((k, i) => {
    for (const ch of k) {
      key += ch;
      owner.push(i);
    }
  });

  const guesses = transcripts.map((t) => soundKey(t)).filter(Boolean);
  // Best guess = fewest edits; ties keep recogniser order.
  let bestIdx = 0;
  let bestOps: ("match" | "sub" | "del")[] = key ? new Array(key.length).fill("del") : [];
  let bestCost = Infinity;
  const allOps = guesses.map((g) => alignChars(key, g));
  allOps.forEach((ops, gi) => {
    const cost = ops.filter((o) => o !== "match").length + Math.abs(guesses[gi].length - key.length) * 0.5;
    if (cost < bestCost) {
      bestCost = cost;
      bestIdx = gi;
      bestOps = ops;
    }
  });

  const letters: LetterMark[] = parts.map((p, i) => {
    const [sound, label] = p.space ? ["", ""] : soundOf(parts, i);
    const prev = parts[i - 1];
    const next = parts[i + 1];
    const joinPrev = !p.space && !!prev && !prev.space && !NON_JOINING.has(prev.char);
    const joinNext = !p.space && !NON_JOINING.has(p.char) && !!next && !next.space;
    return { text: p.text, char: p.char, status: "silent", score: 100, sound, label, joinPrev, joinNext, space: p.space };
  });

  const keyIdx = new Map<number, number[]>();
  owner.forEach((part, k) => keyIdx.set(part, [...(keyIdx.get(part) ?? []), k]));
  let heardCount = 0;
  let scored = 0;
  let sum = 0;
  letters.forEach((l, i) => {
    const ks = keyIdx.get(i);
    if (!ks || !guesses.length) {
      if (ks && !guesses.length) {
        l.status = "missed";
        l.score = 0;
        scored++;
      }
      return;
    }
    const inBest = ks.every((k) => bestOps[k] === "match");
    const inOther = ks.every((k) => allOps.some((ops) => ops[k] === "match"));
    const deleted = ks.every((k) => bestOps[k] === "del");
    if (inBest) [l.status, l.score] = ["good", 100];
    else if (inOther) [l.status, l.score] = ["close", 65];
    else if (deleted) [l.status, l.score] = ["missed", 10];
    else [l.status, l.score] = ["off", 30];
    scored++;
    sum += l.score;
    if (l.status !== "missed") heardCount++;
  });

  const sounds: SoundScore[] = letters.flatMap((l, index) => (l.sound && l.status !== "silent" ? [{ sound: l.sound, label: l.label, char: l.char, score: l.score, index }] : []));
  return {
    letters,
    sounds,
    accuracy: scored ? Math.round(sum / scored) : 0,
    completeness: scored ? Math.round((heardCount / scored) * 100) : 0,
    heard: transcripts[bestIdx] ?? "",
  };
}

/** Text for one letter's span, with zero-width joiners so cursive joining survives separate colours. */
export function joinedText(l: LetterMark): string {
  if (l.space) return l.text;
  return (l.joinPrev ? "‍" : "") + l.text + (l.joinNext ? "‍" : "");
}
