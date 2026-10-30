// Spaced repetition on top of FSRS (spec §7.2).
import { createEmptyCard, fsrs, Rating, State, type Card, type Grade } from "ts-fsrs";

export { Rating, State };
export type { Card };

const scheduler = fsrs({ enable_fuzz: true });

/** Cards as stored in localStorage: dates are ISO strings. */
export type StoredCard = Omit<Card, "due" | "last_review"> & { due: string; last_review?: string };

export function newCard(now = new Date()): StoredCard {
  return toStored(createEmptyCard(now));
}

function toStored(c: Card): StoredCard {
  return { ...c, due: c.due.toISOString(), last_review: c.last_review?.toISOString() };
}

function fromStored(c: StoredCard): Card {
  return { ...c, due: new Date(c.due), last_review: c.last_review ? new Date(c.last_review) : undefined };
}

export function review(card: StoredCard | undefined, grade: Grade, now = new Date()): StoredCard {
  const current = card ? fromStored(card) : createEmptyCard(now);
  return toStored(scheduler.next(current, now, grade).card);
}

/**
 * Grade for a typed recall (spec §7.2): right first time = Good, accepted with
 * a typo = Hard, missed at least once = Again.
 */
export function gradeFor(outcome: "good" | "hard" | "again"): Grade {
  return outcome === "good" ? Rating.Good : outcome === "hard" ? Rating.Hard : Rating.Again;
}

export function isDue(c: StoredCard, now = new Date()): boolean {
  return new Date(c.due).getTime() <= now.getTime();
}

/** A word counts as learned once it has left the learning steps. */
export function isLearned(c: StoredCard): boolean {
  return c.state === State.Review;
}

/**
 * Daily Practice queue: due cards first (most overdue first), then the
 * weakest of the rest (lowest stability, most lapses), capped at `limit`.
 */
export function pickPractice(cards: Record<string, StoredCard>, exclude: Set<string>, limit = 10, now = new Date()): string[] {
  const entries = Object.entries(cards).filter(([id]) => !exclude.has(id));
  const due = entries
    .filter(([, c]) => isDue(c, now))
    .sort(([, a], [, b]) => new Date(a.due).getTime() - new Date(b.due).getTime());
  const rest = entries
    .filter(([, c]) => !isDue(c, now))
    .sort(([, a], [, b]) => a.stability - b.stability || b.lapses - a.lapses);
  return [...due, ...rest].slice(0, limit).map(([id]) => id);
}
