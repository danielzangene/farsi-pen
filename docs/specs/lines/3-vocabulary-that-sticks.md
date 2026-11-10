# Line 3 · Vocabulary that sticks

**Promise:** Learn words once, and remember them with spaced repetition.

**Features in this line:** F07 Vocabulary lessons · F08 Flashcards, spaced repetition, Daily Practice and My cards · F09 Forgiving answer checking and the Persian keyboard · F10 Dictionary, word browser and spelling help

## 1. The problem

- Most new words are forgotten within days without well-timed review.
- Being marked wrong for a typo, or for using an Arabic ي instead of a Persian ی, is unfair and demotivating.
- Most learners have no Persian keyboard, and many can't read script yet.
- Learners meet words outside the course and have nowhere to put them.

## 2. Who it serves

Everyone, A1 to B1. It is the base that missions, scenes and reading build on.

## 3. How the features fit together

```
Lesson (F07): preview → study → choose (4 options) → type from memory → result
   ↓ grades each word Good / Hard / Again
FSRS card per word (F08)  ←  Dictionary "Add to my cards" (F10)
   ↓
Review in three modes: Flashcards (Today deck) · Daily Practice (10, typed) · My cards
   ↑
Every typed answer → one forgiving checker (F09) + on-screen keyboard
```

One card per word, shared by every mode. A word studied anywhere is scheduled everywhere.

## 4. What the prototype has today

- 40 lessons and 583 words in 5 levels (A1–B1). Each word has transliteration, a "sounds like" guide, an example, a Spoken/Formal tag and audio.
- FSRS via ts-fsrs. Today deck: due cards (≤ 20) + 5 new. Rich flip cards (audio, sentence, real videos, say it). Daily Practice of 10. My cards with saved and hidden words.
- The checker: typo tolerance by length, letter-form normalisation, half-space and diacritics ignored, informal English, a synonym guard. An ISIRI on-screen keyboard. Finglish or script.
- The dictionary: 46,511 entries, 3,167 examples, stem stripping. A Norvig-style spelling helper over 60,000 words.

## 5. MVP scope

1. Native-speaker review of all 581 words and 580 examples.
2. Save partial lesson progress (today nothing is saved until the result screen).
3. Transliteration and audio for custom (dictionary) words.
4. Analytics: lesson completion, review completion, true retention.

## 6. Real application roadmap

| Now | Next | Later |
|---|---|---|
| Content review, partial saves | Per-card cloud merge with accounts; review forecast | Per-learner FSRS optimisation; adaptive lesson length |
| | B1 completion and B2 vocabulary; topic packs (medical, business, academic) | Images; production cards (picture → say it); audio-only cards |
| | Colloquial dictionary and slang | AI grading for open answers; error analytics for the content team |

## 7. Success metrics *(proposed)*

- Words learned per week.
- Daily review completion.
- True retention (share of reviews rated Hard or Good).
- "Almost" rate (shows how forgiving checking is).
- Dictionary → My cards conversion.

## 8. Risks and open questions

- A large backlog after a break can overwhelm learners. Capped at 20 today; consider a "catch-up" mode.
- One transliteration standard should be published to learners (â, kh, gh, sh, zh, ch, ').
