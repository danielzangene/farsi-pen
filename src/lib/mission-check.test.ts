import { describe, expect, it } from "vitest";
import { checkTask, substringDistance } from "./mission-check";

const fare = [
  ["kerâye", "کرایه"],
  ["chande", "chand", "چنده", "چند"],
];

describe("substringDistance", () => {
  it("is 0 for a contained needle and counts edits otherwise", () => {
    expect(substringDistance("bebakhshidkerayechande", "keraye")).toBe(0);
    expect(substringDistance("bebakhshidkerajechande", "keraye")).toBe(1);
  });
});

describe("checkTask", () => {
  it("accepts transliteration in any order with extra words", () => {
    expect(checkTask("bebakhshid, kerâye chande?", fare).verdict).toBe("correct");
    expect(checkTask("chande kerâye aghâ", fare).verdict).toBe("correct");
  });
  it("ignores â and punctuation", () => {
    expect(checkTask("keraye chande", fare).verdict).toBe("correct");
  });
  it("allows a small typo as almost", () => {
    expect(checkTask("kerahe chande", fare).verdict).toBe("almost");
  });
  it("accepts Persian script, compared by sound", () => {
    expect(checkTask("ببخشید کرایه چنده؟", fare).verdict).toBe("correct");
  });
  it("reports the missing piece", () => {
    const r = checkTask("salâm, chande?", fare);
    expect(r.verdict).toBe("wrong");
    expect(r.missing).toBe("kerâye");
  });
  it("takes the best of several speech alternatives", () => {
    expect(checkTask(["سلام", "کرایه چنده"], fare).verdict).toBe("correct");
  });
  it("keeps short pieces exact", () => {
    expect(checkTask("نون و پنیر", [["shir", "شیر"]]).verdict).toBe("wrong");
  });
  it("rejects off-topic answers", () => {
    expect(checkTask("ahl-e kânâdâ hastam", [["hastam", "هستم"]], ["ahl", "اهل"]).verdict).toBe("wrong");
    expect(checkTask("man aleks hastam", [["hastam", "هستم"]], ["ahl", "اهل"]).verdict).toBe("correct");
  });
  it("is wrong for an empty answer", () => {
    expect(checkTask("  ", fare).verdict).toBe("wrong");
  });
});
