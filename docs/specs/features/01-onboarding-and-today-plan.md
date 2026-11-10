# F01 · Onboarding and the Today plan

**Product line:** 1. Guided daily learning · **Priority:** P0 (core) · **Prototype status:** ✅ Live

## 1. Summary

New learners answer two questions. The answers shape a **Today plan** of at most three steps (review, learn one new thing, use it in a real situation), walked with a single **Continue** button. When the steps are done, the app says so honestly: "That's enough for today".

## 2. Why it matters

- Beginners don't know what to study next. Too much choice causes drop-off.
- A short, finishable daily plan builds the habit, and the habit drives retention.
- People learn Persian for different reasons, and some can't read the script yet. One fixed path fits nobody.

## 3. Users and user stories

- *As a new learner,* I want to answer a couple of quick questions so the app starts at the right place for me.
- *As a traveller,* I want my day to lead with something I can use on my trip.
- *As someone who can't read Persian yet,* I want to start with the letters.
- *As a busy learner,* I want one button that takes me to the right next thing, and to know when I'm done.

## 4. How it works in the prototype

### 4.1 Onboarding (Home, first visit)

| Question | Options (label · hint) |
|---|---|
| **Why are you learning Persian?** | Travel · "Get around, order, shop" 🧳 · Family & friends · "Talk with people I love" · My heritage · "I grew up hearing Persian" · Just curious · "Language, culture, poetry" |
| **Can you read Persian script?** | Not yet · "Start me with the letters" · A little · "I know some letters" · Yes · "Show me Persian script first" |

- Answers are saved as `settings.goal` and `settings.reads`, and `settings.onboarded = true`.
- Both can be changed later in Profile.
- After onboarding, Home also shows a **placement prompt** ("Already know some Persian? Take the placement test (3–6 minutes)"), a week strip, daily quests, the practice studio, the scene of the day, weak sounds, speak-by-topic, "say your own sentence" and a hideable getting-started checklist.

### 4.2 Building the plan (`planToday`)

At most three steps, recalculated every time Home renders:

1. **Review:** shown only when flashcards are due, or a review was already done today. Title "Review N words". Opens `/app/words/?start=today`.
2. **Learn one new thing:**
   - If the learner doesn't read (`reads = no`) and an untraced letter remains, and no lesson was done today: **learn the next letter** (traced score below 60 counts as not learned).
   - Otherwise, if a lesson remains and the goal isn't Heritage: **the next lesson** (skipping lessons below the placement level).
   - Otherwise: **the next grammar concept** (also skipping below the placement level).
3. **Use it:**
   - The next mission with a skill that isn't mastered.
   - If every mission is mastered: a **sound workout** when weak sounds are known, otherwise "Say your words out loud" (Speak).
4. **Ordering rule:** Travellers, and Heritage learners who can read, get the mission *before* the new thing (after review).

### 4.3 Progress through the day

- Each finished activity is logged to `activity[day]` (`review`, `lesson`, `mission`, `grammar`, `alphabet`, `speak`, `reading`), kept for 30 days.
- A step is "done" when its kind is logged today.
- **Continue** opens the first step that isn't done (`nextStep`).
- When all steps are done, Home says "That's enough for today".
- When every lesson, mission and grammar concept is finished, it says new levels are being written and reviews keep coming.

### 4.4 Backup nudge

After a 3-day streak, a one-time card suggests saving a backup (see F22).

## 5. Rules and numbers

| Rule | Value |
|---|---|
| Max steps per day | 3 |
| Letter counts as learned | Trace score ≥ 60 |
| Activity history kept | 30 days |
| Placement effect | Lessons and grammar below the placement level are skipped |

## 6. Data stored

`settings.goal`, `settings.reads`, `settings.onboarded`, `settings.checklistHidden`, `settings.backupNudge`, `activity: Record<dayKey, ActivityKind[]>`.

## 7. Edge cases

- **Nothing due and nothing left:** the plan may have only one or two steps. That's fine, and the copy stays honest.
- **Placement at B2:** lessons are skipped, so the "new thing" becomes B2 grammar.
- **Day boundary:** uses the learner's local date (`dayKey`). Travelling across time zones can shift the day.
- **Reset progress** keeps settings, so onboarding isn't asked again.

## 8. Accessibility and design

- One primary action (Continue). Steps are a list with a done state that isn't shown by colour alone (check icon plus line-through).
- Onboarding options are large tiles with an emoji, a label and a hint.

## 9. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | Two-question onboarding | First visit shows both questions; answers persist; editable in Profile |
| 2 | Today plan of ≤ 3 steps | Matches the rules in §4.2 for every goal × reading combination (unit-tested) |
| 3 | Single Continue | Always opens the first unfinished step; hidden when everything is done |
| 4 | Honest end state | "That's enough for today" when all steps are done |
| 5 | Placement-aware | After placement, no step points to content below the level |
| 6 | Analytics event *(proposed)* | `today_step_started`, `today_step_done`, `today_plan_completed` |

## 10. Real application (beyond the MVP)

- **Server-side plan:** the same pure function runs on the server once accounts exist, so every device sees the same plan.
- **Adaptive engine:** choose the "new thing" from skill gaps (mastery records, weak sounds, FSRS lapses) rather than course order.
- **Time budget:** let learners pick 5, 10 or 20 minutes a day and size the plan to fit.
- **Push reminders** that link straight to the next step (see F20).
- **More onboarding signals:** dialect interest (Tehrani or formal), the learner's own trip date, and SAMFA intent (which currently has no onboarding option).

## 11. Metrics *(proposed)*

- Onboarding completion rate.
- % of active days where the whole plan is completed.
- D1 and D7 retention by goal segment.
- Time from first visit to first completed step.

## 12. Open questions

- Should Heritage learners who read still see vocabulary lessons occasionally?
- Should there be a "one more" option after "That's enough for today"?

## 13. Code references

`src/lib/today.ts` · `src/components/TodayPlan.tsx` · `src/app/app/page.tsx` · `src/components/home/HomeSections.tsx` · tests: `src/lib/today.test.ts`
