# Line 1 · Guided daily learning

**Promise:** "Open the app, press Continue, and you've done the right thing today."

**Features in this line:** F01 Onboarding and the Today plan · F02 The course Path and Next up · F03 Placement test

## 1. The problem

Learners of a less-taught language like Persian face two opposite problems. Beginners don't know where to start or what to do next. Learners who already know some Persian (heritage speakers, returning learners) are forced to start again at "salâm". Both quit.

## 2. Who it serves

| Segment | What this line does for them |
|---|---|
| Travel | Puts the real-world mission first each day |
| Family | A balanced daily plan: review, then a lesson, then a mission |
| Heritage | Letters first if they can't read; grammar instead of beginner lessons; missions first if they read |
| Curious | The default plan through the full syllabus |
| Students / returning learners | The placement test starts them at their level |

## 3. How the features fit together

```
First visit → 2 onboarding questions → (optional) Placement test
      ↓                                        ↓
  Today plan (≤ 3 steps) ← reads goal, reading ability, placement, due cards, mastery
      ↓ Continue
  Review → Learn one new thing → Use it (mission / sound workout)
      ↓
  "That's enough for today"
      ↕
  Path tab: the whole syllabus (7 sections), with "Next up" at the learner's level
```

- **Today** is the short-term guide (what to do now). The **Path** is the long-term map (where I am in the course). **Placement** sets the starting point for both.
- All three are pure functions over the learner's progress (`planToday`, `buildPath`, `nextOnPath`, `levelFrom`). They can move to a server unchanged.

## 4. What the prototype has today

- Onboarding: 2 questions with 4 × 3 answers. A Today plan of at most 3 steps, with ordering rules by goal and reading ability.
- Path: 7 sections from "Script and sounds" to "Confident (B2)", with live progress per item and section.
- Placement: up to 4 rounds of 5 questions (word, grammar, listening), pass 4/5. The result makes lower content optional.

## 5. MVP scope (to launch publicly)

1. Plan rules covered by tests for every goal × reading combination (done), plus a QA pass on real devices.
2. Placement item bank reviewed by native speakers.
3. Copy that stays honest when content runs out (Level 5 has 4 lessons; B2 has no vocabulary lessons).
4. **Opt-in analytics** for the funnel: onboarding → first step → plan completed → day 2 return.

## 6. Real application roadmap

| Now | Next | Later |
|---|---|---|
| QA, content review, analytics | Server-side plan once accounts exist; time budget (5/10/20 min) | Adaptive engine choosing the "new thing" from skill gaps; section checkpoints and certificates |
| | Push reminders that open the next step | Calibrated placement (IRT) with speaking and writing items |

## 7. Success metrics *(proposed)*

- Onboarding completion: target ≥ 85%.
- Plan completion: % of active days with every step done.
- D1, D7 and D30 retention by goal segment.
- Placement take rate, and retakes within 7 days (a sign of a wrong placement).

## 8. Risks and open questions

- Plans depend on content being available at every level. B2 is thin.
- Should missions unlock only after their lessons?
- Should "That's enough for today" offer an optional "one more"?
- There's no "SAMFA student" onboarding option yet. Should there be?
