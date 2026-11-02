import { describe, expect, it } from "vitest";
import { checkSpoken, soundKey } from "./pronounce";

describe("soundKey", () => {
  it("merges letters that sound the same", () => {
    expect(soundKey("صلام")).toBe(soundKey("سلام"));
    expect(soundKey("طهران")).toBe(soundKey("تهران"));
    expect(soundKey("ذهن")).toBe(soundKey("زهن"));
    expect(soundKey("آب")).toBe(soundKey("اب"));
  });
  it("ignores Arabic letter variants, spaces, ZWNJ and punctuation", () => {
    expect(soundKey("مي‌بينمت!")).toBe(soundKey("می بینمت"));
    expect(soundKey("كتاب")).toBe(soundKey("کتاب"));
  });
});

describe("checkSpoken", () => {
  it("accepts an exact or sound-alike transcript", () => {
    expect(checkSpoken(["سلام"], ["سلام"]).verdict).toBe("correct");
    expect(checkSpoken(["صلام"], ["سلام"]).verdict).toBe("correct");
  });
  it("picks the best of several alternatives", () => {
    const r = checkSpoken(["سلامت", "سلام"], ["سلام"]);
    expect(r.verdict).toBe("correct");
    expect(r.heard).toBe("سلام");
  });
  it("calls one sound off 'almost'", () => {
    const r = checkSpoken(["مرسا"], ["مرسی"]);
    expect(r.verdict).toBe("almost");
    expect(r.score).toBe(75);
  });
  it("rejects a different word", () => {
    expect(checkSpoken(["خداحافظ"], ["سلام"]).verdict).toBe("wrong");
    expect(checkSpoken([], ["سلام"]).verdict).toBe("wrong");
  });
  it("keeps very short words strict", () => {
    expect(checkSpoken(["نه"], ["نه"]).verdict).toBe("correct");
    expect(checkSpoken(["بله"], ["نه"]).verdict).toBe("wrong");
  });
});
