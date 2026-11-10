# F15 · Grammar course (A1 → B2)

**Product line:** 5. Structured course · **Priority:** P1 · **Prototype status:** ✅ Live (54 concepts in 14 units)

## 1. Summary

A full grammar course of **54 short concepts** in **14 units** from A1 to B2. Each concept has:

- a table;
- key points;
- examples with audio;
- **6 exercises** (multiple choice, fill-in, translation, with hints).

A concept is passed at 80% or more. Missions link to the exact concept a situation needs ("grammar on demand").

## 2. Why it matters

- Heritage speakers and serious learners need the system behind the phrases, especially ezâfe, râ, verb stems and the subjunctive.
- Short, testable concepts keep grammar from feeling like a textbook.

## 3. User stories

- *As a learner,* I want a short explanation and a table, then quick practice.
- *As a learner in a mission,* I want just the grammar point I need right now.
- *As a heritage speaker,* I want to fill gaps level by level.

## 4. How it works in the prototype

### 4.1 Units and concepts

| Level | Unit | Concepts |
|---|---|---|
| A1 | First sentences | Personal pronouns · "To be" in the present · "Not to be" · Asking questions |
| A1 | Nouns and describing | Plurals · The ezâfe link · This and that · "A" and "the" · Possessive endings · Numbers and counting |
| A1 | Present tense | "To have": dâshtan · Present tense · Verb stems · Negative verbs · The object marker râ · Prepositions |
| A2 | Talking about the past | Simple past · Past continuous and habits · Future · "I am doing it right now" |
| A2 | Wishes, needs and requests | Commands and requests · The subjunctive · Must, can, maybe · Compound verbs |
| A2 | Comparing and connecting | Bigger, biggest · Object endings on verbs · ke clauses · And, but, because · Time, days and dates |
| A2 | Kinds of sentences | Subject and predicate · What a…! How…! |
| B1 | Perfect tenses | Present perfect · Past perfect · Past subjunctive |
| B1 | Complex sentences | Real conditions · Imaginary conditions · I think that… · Reported speech · The passive |
| B1 | Natural, everyday Persian | Spoken vs written Persian · Someone, nothing, everyone · Adverbs |
| B1 | Building new words | Compound nouns · Compound adjectives · Sentences without a person |
| B2 | Linking ideas | When, before, after, until · Purpose and cause · khod |
| B2 | Building words | Infinitives and participles · Causatives · Prefixes and suffixes · Arabic plurals |
| B2 | Politeness and register | Polite verbs and ta'ârof |
| B2 | Literary Persian | chon and cho |

### 4.2 Lesson flow

1. Explanation: table, key points and examples (recorded).
2. **6 exercises:**
   - *choice*: 147 across the course;
   - *fill*: a gap in a sentence with a translation (89);
   - *translate* (88).
   Hints are available; answers are checked with F09.
3. Result: "N/6 right first time". Pass at **80%**, otherwise "You need 80% to pass — you're close."

- **XP:** 2 per correct answer. Best score is kept; once passed, it stays passed.
- Level tabs on the Grammar page (A1, A2, B1, B2). Banner: "All explanations are drafts awaiting review by a native-speaker teacher."
- **Badges:** Grammar Starter (5 passed) and Grammar Master (all).

## 5. Data stored

`grammar: Record<conceptId, { best, passed }>`

## 6. Edge cases

- Some exercises accept several word orders; extra correct forms are listed as accepted answers.
- A placement result above a level makes its concepts optional, but still available.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | 54 concepts with table, points, examples and 6 exercises | `grammar.test.ts` passes; every example recorded |
| 2 | 80% pass rule | Saved and shown on the Path |
| 3 | Mission links to concepts | "Learn more" opens the concept |
| 4 | Teacher review of all explanations | 162 grammar items reviewed; draft banner removed |

## 8. Real application

- **Spaced review of grammar** (weak concepts come back as mixed exercises).
- **Error-driven teaching:** link a wrong answer to the concept that explains it.
- **More exercise types:** reorder words, speak the answer, transform a sentence (e.g. present to past).
- **A conjugation tool** for any verb (present and past stems, all tenses).

## 9. Metrics *(proposed)*

- Pass rate per concept.
- Average attempts to pass.
- Most-missed exercises (content fixes).

## 10. Code references

`src/content/grammar.ts` · `src/content/grammar/a1.ts`–`b2.ts` · `src/content/grammar/types.ts` · `src/components/GrammarLesson.tsx` · `src/app/app/grammar/*` · tests: `grammar.test.ts`
