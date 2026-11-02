import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { faStems, lookupEnglish, lookupPersian } from "./dictionary";

// Serve public/data/dict from disk instead of the network.
beforeAll(() => {
  vi.stubGlobal("fetch", async (url: string) => {
    const path = String(url).replace(/^.*\/data\/dict\//, "");
    try {
      const body = readFileSync(join("public/data/dict", path), "utf8");
      return { ok: true, json: async () => JSON.parse(body) } as Response;
    } catch {
      return { ok: false, json: async () => null } as unknown as Response;
    }
  });
});

describe("dictionary", () => {
  it("looks up English words with examples", async () => {
    const e = await lookupEnglish("house");
    expect(e?.fa).toContain("خانه");
    expect(e?.examples.length).toBeGreaterThan(0);
  });

  it("puts the course word first when there is one", async () => {
    const e = await lookupEnglish("hello");
    expect(e?.course?.id).toBe("salam");
    expect(e?.fa[0]).toBe("سلام");
  });

  it("looks up Persian words, course words first", async () => {
    expect((await lookupPersian("کتاب"))?.course?.id).toBe("ketab");
    const e = await lookupPersian("بیمارستان");
    expect(e?.en).toMatch(/hospital/);
  });

  it("finds a dictionary form under common endings", async () => {
    expect(faStems("کتاب‌ها")).toContain("کتاب");
    expect(faStems("می‌خورم")).toContain("خورم");
    const e = await lookupPersian("درخت‌ها");
    expect(e?.en).toMatch(/tree/);
  });

  it("returns null for unknown words", async () => {
    expect(await lookupEnglish("qzxv")).toBeNull();
  });
});
