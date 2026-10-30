// XP, levels, streaks and badges (spec §7.3). Pure functions so they can be
// unit-tested and later moved server-side unchanged.

export const XP = {
  perCorrect: 2,
  lessonComplete: 10,
  perfectBonus: 5,
  practicePerCorrect: 1,
  grammarPerCorrect: 2,
  tracePass: 3,
} as const;

// Level names are Farsi Pen's own (pen and writing themed) — DRAFT for review.
export const LEVEL_TABLE: { xp: number; name: string; fa: string; tr: string }[] = [
  { xp: 0, name: "Blank Page", fa: "صفحهٔ سفید", tr: "safhe-ye sefid" },
  { xp: 100, name: "First Dot", fa: "نقطهٔ اول", tr: "noghte-ye avval" },
  { xp: 250, name: "Ink Drop", fa: "قطرهٔ جوهر", tr: "ghatre-ye johar" },
  { xp: 500, name: "Pencil", fa: "مداد", tr: "medâd" },
  { xp: 1000, name: "Notebook", fa: "دفتر", tr: "daftar" },
  { xp: 1750, name: "Reed Pen", fa: "قلم نی", tr: "ghalam-e ney" },
  { xp: 2750, name: "Letter Writer", fa: "نامه\u200cنویس", tr: "nâme-nevis" },
  { xp: 4000, name: "Storyteller", fa: "قصه\u200cگو", tr: "ghesse-gu" },
  { xp: 6000, name: "Calligrapher", fa: "خوشنویس", tr: "khoshnevis" },
  { xp: 9000, name: "Orator", fa: "سخنور", tr: "sokhanvar" },
  { xp: 13000, name: "Librarian", fa: "کتابدار", tr: "ketâbdâr" },
  { xp: 18000, name: "Translator", fa: "مترجم", tr: "motarjem" },
  { xp: 25000, name: "Author", fa: "نویسنده", tr: "nevisande" },
  { xp: 35000, name: "Golden Pen", fa: "قلم طلایی", tr: "ghalam-e talâyi" },
];

export function levelFor(xp: number) {
  let i = 0;
  while (i + 1 < LEVEL_TABLE.length && xp >= LEVEL_TABLE[i + 1].xp) i++;
  const current = LEVEL_TABLE[i];
  const next = LEVEL_TABLE[i + 1];
  const span = next ? next.xp - current.xp : 1;
  return {
    number: i + 1,
    current,
    next,
    toNext: next ? next.xp - xp : 0,
    progress: next ? (xp - current.xp) / span : 1,
  };
}

/** Local calendar date as YYYY-MM-DD (the user's own time zone). */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function previousDay(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
}

export interface Streak {
  current: number;
  record: number;
  /** Last day the daily goal was met. */
  lastDay: string | null;
}

/** Call when the daily goal is met on `today`. Idempotent within a day. */
export function extendStreak(s: Streak, today: string): Streak {
  if (s.lastDay === today) return s;
  const current = s.lastDay === previousDay(today) ? s.current + 1 : 1;
  return { current, record: Math.max(s.record, current), lastDay: today };
}

/** The streak as it should be displayed: 0 if a day was missed. */
export function liveStreak(s: Streak, today: string): number {
  if (!s.lastDay) return 0;
  return s.lastDay === today || s.lastDay === previousDay(today) ? s.current : 0;
}

export interface BadgeStats {
  lessonsDone: number;
  totalLessons: number;
  wordsLearned: number;
  recordStreak: number;
  xp: number;
  lettersTraced: number;
  totalLetters: number;
  grammarDone: number;
  totalGrammar: number;
}

export interface Badge {
  id: string;
  emoji: string;
  name: string;
  description: string;
  progress: (s: BadgeStats) => [number, number];
}

export const BADGES: Badge[] = [
  { id: "first-lesson", emoji: "🌱", name: "First Words", description: "Finish your first lesson", progress: (s) => [Math.min(s.lessonsDone, 1), 1] },
  { id: "level-1", emoji: "📗", name: "Level 1 Done", description: "Finish every Level 1 lesson", progress: (s) => [s.lessonsDone, s.totalLessons] },
  { id: "streak-3", emoji: "🔥", name: "Warm Ink", description: "Reach a 3-day streak", progress: (s) => [Math.min(s.recordStreak, 3), 3] },
  { id: "streak-7", emoji: "🔥", name: "One Week", description: "Reach a 7-day streak", progress: (s) => [Math.min(s.recordStreak, 7), 7] },
  { id: "streak-30", emoji: "🌙", name: "A Month of Farsi", description: "Reach a 30-day streak", progress: (s) => [Math.min(s.recordStreak, 30), 30] },
  { id: "words-25", emoji: "🗂️", name: "Word Collector", description: "Learn 25 words", progress: (s) => [Math.min(s.wordsLearned, 25), 25] },
  { id: "words-100", emoji: "📚", name: "Hundred Words", description: "Learn 100 words", progress: (s) => [Math.min(s.wordsLearned, 100), 100] },
  { id: "xp-100", emoji: "⭐", name: "100 XP", description: "Earn 100 XP", progress: (s) => [Math.min(s.xp, 100), 100] },
  { id: "xp-1000", emoji: "🌟", name: "1,000 XP", description: "Earn 1,000 XP", progress: (s) => [Math.min(s.xp, 1000), 1000] },
  { id: "first-trace", emoji: "✍️", name: "First Stroke", description: "Trace your first letter", progress: (s) => [Math.min(s.lettersTraced, 1), 1] },
  { id: "all-letters", emoji: "🖋️", name: "Full Alphabet", description: "Trace all 32 letters", progress: (s) => [s.lettersTraced, s.totalLetters] },
  { id: "grammar", emoji: "🧩", name: "Grammar Starter", description: "Pass every grammar lesson", progress: (s) => [s.grammarDone, s.totalGrammar] },
];

export function earnedBadges(stats: BadgeStats): Set<string> {
  return new Set(
    BADGES.filter((b) => {
      const [have, need] = b.progress(stats);
      return need > 0 && have >= need;
    }).map((b) => b.id),
  );
}
