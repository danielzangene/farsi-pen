# F07 · Vocabulary lessons

**Product line:** 3. Vocabulary that sticks · **Priority:** P0 · **Prototype status:** ✅ Live (40 lessons, 583 words)

## 1. Summary

Short themed lessons (about 5 minutes) that introduce new words:

1. **Preview grid**
2. **Study cards**
3. **Round 1:** recognition, choose from 4 options
4. **Round 2:** typed recall, where missed words come back
5. **Result** with XP

Finished words enter spaced repetition (F08).

## 2. Why it matters

Vocabulary is the base of every other skill. A predictable, bite-size format makes daily study easy to start and finish.

## 3. User stories

- *As a beginner,* I want small sets of useful words with audio and an example sentence.
- *As a learner,* I want to test myself right away, first by choosing, then by recalling.
- *As a learner,* I want to know which words are spoken Persian and which are formal.

## 4. How it works in the prototype

### 4.1 Levels and lessons

| Level | Name (FA) | CEFR | Lessons | Topics |
|---|---|---|---|---|
| 1 | First Steps (قدم‌های اول) | A1 | 6 | Greetings, courtesy, family, numbers, food |
| 2 | Everyday Life (زندگی روزمره) | A1 | 10 | Numbers and money, time, home, city, getting around, food, shopping, health, common verbs |
| 3 | Getting Around (سفر و شهر) | A2 | 10 | More verbs, feelings, weather, work, study, question words, family, travel, phone |
| 4 | Conversations (گفت‌وگو) | A2 | 10 | Ta'ârof, opinions, free time, nature, celebrations, relationships, kitchen, emergencies, describing |
| 5 | Independent (مستقل) | B1 | 4 | News and society, character, renting and paperwork, linking ideas |

Each word has:

- Persian, transliteration and English;
- a pronunciation guide ("sounds like");
- an example sentence;
- an optional register tag (**Spoken** or **Formal**);
- a recorded clip.

### 4.2 Session flow

1. **Preview:** a grid of the lesson's words.
2. **Study:** one card per word, with audio, transliteration, "sounds like", the example and the register. "Say each word out loud before you reveal it."
3. **Round 1 · Recognition:** 4 options (keys 1–4 or A–D). Distractors come from the same lesson first, and never two options with the same meaning.
4. **Round 2 · Type from memory:** typed recall (see F09 for checking). Missed words re-queue at the end. "Typos are fine — you'll see 'almost' and a spelling tip instead of a red cross."
5. **Result:** accuracy, XP, best score. Words are graded into FSRS:
   - right the first time = **Good**;
   - accepted with a typo = **Hard**;
   - missed = **Again**.

- Direction FA→EN or EN→FA, and script display, follow the card controls (F08).
- Lessons open in order, but any lesson can be opened to skip ahead.
- The Lessons page ends with an honest note that more levels are being written.

### 4.3 XP and badges

- XP: 2 per correct answer, +10 for finishing, +5 for a perfect score.
- Badges: First Words (first lesson), Level 1 Done, Every Lesson.
- Learned-word counts feed Word Collector (25) and Hundred Words (100).

## 5. Data stored

- `lessons: Record<lessonId, { best, attempts, completedAt? }>`.
- `cards` (FSRS state per word).
- `daily[day].words` (counts toward the daily goal).

## 6. Edge cases

- **Leaving mid-lesson:** nothing is saved until the result screen *(proposed: save partial progress)*.
- **Two words that share a meaning** (mersi / mamnun): both are accepted in EN→FA.
- **Multi-word phrases:** typed recall allows small typos per length.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | 5-step flow | As in §4.2, keyboard-operable |
| 2 | Every word complete | Persian, transliteration, English, guide, example and audio; unit-tested |
| 3 | FSRS grading from results | Good, Hard or Again per word |
| 4 | Register labels | Spoken or Formal shown where relevant |
| 5 | Native-speaker review of every word and example | 581 words and 580 examples marked correct in the review tool (F23) |

## 8. Real application

- **More content:** finish Level 5 (B1) and add B2 vocabulary. Topic packs (medical, business, academic for SAMFA).
- **Images** for concrete nouns. Native-speaker audio.
- **Adaptive lesson length** and smart re-teaching of words that keep lapsing.
- **Content pipeline:** a CMS with review status per item, versioning and translation of English glosses into other languages.

## 9. Metrics *(proposed)*

- Lesson completion rate.
- Round 1 and Round 2 accuracy per lesson (finds hard lessons).
- Words learned per week.

## 10. Code references

`src/content/lessons.ts` · `src/content/words.ts` · `src/content/words/level2–5.ts` · `src/components/LessonSession.tsx` · `ChoiceRound.tsx` · `RecallRound.tsx` · `src/lib/quiz.ts` · `completeLesson` in `src/lib/store.ts`
