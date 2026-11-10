# F20 · Progress page and daily reminders

**Product line:** 7. Motivation and progress · **Priority:** P1 (Progress) / P2 (reminders) · **Prototype status:** ✅ Live (push notifications 🔜)

## 1. Summary

The **Progress** tab shows everything the learner has done, kept in this browser:

- a month **calendar** of practice;
- an **XP chart**;
- **sound scores over time**;
- **"Your journey"** totals across the course;
- the current **level** and **badges**.

**Daily reminders** come as a repeating calendar event, plus an in-browser notification while the app is open.

## 2. Why it matters

- Visible progress keeps learners going, especially on the plateau after the first weeks.
- Reminders are the strongest retention lever. A static web app can't send push notifications without a server, so a calendar event is a clever free substitute.

## 3. User stories

- *As a learner,* I want to see which days I practised and whether I met my goal.
- *As a learner,* I want to see my sounds improving.
- *As a learner,* I want a reminder at a time I choose.

## 4. How it works in the prototype

### 4.1 Progress page

- **Stat cards:** day streak, best streak, days practised, total XP.
- **Calendar:** month grid (Monday first) with previous and next month. Each day shows *goal met*, *practised* or *none*.
- **XP chart:** "Range" switches between the last **7 days** and the last **8 weeks**. Each bar has a tooltip. The chart is `aria-hidden`, with a data table for screen readers.
- **Sounds over time:** a sparkline per scored sound, with the change since the first score. A dashed line at **85** marks a solid sound. Empty state: "Say some words out loud in Speak, Sounds or Scenes and they'll show up here." Fewer than two days of data shows "More days needed".
- **Your journey:** words learned, lessons, sound stages, mission skills, grammar concepts, readings and scenes.
- **Level card** (F19) and **badges**.

### 4.2 Daily reminder (Profile → Daily reminder)

- **Time picker** (saved as `settings.reminder`, "HH:MM").
- **Add to calendar:** downloads an `.ics` file containing one **daily repeating event** with an alert and a link back to the app. It works on every phone and computer calendar.
- **"Notify me in this browser":** a browser notification ("Time for Persian" · "Ten minutes today keeps your streak going.") fires once a day at the chosen time. It fires only while the app is open, and only if the learner hasn't practised that day. If permission is blocked: "Notifications are blocked for this site in your browser settings. The calendar reminder still works."

## 5. Data stored

- `settings.reminder`, `settings.remindedOn`.
- Progress views read `daily`, `activity`, `soundStats`, `soundHistory` (120 days) and the course records.

## 6. Edge cases

- **Browser closed:** no notification. The calendar event still fires.
- **The learner already practised:** no notification.
- **Changing the time:** a new .ics is needed. The old calendar event must be deleted by hand *(note this in the UI)*.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | Calendar, XP chart, sound trends, journey | `progress.test.ts`; accessible table for the chart |
| 2 | Reminder via .ics | Imports cleanly into Google, Apple and Outlook calendars |
| 3 | In-app notification | Once a day, only if not practised; respects permission |

## 8. Real application

- **Web push notifications** (a service worker plus a push server) and native push in a mobile app, with smart timing (the learner's usual hour) and streak-at-risk nudges.
- **Email weekly summary** (opt-in) once accounts exist.
- **Skill radar:** listening, reading, speaking and writing estimates, plus a CEFR progress estimate.
- **Export and share:** a progress image or a certificate.

## 9. Metrics *(proposed)*

- Reminder opt-in rate.
- Return rate on reminder days.
- Progress page visits per week.

## 10. Code references

`src/lib/progress.ts` · `src/app/app/progress/page.tsx` · `src/lib/reminder.ts` · `src/components/ReminderWatcher.tsx` · `src/components/ProgressTools.tsx` · tests: `progress.test.ts`, `reminder.test.ts`
