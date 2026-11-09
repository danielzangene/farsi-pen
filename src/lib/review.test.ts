import { describe, expect, it } from "vitest";
import { reviewItems } from "./review";

describe("review items", () => {
  const items = reviewItems();
  it("cover the whole course with unique ids", () => {
    expect(items.length).toBeGreaterThan(1000);
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
  });
  it("have Persian and a place in the course", () => {
    for (const i of items) {
      expect(/[؀-ۿ]/.test(i.fa), i.id).toBe(true);
      expect(i.context, i.id).toBeTruthy();
    }
  });
});
