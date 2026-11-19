import { describe, expect, it } from "vitest";
import { LESSONS, LEVELS } from "./lessons";
import { WORD_BY_ID, WORDS } from "./words";
import { normalize } from "@/lib/answer";

describe("vocabulary", () => {
  it("has unique word ids", () => {
    const ids = WORDS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has more than 500 words", () => {
    expect(WORDS.length).toBeGreaterThan(500);
  });

  for (const w of WORDS) {
    it(`${w.id} is complete`, () => {
      for (const f of [w.fa, w.tr, w.en, w.soundsLike, w.example.fa, w.example.tr, w.example.en]) expect(f.trim()).not.toBe("");
      expect(normalize(w.tr)).not.toBe("");
      expect(/[؀-ۿ]/.test(w.fa)).toBe(true);
      expect(/[؀-ۿ]/.test(w.example.fa)).toBe(true);
    });
  }
});

describe("lessons", () => {
  it("every level has lessons and every lesson's words exist", () => {
    for (const level of LEVELS) expect(LESSONS.filter((l) => l.level === level.id).length).toBeGreaterThan(0);
    for (const l of LESSONS) {
      expect(l.wordIds.length).toBeGreaterThanOrEqual(8);
      l.wordIds.forEach((id) => expect(WORD_BY_ID[id], `${l.id}: ${id}`).toBeTruthy());
    }
  });

  it("introduces each word in exactly one lesson", () => {
    const all = LESSONS.flatMap((l) => l.wordIds);
    expect(new Set(all).size).toBe(all.length);
    expect(all.length).toBe(WORDS.length);
  });

  it("numbers lessons in order with unique ids", () => {
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(LESSONS.length);
    LESSONS.forEach((l, i) => expect(l.order).toBe(i + 1));
  });

  it("doesn't put two words with the same English meaning in one lesson", () => {
    for (const l of LESSONS) {
      // Compare the meaning as shown, brackets included: "uncle (father's brother)" ≠ "uncle (mother's brother)".
      const ens = l.wordIds.map((id) => WORD_BY_ID[id].en.toLowerCase().trim());
      expect(new Set(ens).size, l.id).toBe(ens.length);
    }
  });
});
