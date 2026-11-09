// Every Persian string the app can play (words, examples, letters, grammar,
// missions, scenes, sounds, poems), keyed by audioKey. scripts/make-audio.py
// records them; audio.test.ts checks none is missing a clip.
import { LETTERS } from "@/content/alphabet";
import { GRAMMAR } from "@/content/grammar";
import { LESSONS } from "@/content/lessons";
import { MISSIONS } from "@/content/missions";
import * as poems from "@/content/poems";
import { READINGS } from "@/content/readings";
import { CONNECTORS, SPEAKING_TASKS, WRITING_TASKS } from "@/content/samfa";
import { SCENES } from "@/content/scenes";
import { SOUNDS } from "@/content/sounds";
import { WORDS } from "@/content/words";
import * as alphabet from "@/content/alphabet";

import { audioKey, audioText } from "./audio-key";

export function collectAudioTexts(): Record<string, string> {
  const PERSIAN = /[؀-ۿ]/;
  const out = new Map<string, string>();
  const seen = new Set<unknown>();

  function add(s: string) {
    const t = audioText(s);
    if (!t || !PERSIAN.test(t) || /[A-Za-z]/.test(t)) return;
    const k = audioKey(t);
    const prev = out.get(k);
    if (prev && prev !== t) throw new Error(`Key collision: ${prev} / ${t}`);
    out.set(k, t);
  }

  function walk(v: unknown, key = "") {
    if (v === null || typeof v !== "object") {
      if (typeof v === "string" && ["fa", "char", "cue", "model", "spoken"].includes(key))
        add(v);
      return;
    }
    if (seen.has(v)) return;
    seen.add(v);
    if (Array.isArray(v)) {
      for (const x of v) {
        if (typeof x === "string" && key === "lines") add(x);
        else walk(x, key);
      }
      return;
    }
    for (const [k, x] of Object.entries(v)) walk(x, k);
  }

  [
    WORDS,
    LETTERS,
    alphabet,
    GRAMMAR,
    LESSONS,
    MISSIONS,
    poems,
    SCENES,
    SOUNDS,
    READINGS,
    WRITING_TASKS,
    SPEAKING_TASKS,
    CONNECTORS,
  ].forEach((m) => walk(m));
  add("سلام، حال شما چطور است؟"); // Settings voice test

  return Object.fromEntries([...out.entries()].sort());
}
