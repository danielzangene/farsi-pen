// Compact authoring for vocabulary files: one call per word.
import type { Pos, Register, Word } from "../words";

export interface WordOpts {
  alt?: string[];
  altTr?: string[];
  register?: Register;
  note?: string;
}

/**
 * w(id, fa, tr, en, pos, soundsLike, [exampleFa, exampleTr, exampleEn], opts?)
 * register defaults to "both" (used in speech and writing).
 */
export function w(id: string, fa: string, tr: string, en: string, pos: Pos, soundsLike: string, ex: [string, string, string], opts: WordOpts = {}): Word {
  return {
    id,
    fa,
    tr,
    en,
    pos,
    soundsLike,
    register: opts.register ?? "both",
    example: { fa: ex[0], tr: ex[1], en: ex[2] },
    ...(opts.alt ? { alt: opts.alt } : {}),
    ...(opts.altTr ? { altTr: opts.altTr } : {}),
    ...(opts.note ? { note: opts.note } : {}),
  };
}

export interface LessonDraft {
  id: string;
  title: string;
  titleFa: string;
  emoji: string;
  description: string;
  words: Word[];
}
