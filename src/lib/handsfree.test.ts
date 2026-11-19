import { describe, expect, it } from "vitest";
import { LESSONS } from "@/content/lessons";
import { buildItems, MAX_ITEMS, parseSource, repeatGap, sourceKey } from "./handsfree";

describe("hands-free", () => {
  it("round-trips source keys", () => {
    for (const k of ["mine", "lesson:abc", "scene:welcome"]) expect(sourceKey(parseSource(k))).toBe(k);
    expect(parseSource("junk").kind).toBe("mine");
  });
  it("plays a scene in order with speakers", () => {
    const items = buildItems({ kind: "scene", id: "welcome" }, { cards: {}, hidden: [] });
    expect(items[0].who).toBe("Khale Mahin");
    expect(items.length).toBeGreaterThan(5);
  });
  it("uses a lesson's words, capped", () => {
    const items = buildItems({ kind: "lesson", id: LESSONS[0].id }, { cards: {}, hidden: [] });
    expect(items.length).toBe(Math.min(MAX_ITEMS, LESSONS[0].wordIds.length));
  });
  it("is empty with no cards yet", () => {
    expect(buildItems({ kind: "mine" }, { cards: {}, hidden: [] })).toEqual([]);
  });
  it("leaves more time for longer lines and slower pace", () => {
    expect(repeatGap(3000, "medium")).toBeGreaterThan(repeatGap(1000, "medium"));
    expect(repeatGap(1000, "long")).toBeGreaterThan(repeatGap(1000, "short"));
    expect(repeatGap(0, "short")).toBe(1500);
  });
});
