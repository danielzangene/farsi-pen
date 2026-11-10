# F16 · Reading track (B1)

**Product line:** 5. Structured course · **Priority:** P1 · **Prototype status:** ✅ Live (8 lessons)

## 1. Summary

Eight original B1 reading lessons about life and culture in Iran, built on content- and task-based teaching. Each walks **8 short steps**: before reading, the text (with tap-to-look-up and audio), comprehension, written vs spoken Persian, grammar in the text, news vocabulary, a culture note, and a speaking task with a model answer.

## 2. Why it matters

- Moving from learner sentences to real written Persian (*kitâbi*) is the B1 wall. It's also what SAMFA and university study need.
- Culture content (Yalda, Nowruz, windcatchers, tea) motivates heritage learners and keeps the course from being only phrases.

## 3. User stories

- *As an intermediate learner,* I want real texts with help on demand.
- *As a learner,* I want to see how the written form differs from what people say.
- *As a SAMFA candidate,* I want news vocabulary and practice headlines.

## 4. How it works in the prototype

### 4.1 Lessons

1. Life in the capital
2. Yalda night
3. The windcatchers of Yazd
4. Travelling by train
5. In the bazaar
6. Nowruz
7. Hafez
8. A glass of tea

### 4.2 Steps (`ReadingLessonView.tsx`)

| # | Step | What happens |
|---|---|---|
| 1 | Before you read | An opening question to the learner, and "Words you'll meet" |
| 2 | Read | The text. "Tap any word to see what it means. Underlined words are the ones to learn." Listen to it all, or line by line. Add words to My cards |
| 3 | Check | Comprehension questions; "Answer every question to go on" |
| 4 | Written and spoken | The same sentences in kitâbi and spoken Persian |
| 5 | Grammar in the text | The grammar the text uses, with a link to its concept (F15) |
| 6 | In the news | A news-vocabulary topic (e.g. city life, climate) and "Read the headlines" ("Example headlines written for practice") |
| 7 | Get to know Iran | A culture note, with words |
| 8 | Your turn | A speaking task: "Tap the mic and answer in a few sentences". Useful phrases used are noticed; "Hear a model answer" |

- **XP:** 2 per correct comprehension answer, +10 the first time. Best "% understood" is kept.

## 5. Data stored

`readings: Record<readingId, { best, doneAt }>`

## 6. Edge cases

- **No mic:** the speaking task can be done aloud unscored, then compared with the model.
- **Tap-to-look-up** uses course words first, then the dictionary (F10).

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | 8 lessons × 8 steps | `readings.test.ts` passes; all text recorded |
| 2 | Tap any word for its meaning | Works on every word |
| 3 | Comprehension gate | Must answer every question to continue |
| 4 | Native-speaker review | 220 reading items reviewed |

## 8. Real application

- **B2 readings** and authentic texts (news, short stories) with permissions.
- **Graded readers** with levelled vocabulary.
- **Reading speed and fluency tracking.** Read-aloud scoring.
- **New readings regularly** (weekly culture or news digest).

## 9. Code references

`src/content/readings.ts` · `src/components/reading/ReadingLessonView.tsx` · `src/app/app/reading/*` · `completeReading` in `src/lib/store.ts` · tests: `readings.test.ts`
