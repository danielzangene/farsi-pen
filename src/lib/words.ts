// One place to resolve a word id: course words, or words the learner added
// from the dictionary (stored in progress as customWords).
import { WORD_BY_ID, type Word } from "@/content/words";
import type { CustomWord } from "./store";

export function isCustomId(id: string): boolean {
  return id.startsWith("custom:");
}

export function customToWord(id: string, c: CustomWord): Word {
  return {
    id,
    fa: c.fa,
    tr: c.tr ?? "",
    en: c.en,
    pos: "phrase",
    register: "both",
    soundsLike: "",
    example: { en: c.example?.[0] ?? "", fa: c.example?.[1] ?? "", tr: "" },
  };
}

export function getWord(id: string, customWords: Record<string, CustomWord> | undefined): Word | undefined {
  const course = WORD_BY_ID[id];
  if (course) return course;
  const c = customWords?.[id];
  return c ? customToWord(id, c) : undefined;
}
