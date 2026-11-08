import { describe, expect, it } from "vitest";
import { completeScene, DEFAULT_STATE, exportProgress, importProgress, recordSounds } from "./store";

describe("progress backup", () => {
  it("round-trips through export and import", () => {
    const backup = JSON.stringify({ app: "farsi-pen", progress: { ...DEFAULT_STATE, xp: 42, bookmarks: ["salam"] } });
    expect(importProgress(backup)).toBe(true);
    const out = JSON.parse(exportProgress());
    expect(out.app).toBe("farsi-pen");
    expect(out.progress.xp).toBe(42);
    expect(out.progress.bookmarks).toEqual(["salam"]);
  });

  it("rejects files that aren't a backup", () => {
    expect(importProgress("not json")).toBe(false);
    expect(importProgress(JSON.stringify({ hello: "world" }))).toBe(false);
  });
});

describe("recordSounds", () => {
  it("keeps a running score per sound, one update per take", () => {
    importProgress(JSON.stringify({ app: "farsi-pen", progress: DEFAULT_STATE }));
    recordSounds([{ sound: "kh", score: 100 }, { sound: "kh", score: 0 }, { sound: "r", score: 100 }]);
    recordSounds([{ sound: "kh", score: 100 }]);
    const stats = JSON.parse(exportProgress()).progress.soundStats;
    expect(stats.kh).toMatchObject({ n: 2, avg: 65 });
    expect(stats.r).toMatchObject({ n: 1, avg: 100 });
  });
});

describe("completeScene", () => {
  it("gives XP for good lines and a bonus for each new part", () => {
    importProgress(JSON.stringify({ app: "farsi-pen", progress: DEFAULT_STATE }));
    expect(completeScene("welcome", "sara", 4, 5)).toBe(13);
    expect(completeScene("welcome", "sara", 5, 5)).toBe(10);
    expect(completeScene("welcome", null, 0, 0)).toBe(0);
    const rec = JSON.parse(exportProgress()).progress.scenes.welcome;
    expect(rec).toMatchObject({ parts: ["sara"], best: 100, plays: 3 });
  });
});
