# F02 · The course Path and "Next up"

**Product line:** 1. Guided daily learning · **Priority:** P0 (core) · **Prototype status:** ✅ Live

## 1. Summary

The **Path** tab shows the whole course as one ordered syllabus in seven sections, from the first letter to B2. Each section mixes lessons, the missions that use those words, the grammar for that level and, later, reading. A **Next up** card always points to the first unfinished item at the learner's level.

## 2. Why it matters

- Learners need to see where they are and what's left. A visible syllabus builds trust and a sense of progress.
- Mixing vocabulary, missions and grammar per level stops each feature feeling like a separate app.

## 3. User stories

- *As a learner,* I want to see the whole course and how far through it I am.
- *As a learner who placed at A2,* I want "Next up" to skip what I already know.
- *As a reader,* I don't want to be sent back to the alphabet.

## 4. How it works in the prototype

### 4.1 Sections

| # | Section | CEFR | Items |
|---|---|---|---|
| 1 | Script and sounds (خط و صدا) | Start | The alphabet (letters traced / 34) · The sound path (stages done / 43) |
| 2 | First Steps (قدم‌های اول) | A1 | Level 1 lessons (6) · Missions: Meet someone new, Order at a café |
| 3 | Everyday Life (زندگی روزمره) | A1 | Level 2 lessons (10) · Missions: Take a taxi, Ask for directions · A1 grammar |
| 4 | Getting Around (سفر و شهر) | A2 | Level 3 lessons (10) · Missions: Shop at the bazaar, At the pharmacy |
| 5 | Conversations (گفت‌وگو) | A2 | Level 4 lessons (10) · Mission: Be a guest · Scenes with the family · A2 grammar |
| 6 | Independent (مستقل) | B1 | Level 5 lessons (4) · 8 reading lessons · B1 grammar |
| 7 | Confident (مسلط) | B2 | B2 grammar · Poetry |

- Each item has a badge (emoji or Persian letters), a subtitle (e.g. "Done · best 92%", "Mission · 2/4 skills", "3/16 concepts") and a progress value from 0 to 1.
- Each section shows done/total.

### 4.2 Next up (`nextOnPath`)

- Walks the sections in order and returns the first item that isn't done.
- Skips sections below the placement level (except "Start").
- Skips the alphabet if the learner reads, or placed at A2 or above.

### 4.3 Navigation

Every course page (Lessons, Missions, Grammar, Reading, Alphabet, Sounds, Poetry) highlights the Path tab. On desktop they're grouped under "Course" in the sidebar.

## 5. Rules and numbers

| Item | Done when |
|---|---|
| Alphabet | Every letter traced ≥ 60 |
| Sound path | Every stage played (or the unit tested out) |
| Lesson | Completed once |
| Mission | Every skill mastered (and not fading) |
| Grammar block | Every concept at that level passed (≥ 80%) |
| Scenes | Every episode played |
| Reading | Finished once |
| Poetry | Never marked done (open-ended) |

## 6. Data used

Read-only over `ProgressState`: `traced`, `soundPath`, `lessons`, `skills`, `grammar`, `scenes`, `readings`, `placement`, `settings.reads`.

## 7. Edge cases

- **Missions fading:** a mastered mission that is due for a re-check shows as not done again, so it can reappear as Next up.
- **All done:** Next up disappears.
- **Placement B2:** Next up starts at the Confident section.

## 8. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | Seven sections with live progress | Progress matches stored records; unit-tested |
| 2 | Next up respects reading and placement | Never points below the level, or to the alphabet for readers |
| 3 | Every item opens its feature | All links resolve, with no dead routes |
| 4 | Content gaps are visible | "More lessons coming" note where a level is incomplete (Level 5 has 4 lessons) |

## 9. Real application

- **Locking and optional rules** configurable per section (e.g. soft locks with "test out").
- **Section checkpoints:** a short mixed test at the end of each section, earning a certificate or badge.
- **Content from a CMS** instead of TypeScript files, so the path can be re-ordered without a deploy.
- **B2 content:** B2 vocabulary lessons, B2 reading lessons and B2 missions (currently grammar and poetry only).

## 10. Metrics *(proposed)*

- Section completion funnel.
- Next up click-through rate.
- Average days per section.

## 11. Open questions

- Should missions unlock only after their lessons, or stay open (as now)?
- Should Poetry ever count as "done"?

## 12. Code references

`src/lib/path.ts` · `src/app/app/path/page.tsx` · `src/components/AppNav.tsx` · tests: `src/lib/path.test.ts`
