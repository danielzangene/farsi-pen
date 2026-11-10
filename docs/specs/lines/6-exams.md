# Line 6 · Exams

**Promise:** Know your level, and prepare for the SAMFA Persian proficiency test.

**Features in this line:** F03 Placement test · F18 SAMFA preparation

## 1. The problem

- Learners can't tell what level they are, so they start in the wrong place.
- International students applying to Iranian universities must pass **SAMFA** (Standard Persian Language Proficiency Test), and there's very little preparation material in English.

## 2. Who it serves

- **Everyone with some Persian** (placement).
- **University applicants** (SAMFA): a clear, motivated segment that may pay.

## 3. How the features fit together

```
Exams tab
 ├─ Placement test (3–6 min, A0–B2) → sets Path and Today start
 └─ SAMFA
     ├─ The test at a glance (4 skills × 60 = 240; General and Academic; check the official announcement)
     ├─ Practise one part: Listening · Reading (timed) · Writing (timed, rubric) · Speaking (prep + timed, transcribed)
     └─ Mini mock (~25 min) → estimate out of 240 vs the usual university bar (120)
 + links: Grammar A1–B2 · Reading lessons · Daily practice
```

## 4. What the prototype has today

- Placement: adaptive 4 × 5 questions (word, grammar, listening). Pass 4/5. Advice per level.
- SAMFA: exam facts with a "check official" notice; 6 writing and 8 speaking prompts; 10 linking words; a 4-criterion self-check rubric (0–3 each, scaled to 60); a mini mock with saved history (last 20).

## 5. MVP scope

1. Check the exam facts against the latest official announcement, and date-stamp them in the app.
2. Native review of the 74 SAMFA items and the placement item bank.
3. State clearly that writing and speaking scores are self-assessed estimates.

## 6. Real application roadmap

| Now | Next | Later |
|---|---|---|
| Fact check, reviews, honest scoring copy | **AI scoring** for writing and speaking against the rubric, with feedback per criterion | Full-length timed mocks; Academic field tracks |
| | Study plan to an exam date | Calibrated (IRT) placement and mock item banks |
| | Larger listening bank (several speakers, natural speed) | **Premium SAMFA tier** (likely first paid product) |

## 7. Success metrics *(proposed)*

- Placement take rate.
- Mock score trend.
- % of SAMFA users reaching 120/240.
- Practice volume per skill.
- Conversion to a paid tier.

## 8. Risks and open questions

- Exam rules, dates and fees change. The app must never look official, or out of date.
- Self-scored writing and speaking overestimate ability. AI scoring is the fix.
