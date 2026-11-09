// Sound workout: a short speaking session aimed at the learner's weakest
// Persian sounds. Sounds come from their own spoken takes (soundStats);
// sounds never tried are brought in next, in the guide's order. Practice
// words are short course words that contain the sound.

import { HARD_SOUNDS } from "@/content/sounds";
import { WORDS, type Word } from "@/content/words";
import { analyzeSpoken } from "./phonics";
import type { SoundStat } from "./store";

/** A sound counts as solid once its running score reaches this. */
export const SOUND_SOLID = 85;

let index: Map<string, Word[]> | null = null;

// Persian script leaves vowels ambiguous (initial ا can be a, e or o), so a
// word only practises a vowel if its transliteration has it there too.
export const VOWEL_IN_TR: Record<string, RegExp> = { aa: /â/, a: /^'?a/, u: /u/, i: /i/, o: /o/, e: /e/ };

/** Sounds the recogniser can't score (the light glottal catch is folded away). */
const UNSCORED = new Set(["glottal"]);

/** Short single words that contain each sound, shortest first. */
function wordIndex(): Map<string, Word[]> {
  if (index) return index;
  index = new Map();
  const seen = new Set<string>();
  const candidates = WORDS.filter((w) => !/[\s‌]/.test(w.fa) && [...w.fa].length <= 7 && !seen.has(w.fa) && seen.add(w.fa)).sort(
    (a, b) => [...a.fa].length - [...b.fa].length,
  );
  for (const w of candidates) {
    const sounds = new Set(analyzeSpoken([], w.fa).letters.map((l) => l.sound).filter(Boolean));
    sounds.forEach((s) => {
      if (VOWEL_IN_TR[s] && !VOWEL_IN_TR[s].test(w.tr)) return;
      index!.set(s, [...(index!.get(s) ?? []), w]);
    });
  }
  return index;
}

export function wordsForSound(sound: string, limit = 8): Word[] {
  return (wordIndex().get(sound) ?? []).slice(0, limit);
}

export type SoundLevel = "new" | "weak" | "ok" | "solid";

export function soundLevel(stat: SoundStat | undefined): SoundLevel {
  if (!stat) return "new";
  return stat.avg >= SOUND_SOLID ? "solid" : stat.avg >= 60 ? "ok" : "weak";
}

/** The sounds to work on next: weakest tried ones, then untried, then the rest. */
export function pickSounds(stats: Record<string, SoundStat> | undefined, n = 3): string[] {
  const s = stats ?? {};
  const tried = HARD_SOUNDS.filter((x) => s[x.id] && s[x.id].avg < SOUND_SOLID).sort((a, b) => s[a.id].avg - s[b.id].avg);
  const fresh = HARD_SOUNDS.filter((x) => !s[x.id]);
  const solid = HARD_SOUNDS.filter((x) => s[x.id] && s[x.id].avg >= SOUND_SOLID).sort((a, b) => s[a.id].avg - s[b.id].avg);
  return [...tried, ...fresh, ...solid]
    .filter((x) => !UNSCORED.has(x.id) && wordsForSound(x.id, 1).length > 0)
    .slice(0, n)
    .map((x) => x.id);
}

export interface WorkoutItem {
  word: Word;
  sound: string;
}

/** `perSound` words for each sound, picked at random from its shortest candidates. */
export function buildWorkout(sounds: string[], perSound = 3, rand: () => number = Math.random): WorkoutItem[] {
  const used = new Set<string>();
  const items: WorkoutItem[] = [];
  for (const sound of sounds) {
    const pool = wordsForSound(sound, 10).filter((w) => !used.has(w.id));
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    for (const word of pool.slice(0, perSound)) {
      used.add(word.id);
      items.push({ word, sound });
    }
  }
  return items;
}
