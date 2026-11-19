import { describe, expect, it } from "vitest";
import { changedColumns, fromRow, toRow } from "./profile-row";
import { DEFAULT_STATE } from "./store";

const settings = { ...DEFAULT_STATE.settings, name: "  Sara ", goal: "family" as const, reads: "no" as const, dailyGoal: 20, scriptOnly: true };

describe("profile rows", () => {
  it("round-trips the synced settings and trims the name", () => {
    const row = toRow(settings);
    expect(row.name).toBe("Sara");
    expect(row.daily_goal).toBe(20);
    expect([row.goal, row.reads, row.direction, row.script]).toEqual(["FAMILY", "NO", "FA_EN", "LATIN"]);
    expect(fromRow(row)).toEqual({
      name: "Sara",
      goal: "family",
      reads: "no",
      dailyGoal: 20,
      direction: "fa-en",
      script: "latin",
      scriptOnly: true,
      showKeyboard: true,
      checklistHidden: false,
    });
  });

  it("never carries the theme", () => {
    expect(Object.keys(toRow({ ...settings, theme: "light" }))).not.toContain("theme");
    expect(fromRow(toRow(settings))).not.toHaveProperty("theme");
  });

  it("carries the profile photo", () => {
    const url = "https://lh3.googleusercontent.com/a/photo";
    expect(toRow({ ...settings, avatarUrl: url }).avatar_url).toBe(url);
    expect(fromRow({ avatar_url: url })).toEqual({ avatarUrl: url });
  });

  it("never un-answers the welcome questions", () => {
    expect(fromRow({ onboarded: false })).toEqual({});
    expect(fromRow({ onboarded: true })).toEqual({ onboarded: true });
  });

  it("leaves out columns not chosen yet", () => {
    expect(fromRow({ name: "Ali", goal: null, daily_goal: null, show_keyboard: false })).toEqual({ name: "Ali", showKeyboard: false });
  });

  it("reads Postgres enum values back as the app's own", () => {
    expect(fromRow({ goal: "HERITAGE", reads: "SOME", direction: "EN_FA", script: "FARSI" })).toEqual({
      goal: "heritage",
      reads: "some",
      direction: "en-fa",
      script: "farsi",
    });
  });

  it("sends only what changed, plus anything the server lacks", () => {
    const row = toRow(settings);
    expect(changedColumns(row, row)).toEqual({});
    expect(changedColumns(row, { ...row, daily_goal: 5 })).toEqual({ daily_goal: 5 });
    expect(changedColumns({ ...row, goal: null }, row)).toEqual({ goal: "FAMILY" });
  });
});
