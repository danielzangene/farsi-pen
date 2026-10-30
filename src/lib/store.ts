"use client";
// Guest-mode progress store (spec §4.1: "guest mode with local progress").
// Everything lives in localStorage under one key; when accounts arrive this
// object is what gets merged into Supabase on sign-up.

import { useSyncExternalStore } from "react";
import { LESSONS } from "@/content/lessons";
import { LETTERS } from "@/content/alphabet";
import { GRAMMAR } from "@/content/grammar";
import { dayKey, earnedBadges, extendStreak, liveStreak, XP, type BadgeStats, type Streak } from "./gamification";
import { gradeFor, isLearned, review, type StoredCard } from "./srs";

export type Direction = "fa-en" | "en-fa";
export type Outcome = "good" | "hard" | "again";
export type Theme = "system" | "light" | "dark";

export interface Settings {
  name: string;
  dailyGoal: number;
  direction: Direction;
  /** Which writing leads on cards: transliteration or Persian script. */
  script: "latin" | "farsi";
  /** Hide transliteration entirely (reading practice). */
  scriptOnly: boolean;
  showKeyboard: boolean;
  checklistHidden: boolean;
  /** Dark by default; "system" follows the device setting. */
  theme: Theme;
}

export interface ProgressState {
  version: 1;
  xp: number;
  lessons: Record<string, { best: number; attempts: number; completedAt?: string }>;
  cards: Record<string, StoredCard>;
  bookmarks: string[];
  hidden: string[];
  daily: Record<string, { words: number; xp: number }>;
  streak: Streak;
  grammar: Record<string, { best: number; passed: boolean }>;
  traced: Record<string, number>;
  practiceSessions: number;
  earnedBadges: string[];
  settings: Settings;
}

const KEY = "farsipen:v1";

export const DEFAULT_STATE: ProgressState = {
  version: 1,
  xp: 0,
  lessons: {},
  cards: {},
  bookmarks: [],
  hidden: [],
  daily: {},
  streak: { current: 0, record: 0, lastDay: null },
  grammar: {},
  traced: {},
  practiceSessions: 0,
  earnedBadges: [],
  settings: {
    name: "",
    dailyGoal: 10,
    direction: "fa-en",
    script: "latin",
    scriptOnly: false,
    showKeyboard: true,
    checklistHidden: false,
    theme: "dark",
  },
};

let state: ProgressState | null = null;
const listeners = new Set<() => void>();

function load(): ProgressState {
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<ProgressState>) : {};
    state = { ...DEFAULT_STATE, ...parsed, settings: { ...DEFAULT_STATE.settings, ...parsed.settings } };
  } catch {
    state = DEFAULT_STATE;
  }
  return state;
}

function save(next: ProgressState) {
  state = next;
  applyTheme(next.settings.theme);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode or storage full: progress stays in memory for this visit.
  }
  listeners.forEach((l) => l());
}

/** Set <html data-theme>; "system" removes it so the CSS media query decides. */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "system") delete root.dataset.theme;
  else root.dataset.theme = theme;
}

function update(fn: (s: ProgressState) => ProgressState) {
  save(withBadges(fn(load())));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Progress state; the defaults during server render and hydration. */
export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, load, () => DEFAULT_STATE);
}

/** True once the client has loaded saved progress (false during prerender). */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

// ── Derived values ─────────────────────────────────────────────────────────

export function wordsLearned(s: ProgressState): number {
  return Object.values(s.cards).filter(isLearned).length;
}

export function today(s: ProgressState) {
  return s.daily[dayKey()] ?? { words: 0, xp: 0 };
}

export function currentStreak(s: ProgressState): number {
  return liveStreak(s.streak, dayKey());
}

export function badgeStats(s: ProgressState): BadgeStats {
  return {
    lessonsDone: LESSONS.filter((l) => s.lessons[l.id]?.completedAt).length,
    totalLessons: LESSONS.length,
    wordsLearned: wordsLearned(s),
    recordStreak: s.streak.record,
    xp: s.xp,
    lettersTraced: LETTERS.filter((l) => (s.traced[l.id] ?? 0) >= TRACE_PASS).length,
    totalLetters: LETTERS.length,
    grammarDone: GRAMMAR.filter((g) => s.grammar[g.id]?.passed).length,
    totalGrammar: GRAMMAR.length,
  };
}

