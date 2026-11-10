# F18 · SAMFA exam preparation

**Product line:** 6. Exams · **Priority:** P1 · **Prototype status:** ✅ Live

## 1. Summary

Preparation for **SAMFA**, Iran's Standard Persian Language Proficiency Test (آزمون استاندارد مهارت‌های زبان فارسی). It has three parts:

- the test at a glance;
- **practice for each of the four skills** (listening, reading, writing, speaking);
- a **mini mock** of about 25 minutes, scored out of 240 like the real exam.

## 2. Why it matters

International students applying to Iranian universities must pass SAMFA, and there is very little preparation material in English. It's a clear, motivated segment that may be willing to pay.

## 3. User stories

- *As an applicant,* I want to know the exam format and the score I need.
- *As an applicant,* I want timed practice in each skill.
- *As an applicant,* I want an estimate of my score out of 240.

## 4. How it works in the prototype

### 4.1 The test at a glance (`SAMFA_FACTS`)

| Section | Points | Format |
|---|---|---|
| Listening (شنیدن) | 60 | About 30 questions on recorded conversations and talks |
| Reading (خواندن) | 60 | About 30 questions on written texts |
| Writing (نوشتن) | 60 | Two writing topics |
| Speaking (صحبت کردن) | 60 | A short interview, about 15 minutes |

Notes shown:

- 240 in total.
- General and Academic versions. The Academic version is set by field: basic sciences and engineering, humanities, medical sciences, social sciences.
- Iranian universities usually ask for at least half the total; some set their own bar.
- Run by Iran's Ministry of Science, Research and Technology a few times a year: on computer in Iran, on paper abroad. Certificates are valid for two years.
- **"Dates, fees and exact timings change from round to round, so always check the current official announcement before you book."**

### 4.2 Practice per skill (`samfa/Practice.tsx`)

| Skill | Practice | Scoring |
|---|---|---|
| **Listening** | A recorded passage played **twice**, no text ("Read the questions first"), then questions | Correct / total → scaled to 60 |
| **Reading** | A **timed** passage in script only (8 min; 6 min in the mock), then questions | Scaled to 60 |
| **Writing** | **6 prompts** (e.g. ~150 words in 20 min). A plan to follow, **10 linking words** to tap in, a live word count and a spelling check ("Words to double-check"). "Write in kitâbi Persian, not the way you speak" | Model answer + self-check rubric |
| **Speaking** | **8 prompts.** Preparation time, then a timed answer that is **transcribed**; useful phrases used are counted | Model answer + self-check rubric |

- **Rubric** (0–3 each, scaled to 60):
  - answered the question fully;
  - clear order, with linking words;
  - varied words and grammar;
  - few mistakes.
- **XP:** score ÷ 6 per practice. Practice counts per skill are kept.

### 4.3 Mini mock

- All four parts in a short version, **about 25 minutes**.
- An estimate out of 240, with a bar per skill (green at 30/60 or more).
- Compared with the usual university bar: "Around or above the usual university bar (half the total)" or "Below the usual university bar of half the total — keep going."
- Results are saved (last 20). **XP:** total ÷ 8.

### 4.4 Exams tab

Also links to grammar (A1–B2), reading lessons and daily practice as "Every concept the exams expect".

## 5. Data stored

`samfa: { mocks: { at, scores {listening, reading, writing, speaking}, total }[], practised: Record<skill, count> }`

## 6. Edge cases

- **No speech recognition:** "This browser can't listen, so say your answer aloud on your own, then compare it with the model."
- **Time's up:** "Time's up — answer what you can and check."
- **Self-scoring bias:** writing and speaking are self-assessed, so estimates can be generous. This is stated on the result screen *(proposed)*.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | Accurate exam facts, with a "check official" notice | Reviewed against the latest official announcement |
| 2 | Four practice types with timers | As in §4.2 |
| 3 | Mini mock with an estimate out of 240 | Saved history |
| 4 | Content reviewed | 74 SAMFA items reviewed by a native speaker |

## 8. Real application

- **AI scoring** for writing and speaking against the rubric, with feedback per criterion. This is the biggest gap today.
- **Full-length mock exams** that match the official timing, and **Academic field tracks**.
- **Larger item banks** with authentic-style listening (several speakers, natural speed).
- **Study plan** to an exam date (countdown, weak-skill focus).
- **Premium candidate:** SAMFA prep is a natural paid tier.

## 9. Metrics *(proposed)*

- Mock score trend per learner.
- % reaching 120/240.
- Practice volume per skill.
- Conversion to paid (if premium).

## 10. Code references

`src/content/samfa.ts` · `src/components/samfa/Practice.tsx` · `src/app/app/samfa/page.tsx` · `src/app/app/exams/page.tsx` · tests: `samfa.test.ts`
