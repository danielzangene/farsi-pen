import { describe, expect, it } from "vitest";
import { reminderDelay, reminderIcs } from "./reminder";

describe("daily reminder", () => {
  it("repeats daily at the chosen local time, starting tomorrow if that time has passed", () => {
    const now = new Date(2026, 10, 2, 20, 0); // 2 Nov, 20:00
    const ics = reminderIcs("19:30", "https://example.com/app/", now);
    expect(ics).toContain("RRULE:FREQ=DAILY");
    expect(ics).toContain("DTSTART:20261103T193000");
    expect(ics).toContain("URL:https://example.com/app/");
    expect(ics).toContain("BEGIN:VALARM");
  });
  it("waits for the reminder time only when it's on, not yet shown and there was no practice", () => {
    const now = new Date(2026, 10, 2, 18, 0);
    expect(reminderDelay("19:30", null, false, "2026-11-02", now)).toBe(90 * 60 * 1000);
    expect(reminderDelay(null, null, false, "2026-11-02", now)).toBeNull();
    expect(reminderDelay("19:30", "2026-11-02", false, "2026-11-02", now)).toBeNull();
    expect(reminderDelay("19:30", null, true, "2026-11-02", now)).toBeNull();
    expect(reminderDelay("17:00", null, false, "2026-11-02", now)).toBeNull();
  });
});
