# F13 · Hands-free mode

**Product line:** 4. Real-world speaking · **Priority:** P2 · **Prototype status:** ✅ Live

## 1. Summary

An audio-only player for walks, cooking and the commute: "Phone in your pocket, earphones in: hear it, say it, repeat it." Words are read in English first, with a pause to answer in Persian. Then the Persian plays, with pauses to repeat. Scenes play line by line for shadowing.

## 2. Why it matters

It turns dead time into practice, and it's the only mode that needs no screen. It works well for habit-building and for learners who learn best by ear.

## 3. User stories

- *As a busy learner,* I want to practise while walking without looking at my phone.
- *As a learner,* I want to control it from my earphones or lock screen.
- *As a learner,* I want optional scoring of my repeats.

## 4. How it works in the prototype

- **What to play:**
  - my cards;
  - a lesson;
  - a scene ("repeat after each line").
  Up to 20 items, shuffled for cards.
- **Sequence per word:**
  1. English (optional: "Say the English first", a pause "You get a moment to answer in Persian before you hear it");
  2. the Persian;
  3. a pause to repeat;
  4. the Persian once more to settle it.
- **Pause length** scales with the clip: repeat gap = clip length × 1.2 (short), × 1.6 (medium) or × 2.2 (long), set by "Time to repeat".
- **Optional "Score my repeats":** listens through the mic after each line and plays a short tone, high for right and low for try again. Tones are generated on the fly, with no files.
- **Device integration:**
  - keeps the screen awake (Wake Lock), and re-requests it when the learner returns to the tab;
  - headphone and lock-screen play, pause and skip (Media Session API);
  - "Keeps the screen on while it plays. Earphone buttons pause and skip."
- **XP:** half a point per item, rounded up. Logged as a "speak" activity.

## 5. Data stored

Settings are chosen per session. Results go to `daily` and `activity`.

## 6. Edge cases

- **Wake Lock not allowed** (battery saver, old browser): the player still works with the screen on.
- **Browser without speech recognition:** scoring is unavailable ("This browser can't listen to speech").
- **iOS autoplay:** the Start tap unlocks audio for the whole session.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | Cards, lesson and scene sources | All three work |
| 2 | Paced sequence with three pace settings | Gaps as in the rules |
| 3 | Lock-screen and earphone controls | Play, pause and skip on iOS and Android |
| 4 | Optional scoring tones | Off by default; works where recognition exists |

## 8. Real application

- **Native app background audio** (a PWA can't keep playing reliably with the screen off on iOS).
- **Downloadable offline playlists.**
- **Podcast-style daily mix** built from due cards plus the next lesson preview.
- **Car mode** (CarPlay or Android Auto) in a native app.

## 9. Code references

`src/lib/handsfree.ts` · `src/components/HandsFree.tsx` · `src/app/app/listen/page.tsx` · `completeHandsFree` in `src/lib/store.ts`
