# F03 · Placement test

**Product lines:** 1. Guided daily learning, and 6. Exams · **Priority:** P1 · **Prototype status:** ✅ Live

## 1. Summary

An adaptive test of 3–6 minutes that finds the learner's level from A0 to B2. It has up to four rounds of five questions. The result sets where Path and Today start, and makes lower content optional.

## 2. Why it matters

Heritage speakers, returning learners and students already know some Persian. Making them start at "salâm" is a fast way to lose them.

## 3. User stories

- *As someone who already knows some Persian,* I want to skip what I know.
- *As a learner,* I want a clear statement of my level and where to start.
- *As a learner,* I want to retake the test later.

## 4. How it works in the prototype

- **Entry points:**
  - Exams tab ("Placement test · 3–6 minutes")
  - Home prompt for new learners
  - Profile ("Find your level (A1 to B2) so Today skips what you already know")
- **Rounds:** A1 → A2 → B1 → B2, 5 questions each. Question kinds:
  - **word:** "What does this mean?" A Persian word with 4 English options. Distractors come from the same pool; multi-word items are excluded.
  - **grammar:** from the course's grammar exercises at that level.
  - **listen:** play a recorded sentence, then pick its meaning.
- **Progression:** 4 or more right out of 5 moves the learner up a round. Fewer ends the test.
- **Level found:** the last round passed (A0 if none).
- **Result screen:** level name (Beginner, A1 Basic, A2 Elementary, B1 Intermediate, B2 Upper intermediate), plus advice:

| Level | Title | Advice | CTA |
|---|---|---|---|
| A0 | A fresh start | Begin with the first lessons and the alphabet | Start lesson 1 |
| A1 | You know the basics | Move fast through the first lessons; missions put words to work | Try a mission |
| A2 | You can get by | Levels 1–2 optional; carry on with Level 3, A2 grammar, scenes | Play a scene |
| B1 | You're independent | Lessons and A1–A2 grammar optional; reading and B1 grammar | Open Reading |
| B2 | You're confident | Straight to B2 grammar, reading and poetry | Open Reading |

- **XP:** 1 per correct answer. Logged as a "lesson" activity.

## 5. Data stored

`placement: { level: "A0"|"A1"|"A2"|"B1"|"B2", at, correct, total } | null`

Read by the Today plan (F01) and the Path (F02).

## 6. Edge cases

- **Retake:** overwrites the previous result (no history kept).
- **Listening without audio:** questions still show, and the clip can be replayed.
- **Lucky guessing:** with 4 options per question, chance of passing a round by guessing (4+/5) is about 1.6%.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | Adaptive rounds A1–B2 | Pass rule 4/5; stops on the first failed round |
| 2 | Three question types | Word, grammar and listening appear in each round |
| 3 | Result changes the experience | Path and Today skip content below the level immediately |
| 4 | Retake from Exams and Profile | New result replaces old |
| 5 | Item bank reviewed by native speakers | All items pass content review (F23) |

## 8. Real application

- **Bigger, calibrated item bank:** item-response-theory difficulty, with no repeats on retake.
- **Speaking and writing items** for B1–B2 (short answer scored by speech recognition or AI).
- **Placement history** and re-placement suggestions after long breaks.
- **Server-side scoring** to prevent tampering if placement ever unlocks paid content.

## 9. Metrics *(proposed)*

- % of new users who take it.
- Level distribution.
- Retention of placed vs unplaced learners.
- % who retake within 7 days (a sign of a wrong result).

## 10. Open questions

- Should a placement result also mark lower lessons as *completed* (for badges), or only *optional* (as now)?

## 11. Code references

`src/lib/placement.ts` · `src/app/app/placement/page.tsx` · `src/app/app/exams/page.tsx` · tests: `src/lib/placement.test.ts`
