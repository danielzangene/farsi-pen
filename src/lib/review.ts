// Content review: every Persian item in the course as a checklist a native
// speaker can work through — mark it correct, suggest a fix, and record it
// in their own voice. Results stay in this browser until exported; the
// export is applied with scripts/apply-review.mjs.

import { LETTERS } from "@/content/alphabet";
import { GRAMMAR } from "@/content/grammar";
import { MISSIONS } from "@/content/missions";
import { READINGS } from "@/content/readings";
import { SPEAKING_TASKS, WRITING_TASKS } from "@/content/samfa";
import { CAST, isLine, SCENES } from "@/content/scenes";
import { SOUNDS } from "@/content/sounds";
import { WORDS } from "@/content/words";
import { audioKey } from "./audio-key";

export type ReviewCategory = "words" | "examples" | "letters" | "grammar" | "missions" | "scenes" | "reading" | "samfa" | "sounds";

export const CATEGORY_LABEL: Record<ReviewCategory, string> = {
  words: "Words",
  examples: "Example sentences",
  letters: "Alphabet",
  grammar: "Grammar examples",
  missions: "Missions",
  scenes: "Scenes",
  reading: "Reading lessons",
  samfa: "SAMFA",
  sounds: "Sound examples",
};

export interface ReviewItem {
  /** Stable id: category + the audio key of the Persian. */
  id: string;
  category: ReviewCategory;
  /** Where it appears, e.g. "Lesson word · salâm" or "Scene 2 · Sara". */
  context: string;
  fa: string;
  tr?: string;
  en?: string;
}

let cache: ReviewItem[] | null = null;

export function reviewItems(): ReviewItem[] {
  if (cache) return cache;
  const out: ReviewItem[] = [];
  const seen = new Set<string>();
  const add = (category: ReviewCategory, context: string, fa: string, tr?: string, en?: string) => {
    if (!fa || !/[؀-ۿ]/.test(fa)) return;
    const id = `${category}:${audioKey(fa)}`;
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ id, category, context, fa, tr, en });
  };
  for (const w of WORDS) {
    add("words", `Word · ${w.pos}`, w.fa, w.tr, w.en);
    if (w.example) add("examples", `Example for “${w.en}”`, w.example.fa, w.example.tr, w.example.en);
  }
  for (const l of LETTERS) add("letters", `Letter ${l.name}`, l.example.fa, l.example.tr, l.example.en);
  for (const g of GRAMMAR) for (const e of g.examples) add("grammar", `${g.level} · ${g.title}`, e.fa, e.tr, e.en);
  for (const m of MISSIONS) {
    for (const l of m.dialogue) add("missions", `${m.title} · dialogue (${l.who === "you" ? "you" : m.npc.name})`, l.fa, l.tr, l.en);
    for (const p of m.phrases) add("missions", `${m.title} · phrase`, p.fa, p.tr, p.en);
    for (const t of m.tasks) {
      if (t.cue) add("missions", `${m.title} · ${m.npc.name} says`, t.cue.fa, t.cue.tr, t.cue.en);
      add("missions", `${m.title} · model answer`, t.model.fa, t.model.tr, t.model.en);
    }
  }
  for (const sc of SCENES) for (const x of sc.script) if (isLine(x)) add("scenes", `Scene ${sc.episode} · ${CAST[x.who].name}`, x.fa, x.tr, x.en);
  for (const r of READINGS) {
    for (const s of r.text.flat()) add("reading", `Reading ${r.number} · text`, s.fa, undefined, s.en);
    for (const p of r.spoken) add("reading", `Reading ${r.number} · spoken form`, p.spoken, undefined, p.en);
    for (const w of r.keyWords) add("reading", `Reading ${r.number} · key word`, w.fa, w.tr, w.en);
    for (const h of r.news.headlines) add("reading", `Reading ${r.number} · headline`, h.fa, undefined, h.en);
    for (const m of r.task.model) add("reading", `Reading ${r.number} · model answer`, m.fa, undefined, m.en);
  }
  for (const t of WRITING_TASKS) {
    add("samfa", "SAMFA writing · prompt", t.prompt.fa, undefined, t.prompt.en);
    for (const m of t.model) add("samfa", "SAMFA writing · model", m);
  }
  for (const t of SPEAKING_TASKS) {
    add("samfa", "SAMFA speaking · prompt", t.prompt.fa, undefined, t.prompt.en);
    for (const m of t.model) add("samfa", "SAMFA speaking · model", m);
  }
  for (const s of SOUNDS) for (const e of s.examples) add("sounds", `Sound ${s.name}`, e.fa, e.tr, e.en);
  cache = out;
  return out;
}

export interface Verdict {
  ok: boolean;
  /** Corrected Persian, if any. */
  fa?: string;
  /** Corrected transliteration / translation, or a note. */
  note?: string;
  /** A recording exists in IndexedDB under this item id. */
  recorded?: boolean;
  at: string;
}

export interface ReviewExport {
  app: "farsi-pen-review";
  exportedAt: string;
  reviewer: string;
  verdicts: Record<string, Verdict & { text: string }>;
  /** Item id → audio as a data: URL. */
  recordings: Record<string, string>;
}
