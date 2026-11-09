import { describe, expect, it } from "vitest";
import { formatCode, newCode, normaliseCode, shouldPull } from "./sync";

describe("sync codes", () => {
  it("makes 26-character base32 codes", () => {
    const c = newCode();
    expect(c).toMatch(/^[a-z2-7]{26}$/);
    expect(newCode()).not.toBe(c);
  });
  it("reads a code however it's typed", () => {
    const c = newCode();
    expect(normaliseCode(formatCode(c).toUpperCase())).toBe(c);
    expect(normaliseCode(` ${formatCode(c)} `)).toBe(c);
    expect(normaliseCode("too-short")).toBeNull();
  });
  it("pulls only when the remote copy is newer than the last sync", () => {
    expect(shouldPull("2026-11-09T10:00:00Z", null)).toBe(true);
    expect(shouldPull("2026-11-09T10:00:00Z", "2026-11-09T09:00:00Z")).toBe(true);
    expect(shouldPull("2026-11-09T10:00:00Z", "2026-11-09T10:00:00Z")).toBe(false);
  });
});
