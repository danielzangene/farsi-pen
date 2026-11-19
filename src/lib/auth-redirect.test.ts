import { describe, expect, it } from "vitest";
import { DEFAULT_AFTER_SIGN_IN, needsSignIn, safeNext } from "./auth-redirect";

describe("needsSignIn", () => {
  it("guards the app's pages", () => {
    expect(needsSignIn("/app/")).toBe(true);
    expect(needsSignIn("/app/lessons/greetings/")).toBe(true);
    expect(needsSignIn("/app/settings")).toBe(true);
  });

  it("leaves the privacy policy public", () => {
    expect(needsSignIn("/app/privacy/")).toBe(false);
    expect(needsSignIn("/app/privacy")).toBe(false);
  });

  it("doesn't treat a look-alike path as public", () => {
    expect(needsSignIn("/app/privacy-extra/")).toBe(true);
  });
});

describe("safeNext", () => {
  it("keeps paths inside the app", () => {
    expect(safeNext("/app/lessons/greetings/")).toBe("/app/lessons/greetings/");
    expect(safeNext("/app")).toBe("/app");
  });

  it("falls back to the dashboard when nothing was asked for", () => {
    expect(safeNext(null)).toBe(DEFAULT_AFTER_SIGN_IN);
    expect(safeNext("")).toBe(DEFAULT_AFTER_SIGN_IN);
  });

  it("refuses anything that could leave the site or the app", () => {
    for (const bad of ["https://evil.example/", "//evil.example/app/", "/\\evil.example", "/app/../login/", "/login/", "/", "javascript:alert(1)", "/app/\nx"]) {
      expect(safeNext(bad)).toBe(DEFAULT_AFTER_SIGN_IN);
    }
  });
});
