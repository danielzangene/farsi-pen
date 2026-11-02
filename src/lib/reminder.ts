// Daily reminder as a calendar event. A web app can't schedule notifications
// without a push server, but every phone and computer calendar can: one
// repeating event with an alert, and a link straight back to the app.

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** An .ics file for a daily reminder at `time` ("HH:MM", local time). */
export function reminderIcs(time: string, appUrl: string, now = new Date()): string {
  const [h, m] = time.split(":").map((x) => Number(x));
  const start = new Date(now);
  start.setHours(h, m, 0, 0);
  if (start <= now) start.setDate(start.getDate() + 1);
  const local = `${start.getFullYear()}${pad(start.getMonth() + 1)}${pad(start.getDate())}T${pad(h)}${pad(m)}00`;
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Farsi Pen//Daily reminder//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:farsi-pen-daily-${stamp}@farsipen`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${local}`,
    "DURATION:PT10M",
    "RRULE:FREQ=DAILY",
    "SUMMARY:Persian practice (Farsi Pen)",
    `DESCRIPTION:Ten minutes of Persian today. Open: ${appUrl}`,
    `URL:${appUrl}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Time for Persian practice",
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
