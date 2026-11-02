import { describe, expect, it } from "vitest";
import { reminderIcs } from "./reminder";

describe("daily reminder", () => {
  it("repeats daily at the chosen local time, starting tomorrow if that time has passed", () => {
    const now = new Date(2026, 10, 2, 20, 0); // 2 Nov, 20:00
    const ics = reminderIcs("19:30", "https://example.com/app/", now);
    expect(ics).toContain("RRULE:FREQ=DAILY");
    expect(ics).toContain("DTSTART:20261103T193000");
    expect(ics).toContain("URL:https://example.com/app/");
    expect(ics).toContain("BEGIN:VALARM");
  });
});
