# F08 · Flashcards, spaced repetition, Daily Practice and My cards

**Product line:** 3. Vocabulary that sticks · **Priority:** P0 · **Prototype status:** ✅ Live

## 1. Summary

One review system across the app. Every word the learner meets gets an **FSRS** card that schedules the next review "right before you'd forget". It is practised three ways:

- **Flashcards** (see, guess, flip, rate);
- **Daily Practice** (10 words, typed from memory);
- **My cards** (the learner's own saved deck).

## 2. Why it matters

Without spaced review, most new words are forgotten within days. FSRS is a modern, open scheduler that needs fewer reviews than older SM-2 systems.

## 3. User stories

- *As a learner,* I want to review exactly the words I'm about to forget, and nothing more.
- *As a learner,* I want to save words I care about into my own deck.
- *As a learner,* I want to hide words I don't need.
- *As a learner,* I want to hear, see in context, watch videos of and say each word while reviewing.

## 4. How it works in the prototype

### 4.1 Scheduler (`srs.ts`, ts-fsrs)

- Grades: **Again**, **Hard** or **Good** (Easy isn't used).
- Lessons and Daily Practice: right the first time = Good; accepted with a typo = Hard; missed = Again.
- A word counts as **learned** once it leaves the learning steps.

### 4.2 Flashcards (Words tab)

- **Decks:**
  - **Today:** due cards, most overdue first, up to 20 reviews, then 5 new words in course order.
  - **My cards.**
  - **By lesson.**
- **Card:** see the word → guess → flip → hear it, see it in a sentence, "Hear it in real videos" (YouGlish), say it (F06) → rate:
  - **Didn't know** · "See it again soon" → Again
  - **Almost** · "Knew it, with effort" → Hard
  - **Knew it** · "Got it right away" → Good
- **In-session repeat:** "Didn't know" puts the card back 3 cards later. Only the first rating goes to FSRS.
- **XP:** 1 per card rated Almost or Knew it, counted only for cards that were due or new.
- Empty state: "All caught up. Nothing is due — come back tomorrow, or pick a deck below."

### 4.3 Daily Practice

- **10 words:** due first (most overdue), then the weakest of the rest (lowest stability, most lapses). Hidden words are excluded.
- **Typed recall** with Good or Again results. XP: 1 per correct. Counts toward the badge stats and the "practice" quest.

### 4.4 Card controls (on every card)

- Direction: **FA→EN** or **EN→FA**.
- Script: **Latin-first**, **Farsi-first** or **script-only** (hides transliteration for reading practice).
- "Sounds like" guide; **Add to my cards** (bookmark); **Hide from practice**; **Report a problem** (F23).

### 4.5 My cards (Profile → My cards)

- **Saved tab:** bookmarked words, with practice.
- **Hidden tab:** words hidden from Daily Practice ("They won't come up in Daily Practice").
- Also holds words added from the dictionary (F10).

## 5. Data stored

- `cards: Record<wordId, StoredCard>` (FSRS fields; dates as ISO strings).
- `bookmarks: string[]`, `hidden: string[]`, `customWords`, `practiceSessions`.

## 6. Edge cases

- **Custom words** from the dictionary have no transliteration yet. Cards show the Persian and English only.
- **Long breaks:** a large backlog is capped at 20 reviews a day in the Today deck.
- **Same word in a lesson and in flashcards on one day:** both update the same card (by design).

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | FSRS scheduling shared by every mode | One card per word; unit-tested grading |
| 2 | Today deck = due (≤ 20) + 5 new | Matches `buildDeck` rules |
| 3 | Rich flip card with audio, example, video and say-it | All actions work; video loads only on tap |
| 4 | Daily Practice of 10 | Due first, then weakest; hidden excluded |
| 5 | My cards with saved and hidden | Toggle from any card |
| 6 | Card direction and script settings persist | Settings saved and applied everywhere |

## 8. Real application

- **Cloud sync of cards** with per-card merge (latest review wins), not whole-state replace (see F22).
- **Parameter optimisation:** fit FSRS weights per learner from their review history.
- **Review forecast:** "You'll have 34 reviews tomorrow".
- **Card types beyond words:** phrases from missions, grammar patterns, sentences from readings.
- **Audio-only cards** (listen → meaning) and **production cards** (picture → say it).

## 9. Metrics *(proposed)*

- Daily review completion rate.
- True retention (share of reviews rated Hard or Good).
- Backlog size.
- My cards adoption.

## 10. Code references

`src/lib/srs.ts` · `src/lib/flashcards.ts` · `src/components/FlashcardSession.tsx` · `src/components/WordCard.tsx` · `src/components/CardControls.tsx` · `src/app/app/words/page.tsx` · `src/app/app/practice/page.tsx` · `src/app/app/bookmarks/page.tsx`
