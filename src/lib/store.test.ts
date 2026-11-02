import { describe, expect, it } from "vitest";
import { DEFAULT_STATE, exportProgress, importProgress } from "./store";

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
