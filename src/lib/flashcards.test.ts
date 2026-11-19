import { describe, expect, it } from "vitest";
import { WORDS } from "@/content/words";
import { AGAIN_GAP, buildDeck, NEW_PER_DAY, rate, startQueue } from "./flashcards";
import { newCard, review, Rating } from "./srs";

const empty = { cards: {}, hidden: [], bookmarks: [] };

describe("decks", () => {
  it("today = due reviews first, then a few new words", () => {
    const now = new Date();
    const past = new Date(now.getTime() - 3 * 86_400_000);
    const dueCard = { ...newCard(past), due: past.toISOString() };
    const notDue = review(undefined, Rating.Easy, now);
    const deck = buildDeck("today", { ...empty, cards: { [WORDS[3].id]: dueCard, [WORDS[4].id]: notDue } }, undefined, now);
    expect(deck.ids[0]).toBe(WORDS[3].id);
    expect(deck.ids).not.toContain(WORDS[4].id);
    expect(deck.ids.length).toBe(1 + NEW_PER_DAY);
  });

  it("skips hidden words and only rewards due or new cards", () => {
    const now = new Date();
    const notDue = review(undefined, Rating.Easy, now);
    const deck = buildDeck("mine", { cards: { [WORDS[0].id]: notDue }, hidden: [WORDS[1].id], bookmarks: [WORDS[0].id, WORDS[1].id, WORDS[2].id] }, undefined, now);
    expect(deck.ids).toEqual([WORDS[0].id, WORDS[2].id]);
    expect(deck.eligible.has(WORDS[0].id)).toBe(false);
    expect(deck.eligible.has(WORDS[2].id)).toBe(true);
  });
});

describe("session queue", () => {
  it("puts a missed card back a few places and keeps its first rating", () => {
    let q = startQueue(["a", "b", "c", "d", "e"]);
    q = rate(q, "again");
    expect(q.queue.indexOf("a")).toBe(AGAIN_GAP);
    expect(q.outcomes.a).toBe("again");
    q = rate(q, "good"); // b
    q = rate(q, "good"); // c
    q = rate(q, "good"); // d
    expect(q.queue[0]).toBe("a");
    q = rate(q, "good"); // a, second time
    expect(q.outcomes.a).toBe("again");
    expect(q.relearned).toEqual(["a"]);
  });

  it("ends when every card has been recalled", () => {
    let q = startQueue(["a"]);
    q = rate(q, "again");
    expect(q.queue).toEqual(["a"]);
    q = rate(q, "hard");
    expect(q.queue).toEqual([]);
  });
});
