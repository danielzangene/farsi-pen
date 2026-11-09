// The sound path: units for the Persian sounds English speakers find hard,
// each with short stages (4 words + 1 sentence) and a review of your weakest
// words. Stars per stage come from how many items you said well. A unit can
// be skipped by testing out of it.

import type { Tone } from "@/components/ui";
import { WORDS, type Word } from "@/content/words";
import { analyzeSpoken } from "./phonics";
import { VOWEL_IN_TR, wordsForSound } from "./sound-workout";
import type { SoundPathRecord } from "./store";

export interface PathUnit {
  id: string;
  /** Sound ids practised (content/sounds.ts). */
  sounds: string[];
  title: string;
  /** Letters shown on the unit badge. */
  badge: string;
  subtitle: string;
  tone: Tone;
}

export const PATH_UNITS: PathUnit[] = [
  { id: "kh", sounds: ["kh"], title: "kh, not k", badge: "خ", subtitle: "A rough sound at the back of the mouth", tone: "firuze" },
  { id: "gh", sounds: ["gh"], title: "The gh sound", badge: "ق غ", subtitle: "A soft gargle, not a g", tone: "plum" },
  { id: "r", sounds: ["r"], title: "A tapped r", badge: "ر", subtitle: "One flick of the tongue", tone: "sky" },
  { id: "aa-a", sounds: ["aa", "a"], title: "â or a", badge: "آ اَ", subtitle: "Long and round, or short and bright", tone: "saffron" },
  { id: "u-o", sounds: ["u", "o"], title: "u or o", badge: "او", subtitle: "Rounded lips that stay still", tone: "pista" },
  { id: "i-e", sounds: ["i", "e"], title: "i or e", badge: "ای", subtitle: "A smile for i, relaxed for e", tone: "anar" },
  { id: "h", sounds: ["h"], title: "Keep every h", badge: "ه ح", subtitle: "Even at the end of a syllable", tone: "firuze" },
  { id: "zh", sounds: ["zh"], title: "The zh sound", badge: "ژ", subtitle: "Like the s in “measure”", tone: "plum" },
];

export const WORDS_PER_STAGE = 4;
export const MAX_STAGES = 6;

const has = (text: string, tr: string, sounds: string[]) => {
  const found = new Set(analyzeSpoken([], text).letters.map((l) => l.sound));
  return sounds.some((s) => found.has(s) && (!VOWEL_IN_TR[s] || new RegExp(VOWEL_IN_TR[s].source.replace("^'?", "\\b'?")).test(tr)));
};

const pools = new Map<string, { words: Word[]; sentences: Word[] }>();

/** Practice words (interleaving the sounds of a contrast unit) and short example sentences. */
export function unitPool(u: PathUnit): { words: Word[]; sentences: Word[] } {
  const cached = pools.get(u.id);
  if (cached) return cached;
  const lists = u.sounds.map((s) => wordsForSound(s, 40));
  const seen = new Set<string>();
  const words: Word[] = [];
  for (let i = 0; words.length < WORDS_PER_STAGE * MAX_STAGES && lists.some((l) => i < l.length); i++)
    for (const l of lists) {
      const w = l[i];
      if (w && !seen.has(w.id) && words.length < WORDS_PER_STAGE * MAX_STAGES) {
        seen.add(w.id);
        words.push(w);
      }
    }
  const sentences: Word[] = [];
  const seenFa = new Set<string>();
  for (const w of WORDS) {
    const ex = w.example;
    if (!ex || seenFa.has(ex.fa) || ex.fa.split(/\s+/).length > 7 || !has(ex.fa, ex.tr, u.sounds)) continue;
    seenFa.add(ex.fa);
    sentences.push({ id: `ex:${w.id}`, fa: ex.fa, tr: ex.tr, en: ex.en, pos: "phrase", register: w.register, soundsLike: ex.tr, example: ex });
  }
  sentences.sort((a, b) => a.fa.length - b.fa.length);
  const pool = { words, sentences };
  pools.set(u.id, pool);
  return pool;
}

/** Number of regular stages (the review comes after them). */
export function stageCount(u: PathUnit): number {
  return Math.max(1, Math.min(MAX_STAGES, Math.floor(unitPool(u).words.length / WORDS_PER_STAGE)));
}

/** Items for stage `i`, or the review when i === stageCount(u). */
export function stageItems(u: PathUnit, i: number, rec?: SoundPathRecord): Word[] {
  const { words, sentences } = unitPool(u);
  const n = stageCount(u);
  if (i < n) {
    const w = words.slice(i * WORDS_PER_STAGE, (i + 1) * WORDS_PER_STAGE);
    const s = sentences[i % Math.max(1, sentences.length)];
    return s ? [...w, s] : w;
  }
  // Review: the words you found hardest (lowest stars first), then two sentences.
  const used = words.slice(0, n * WORDS_PER_STAGE);
  const weak = [...used].sort((a, b) => (rec?.wordScores?.[a.id] ?? 50) - (rec?.wordScores?.[b.id] ?? 50)).slice(0, WORDS_PER_STAGE);
  return [...weak, ...sentences.slice(n, n + 2)];
}

/** A quick check to skip the unit: words from the later stages plus a sentence. */
export function testOutItems(u: PathUnit): Word[] {
  const { words, sentences } = unitPool(u);
  const pick = words.length > 6 ? [words[words.length - 1], words[Math.floor(words.length / 2)], words[2]] : words.slice(0, 3);
  return [...pick, ...(sentences.length ? [sentences[sentences.length - 1]] : [])];
}

export function starsFor(correct: number, total: number): 1 | 2 | 3 {
  const r = total ? correct / total : 0;
  return r >= 0.9 ? 3 : r >= 0.6 ? 2 : 1;
}

/** Tested out: at least 3 of 4 said well (with no misses on short tests). */
export function passedTestOut(correct: number, total: number): boolean {
  return total > 0 && correct / total >= 0.75;
}

export function unitDone(u: PathUnit, rec?: SoundPathRecord): boolean {
  if (rec?.testedOut) return true;
  return !!rec && (rec.stars?.length ?? 0) >= stageCount(u) + 1;
}

/** Stages done in a unit (the review counts as one). */
export function stagesDone(u: PathUnit, rec?: SoundPathRecord): number {
  if (rec?.testedOut) return stageCount(u) + 1;
  return Math.min(stageCount(u) + 1, rec?.stars?.length ?? 0);
}

/** A unit opens once the one before it is done (or you test out of it). */
export function unitOpen(index: number, all: Record<string, SoundPathRecord>): boolean {
  return index === 0 || unitDone(PATH_UNITS[index - 1], all[PATH_UNITS[index - 1].id]);
}

/** The next stage to play: the first open unit that isn't done, at its first unplayed stage. */
export function nextUp(all: Record<string, SoundPathRecord>): { unit: PathUnit; index: number; stage: number } | null {
  for (let i = 0; i < PATH_UNITS.length; i++) {
    const u = PATH_UNITS[i];
    if (!unitDone(u, all[u.id])) return { unit: u, index: i, stage: stagesDone(u, all[u.id]) };
  }
  return null;
}
