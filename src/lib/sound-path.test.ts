import { describe, expect, it } from "vitest";
import { analyzeSpoken } from "./phonics";
import { nextUp, passedTestOut, PATH_UNITS, stageCount, stageItems, starsFor, stagesDone, testOutItems, unitDone, unitOpen, unitPool } from "./sound-path";

describe("sound path", () => {
  it("gives every unit at least one stage with a word in it", () => {
    for (const u of PATH_UNITS) {
      expect(stageCount(u), u.id).toBeGreaterThanOrEqual(1);
      expect(stageItems(u, 0).length, u.id).toBeGreaterThan(0);
    }
  });
  it("fills most units with 6 stages of 4 words and a sentence", () => {
    const full = PATH_UNITS.filter((u) => stageCount(u) === 6);
    expect(full.length).toBeGreaterThanOrEqual(5);
    for (const u of full) expect(stageItems(u, 0).length, u.id).toBe(5);
  });
  it("only uses words that have the unit's sounds", () => {
    for (const u of PATH_UNITS)
      for (const w of unitPool(u).words) expect(analyzeSpoken([], w.fa).letters.some((l) => u.sounds.includes(l.sound)), `${u.id}: ${w.fa}`).toBe(true);
  });
  it("never repeats a word across stages", () => {
    for (const u of PATH_UNITS) {
      const ids = Array.from({ length: stageCount(u) }, (_, i) => stageItems(u, i).filter((w) => !w.id.startsWith("ex:"))).flat().map((w) => w.id);
      expect(new Set(ids).size, u.id).toBe(ids.length);
    }
  });
  it("reviews the weakest words", () => {
    const u = PATH_UNITS[0];
    const words = unitPool(u).words;
    const review = stageItems(u, stageCount(u), { stars: [], wordScores: { [words[5].id]: 10, [words[2].id]: 20 } });
    expect(review[0].id).toBe(words[5].id);
    expect(review[1].id).toBe(words[2].id);
  });
  it("opens units in order, unless you test out", () => {
    const [a, b] = PATH_UNITS;
    expect(unitOpen(0, {})).toBe(true);
    expect(unitOpen(1, {})).toBe(false);
    expect(unitOpen(1, { [a.id]: { stars: [], testedOut: true } })).toBe(true);
    const full = { stars: Array(stageCount(a) + 1).fill(3) };
    expect(unitDone(a, full)).toBe(true);
    expect(nextUp({ [a.id]: full })?.unit.id).toBe(b.id);
    expect(stagesDone(b, { stars: [2] })).toBe(1);
    expect(nextUp({})).toMatchObject({ index: 0, stage: 0 });
  });
  it("scores stars and test-outs", () => {
    expect(starsFor(5, 5)).toBe(3);
    expect(starsFor(3, 5)).toBe(2);
    expect(starsFor(1, 5)).toBe(1);
    expect(passedTestOut(3, 4)).toBe(true);
    expect(passedTestOut(2, 4)).toBe(false);
    for (const u of PATH_UNITS) expect(testOutItems(u).length, u.id).toBeGreaterThan(0);
  });
});
