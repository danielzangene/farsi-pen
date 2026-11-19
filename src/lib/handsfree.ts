// Hands-free practice: what to play, built from the learner's cards, a
// lesson or a scene. The player (components/HandsFree.tsx) reads each item
// aloud with pauses to answer and repeat.

import { LESSONS } from "@/content/lessons";
import { CAST, isLine, SCENES } from "@/content/scenes";
import { WORD_BY_ID } from "@/content/words";
import type { ProgressState } from "./store";
import { shuffle } from "./util";

export interface HandsFreeItem {
  fa: string;
  tr: string;
  en: string;
  /** Who says it (scenes). */
  who?: string;
}

export type Source = { kind: "mine" } | { kind: "lesson"; id: string } | { kind: "scene"; id: string };

export const MAX_ITEMS = 20;

export function sourceKey(src: Source): string {
  return src.kind === "mine" ? "mine" : `${src.kind}:${src.id}`;
}

export function parseSource(key: string): Source {
  const [kind, id] = key.split(":");
  if (kind === "lesson" && id) return { kind, id };
  if (kind === "scene" && id) return { kind, id };
  return { kind: "mine" };
}

export function buildItems(src: Source, s: Pick<ProgressState, "cards" | "hidden">, rand: () => number = Math.random): HandsFreeItem[] {
  if (src.kind === "scene") {
    const scene = SCENES.find((x) => x.id === src.id);
    return (scene?.script ?? []).filter(isLine).map((l) => ({ fa: l.fa, tr: l.tr, en: l.en, who: CAST[l.who].name }));
  }
  const ids =
    src.kind === "lesson"
      ? (LESSONS.find((l) => l.id === src.id)?.wordIds ?? [])
      : Object.keys(s.cards).filter((id) => !s.hidden.includes(id) && WORD_BY_ID[id]);
  return shuffle(ids, rand)
    .slice(0, MAX_ITEMS)
    .map((id) => WORD_BY_ID[id])
    .filter(Boolean)
    .map((w) => ({ fa: w.fa, tr: w.tr, en: w.en }));
}

/** How long to leave for the learner to repeat a clip that took `ms` to say. */
export function repeatGap(ms: number, pace: "short" | "medium" | "long"): number {
  const f = pace === "short" ? 1.2 : pace === "long" ? 2.2 : 1.6;
  return Math.round(Math.min(9000, Math.max(1500, ms * f + 700)));
}
