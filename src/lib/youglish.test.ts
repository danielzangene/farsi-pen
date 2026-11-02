import { describe, expect, it } from "vitest";
import { hasPersianScript } from "./youglish";

describe("youglish helpers", () => {
  it("detects Persian script", () => {
    expect(hasPersianScript("سلام")).toBe(true);
    expect(hasPersianScript("salâm")).toBe(false);
    expect(hasPersianScript("hello خوبی")).toBe(true);
  });
});