export const TRACE_PASS = 60;

function withBadges(s: ProgressState): ProgressState {
  const earned = earnedBadges(badgeStats(s));
  // Badges are kept once earned, even if a streak later resets.
  const merged = Array.from(new Set([...s.earnedBadges, ...earned]));
  return merged.length === s.earnedBadges.length ? s : { ...s, earnedBadges: merged };
}

// ── Actions ────────────────────────────────────────────────────────────────

function addActivity(s: ProgressState, words: number, xp: number): ProgressState {
  const key = dayKey();
  const day = s.daily[key] ?? { words: 0, xp: 0 };
  const nextDay = { words: day.words + words, xp: day.xp + xp };
  const goalMet = nextDay.words >= s.settings.dailyGoal;
  return {
    ...s,
    xp: s.xp + xp,
    daily: { ...s.daily, [key]: nextDay },
    streak: goalMet ? extendStreak(s.streak, key) : s.streak,
  };
}

function reviewAll(cards: Record<string, StoredCard>, outcomes: Record<string, Outcome>) {
  const next = { ...cards };
  for (const [id, o] of Object.entries(outcomes)) next[id] = review(cards[id], gradeFor(o));
  return next;
}

export interface SessionSummary {
  correct: number;
  total: number;
  outcomes: Record<string, Outcome>;
}

/** Returns the XP awarded. */
export function completeLesson(lessonId: string, r: SessionSummary): number {
  const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0;
  const xp = r.correct * XP.perCorrect + XP.lessonComplete + (pct === 100 ? XP.perfectBonus : 0);
  update((s) => {
    const prev = s.lessons[lessonId];
    const next: ProgressState = {
      ...s,
      cards: reviewAll(s.cards, r.outcomes),
      lessons: {
        ...s.lessons,
        [lessonId]: {
          best: Math.max(prev?.best ?? 0, pct),
          attempts: (prev?.attempts ?? 0) + 1,
          completedAt: prev?.completedAt ?? new Date().toISOString(),
        },
      },
    };
    return addActivity(next, Object.keys(r.outcomes).length, xp);
  });
  return xp;
}

export function completePractice(r: SessionSummary): number {
  const xp = r.correct * XP.practicePerCorrect;
  update((s) =>
    addActivity(
      { ...s, cards: reviewAll(s.cards, r.outcomes), practiceSessions: s.practiceSessions + 1 },
      Object.keys(r.outcomes).length,
      xp,
    ),
  );
  return xp;
}

export function completeGrammar(id: string, correct: number, total: number): number {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const xp = correct * XP.grammarPerCorrect;
  update((s) => {
    const prev = s.grammar[id];
    return addActivity(
      { ...s, grammar: { ...s.grammar, [id]: { best: Math.max(prev?.best ?? 0, pct), passed: !!prev?.passed || pct >= 80 } } },
      0,
      xp,
    );
  });
  return xp;
}

/** Records a tracing score (0–100); XP the first time a letter passes. */
export function recordTrace(letterId: string, score: number): number {
  let xp = 0;
  update((s) => {
    const prev = s.traced[letterId] ?? 0;
    xp = prev < TRACE_PASS && score >= TRACE_PASS ? XP.tracePass : 0;
    return addActivity({ ...s, traced: { ...s.traced, [letterId]: Math.max(prev, score) } }, 0, xp);
  });
  return xp;
}

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function toggleBookmark(wordId: string) {
  update((s) => ({ ...s, bookmarks: toggle(s.bookmarks, wordId) }));
}

export function toggleHidden(wordId: string) {
  update((s) => ({ ...s, hidden: toggle(s.hidden, wordId) }));
}

export function updateSettings(patch: Partial<Settings>) {
  update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}

export function resetProgress() {
  save({ ...DEFAULT_STATE, settings: load().settings });
}
