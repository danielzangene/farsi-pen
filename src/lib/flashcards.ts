// Flashcard decks and the in-session queue. Ratings feed the same FSRS cards as
// lessons and Daily Practice, so a word studied here is scheduled everywhere.

import { LESSONS } from "@/content/lessons";
import { WORD_BY_ID, WORDS } from "@/content/words";
import { isDue, type StoredCard } from "./srs";
import type { CustomWord, Outcome } from "./store";

export type DeckKind = "today" | "mine" | "lesson";

export const NEW_PER_DAY = 5;
export const MAX_REVIEWS = 20;

export interface Deck {
  ids: string[];
  /** Words that were due or new — only these earn XP. */
  eligible: Set<string>;
}

interface DeckState {
  cards: Record<string, StoredCard>;
  hidden: string[];
  bookmarks: string[];
  customWords?: Record<string, CustomWord>;
}

export function buildDeck(kind: DeckKind, s: DeckState, lessonId?: string, now = new Date()): Deck {
  const hidden = new Set(s.hidden);
  const usable = (id: string) => !hidden.has(id) && (!!WORD_BY_ID[id] || !!s.customWords?.[id]);
  const eligibleOf = (ids: string[]) => new Set(ids.filter((id) => !s.cards[id] || isDue(s.cards[id], now)));
  if (kind === "mine") {
    const ids = s.bookmarks.filter(usable);
    return { ids, eligible: eligibleOf(ids) };
  }
  if (kind === "lesson") {
    const ids = (LESSONS.find((l) => l.id === lessonId)?.wordIds ?? []).filter(usable);
    return { ids, eligible: eligibleOf(ids) };
  }
  // Today: what's due (most overdue first), then a few new words in course order.
  const due = Object.entries(s.cards)
    .filter(([id, c]) => usable(id) && isDue(c, now))
    .sort((a, b) => a[1].due.localeCompare(b[1].due))
    .slice(0, MAX_REVIEWS)
    .map(([id]) => id);
  const fresh = WORDS.map((w) => w.id)
    .filter((id) => usable(id) && !s.cards[id])
    .slice(0, NEW_PER_DAY);
  const ids = [...due, ...fresh];
  return { ids, eligible: new Set(ids) };
}

/** How far back a missed card goes in the queue. */
export const AGAIN_GAP = 3;

export interface QueueState {
  queue: string[];
  /** First rating of each card this session (what FSRS sees). */
  outcomes: Record<string, Outcome>;
  /** Cards that were missed at least once and later recalled. */
  relearned: string[];
}

export function startQueue(ids: string[]): QueueState {
  return { queue: [...ids], outcomes: {}, relearned: [] };
}

/** Applies a rating to the card at the front. "again" puts it back AGAIN_GAP cards later. */
export function rate(q: QueueState, outcome: Outcome): QueueState {
  const [id, ...rest] = q.queue;
  if (!id) return q;
  const first = id in q.outcomes;
  const outcomes = first ? q.outcomes : { ...q.outcomes, [id]: outcome };
  if (outcome === "again") {
    const queue = [...rest];
    queue.splice(Math.min(AGAIN_GAP, queue.length), 0, id);
    return { ...q, queue, outcomes };
  }
  const relearned = first && q.outcomes[id] === "again" && !q.relearned.includes(id) ? [...q.relearned, id] : q.relearned;
  return { queue: rest, outcomes, relearned };
}
