import { describe, expect, it } from "vitest";
import { HARD_SOUNDS } from "@/content/sounds";
import { analyzeSpoken } from "./phonics";
import { buildWorkout, pickSounds, soundLevel, wordsForSound } from "./sound-workout";

describe("sound workout", () => {
  it("has practice words for every hard sound", () => {
    for (const s of HARD_SOUNDS) expect(wordsForSound(s.id).length, s.id).toBeGreaterThan(1);
  });
  it("only picks words that contain the sound", () => {
    for (const w of wordsForSound("kh")) expect(analyzeSpoken([], w.fa).letters.some((l) => l.sound === "kh"), w.fa).toBe(true);
  });
  it("starts a new learner on the guide's first sounds", () => {
    expect(pickSounds({})).toEqual(["kh", "gh", "r"]);
    expect(pickSounds({}, 99)).not.toContain("glottal");
  });
  it("puts the weakest tried sounds first and solid ones last", () => {
    const stats = { r: { n: 3, avg: 40, last: "" }, kh: { n: 2, avg: 95, last: "" }, aa: { n: 1, avg: 70, last: "" } };
    const picked = pickSounds(stats, HARD_SOUNDS.length);
    expect(picked.slice(0, 2)).toEqual(["r", "aa"]);
    expect(picked[picked.length - 1]).toBe("kh");
  });
  it("builds a session without repeating words", () => {
    const items = buildWorkout(["kh", "gh", "r"], 3, () => 0.5);
    expect(items).toHaveLength(9);
    expect(new Set(items.map((i) => i.word.id)).size).toBe(9);
  });
  it("levels sounds by running score", () => {
    expect(soundLevel(undefined)).toBe("new");
    expect(soundLevel({ n: 1, avg: 30, last: "" })).toBe("weak");
    expect(soundLevel({ n: 1, avg: 70, last: "" })).toBe("ok");
    expect(soundLevel({ n: 1, avg: 90, last: "" })).toBe("solid");
  });
});
