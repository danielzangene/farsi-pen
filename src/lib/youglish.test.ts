import { describe, expect, it } from "vitest";
import { hasPersianScript, youglishPageUrl } from "./youglish";

describe("youglish helpers", () => {
  it("detects Persian script", () => {
    expect(hasPersianScript("سلام")).toBe(true);
    expect(hasPersianScript("salâm")).toBe(false);
    expect(hasPersianScript("hello خوبی")).toBe(true);
  });
  it("builds the YouGlish page URL", () => {
    expect(youglishPageUrl(" سلام ")).toBe("https://youglish.com/pronounce/%D8%B3%D9%84%D8%A7%D9%85/persian");
  });
});
