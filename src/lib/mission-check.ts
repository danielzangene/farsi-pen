// Checks free answers in missions (sentence building, role-play, final check).
//
// Free answers can't be matched against one exact sentence: learners add
// "salâm", reorder phrases, or answer by voice. So each task lists the key
// pieces an answer must contain — groups of alternatives, each written in both
// transliteration and Persian script — and we look for every group anywhere in
// the answer, allowing small typos. Persian-script answers (typed or from
// speech recognition) are compared by sound, so صلام matches سلام.

import { normalize, tolerance } from "./answer";
import { soundKey } from "./pronounce";
import { hasPersianScript } from "./youglish";

export type TaskVerdict = "correct" | "almost" | "wrong";

export interface TaskResult {
  verdict: TaskVerdict;
  /** First alternative of the first group that wasn't found. */
  missing: string | null;
}

/** Smallest edit distance between `needle` and any substring of `hay` (Sellers' algorithm). */
export function substringDistance(hay: string, needle: string): number {
  if (!needle) return 0;
  if (hay.includes(needle)) return 0;
  let prev = Array.from({ length: hay.length + 1 }, () => 0);
  for (let i = 1; i <= needle.length; i++) {
    const cur = [i];
    for (let j = 1; j <= hay.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (needle[i - 1] === hay[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return Math.min(...prev);
}

function key(text: string, persian: boolean): string {
  return persian ? soundKey(text) : normalize(text, "en");
}

/** Checks one answer (or several speech alternatives) against the required groups. */
export function checkTask(answers: string | string[], must: string[][]): TaskResult {
  const list = (Array.isArray(answers) ? answers : [answers]).filter((a) => a.trim());
  let best: TaskResult = { verdict: "wrong", missing: must[0]?.[0] ?? null };
  let bestRank = -1;
  for (const answer of list) {
    const persian = hasPersianScript(answer);
    const hay = key(answer, persian);
    let approx = false;
    let missing: string | null = null;
    for (const group of must) {
      const candidates = group.filter((c) => hasPersianScript(c) === persian);
      let found: "exact" | "approx" | null = null;
      for (const c of candidates.length ? candidates : group) {
        const k = key(c, persian);
        if (!k) continue;
        const d = substringDistance(hay, k);
        if (d === 0) {
          found = "exact";
          break;
        }
        if (d <= tolerance(k.length)) found = "approx";
      }
      if (!found) {
        missing = group[0];
        break;
      }
      if (found === "approx") approx = true;
    }
    const result: TaskResult = missing ? { verdict: "wrong", missing } : { verdict: approx ? "almost" : "correct", missing: null };
    const rank = result.verdict === "correct" ? 2 : result.verdict === "almost" ? 1 : 0;
    if (rank > bestRank) {
      best = result;
      bestRank = rank;
    }
    if (rank === 2) break;
  }
  return best;
}
