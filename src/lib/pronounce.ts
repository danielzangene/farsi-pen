// Pronunciation check: compares what the speech recogniser heard with the
// expected Persian. Speech recognisers write what they *hear*, so letters that
// sound the same in Persian are folded together before comparing — saying
// "salâm" right is never marked wrong because the transcript spelled it صلام.

import { editDistance, normalize } from "./answer";

export type SpeakVerdict = "correct" | "almost" | "wrong";

export interface SpeakResult {
  verdict: SpeakVerdict;
  /** 0–100 similarity between the best transcript and the target. */
  score: number;
  /** The transcript that matched best (as the recogniser wrote it). */
  heard: string;
}

// Groups of letters that are pronounced the same in modern Persian.
const SOUND_ALIKE: [RegExp, string][] = [
  [/[ثص]/g, "س"],
  [/[ذضظ]/g, "ز"],
  [/ط/g, "ت"],
  [/ح/g, "ه"],
  [/غ/g, "ق"],
  [/ة/g, "ه"],
  [/[آأإ]/g, "ا"],
  [/[ؤ]/g, "و"],
  [/[ئ]/g, "ی"],
  [/[عء]/g, ""], // glottal stop is light or silent in everyday speech
];

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Comparison key for spoken Persian: normalised spelling with sound-alike letters merged. */
export function soundKey(text: string): string {
  let s = normalize(text, "fa");
  for (const [re, to] of SOUND_ALIKE) s = s.replace(re, to);
  return s.replace(/[۰-۹٠-٩]/g, (d) => String(Math.max(FA_DIGITS.indexOf(d), AR_DIGITS.indexOf(d))));
}

/** Similarity 0–100 from edit distance. */
export function similarity(a: string, b: string): number {
  if (!a && !b) return 100;
  const len = Math.max(a.length, b.length);
  return Math.round((1 - editDistance(a, b) / len) * 100);
}

/**
 * Best match over every transcript alternative and every accepted form.
 * Correct = same sounds; almost = one sound off (two for long phrases) or ≥ 75% alike.
 */
export function checkSpoken(transcripts: string[], targets: string[]): SpeakResult {
  let best: SpeakResult = { verdict: "wrong", score: 0, heard: transcripts[0] ?? "" };
  for (const heard of transcripts) {
    const h = soundKey(heard);
    if (!h) continue;
    for (const target of targets) {
      const t = soundKey(target);
      if (!t) continue;
      const d = editDistance(h, t);
      const score = similarity(h, t);
      const allowed = t.length <= 2 ? 0 : t.length <= 7 ? 1 : 2;
      const verdict: SpeakVerdict = d === 0 ? "correct" : d <= allowed || score >= 75 ? "almost" : "wrong";
      if (score > best.score || (score === best.score && verdict === "correct")) best = { verdict, score, heard };
      if (verdict === "correct") return best;
    }
  }
  return best;
}
