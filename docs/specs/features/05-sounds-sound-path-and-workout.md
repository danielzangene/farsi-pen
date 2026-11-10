# F05 · Persian sounds, the sound path and the sound workout

**Product line:** 2. Script and sound · **Priority:** P1 · **Prototype status:** ✅ Live

## 1. Summary

The **Sounds** page teaches the Persian sounds English speakers find hard, in three parts:

- A **sound path** of short speaking stages with stars.
- A **sound guide** with tips and mouth diagrams.
- A daily **sound workout** on the learner's weakest sounds.

Scores come from the learner's own spoken takes (see F06).

## 2. Why it matters

- Sounds such as kh, gh, the tapped r, and the â/a vowel contrast are where English speakers sound "foreign" and get misunderstood.
- Targeted, measurable practice on weak sounds makes progress feel real.

## 3. User stories

- *As a learner,* I want to know how to make each sound English doesn't have.
- *As a learner,* I want short daily practice on the sounds I get wrong most.
- *As a learner,* I want to skip sound units I can already say.

## 4. How it works in the prototype

### 4.1 Sound guide

- **29 sounds**, 12 marked hard: kh, gh, rolled r, zh, long â, short a, long u, long i, short o, short e, h, and the glottal catch.
- Each has its letters, a tip, a mouth diagram, course words, and the learner's running score.
- Easy sounds are grouped: "These letters sound just like their English partners."

### 4.2 Sound path (`sound-path.ts`)

- **8 units:** kh · gh · r · â/a · u/o · i/e · h · zh.
- **Each stage** has 4 short course words plus 1 example sentence containing the sound. Contrast units interleave both sounds. Units have up to 6 stages (zh has 1 so far), then a **review** of the learner's hardest words (lowest stars first) and two sentences. 43 stages in all.
- **Stars per stage:** 3 stars at 90% or more said well, 2 stars at 60% or more, otherwise 1.
- **Unlocking:** stages open in order; units open in order. A learner can **test out** of any unit with a quick 4-item check (pass: 75% or more said well).
- **XP:** stage = good items × 2, +3 the first time. Test-out = +15 once.
- **Next up** card starts the next stage.

### 4.3 Sound workout (`sound-workout.ts`)

- Picks the **3 weakest sounds**: the lowest scored ones first, then untried sounds in guide order.
- **9 words** (3 per sound), chosen from short single course words that contain the sound. Vowel words are checked against their transliteration, because the script hides short vowels.
- The tip for the focus sound is one tap away. At the end, it shows how each sound's score moved.
- "Three sounds, three words each — about three minutes."
- A sound is **solid** at a running score of 85 or more. Levels: new, weak, ok, solid.

### 4.4 Integration

- The Home "Weak sounds" section and practice studio link here.
- The Today plan uses a workout as step 3 once missions are done (F01).
- The Progress page shows a sparkline per sound (F20).

## 5. Data stored

- `soundStats: Record<soundId, SoundStat>`: running score and count.
- `soundHistory: Record<dayKey, Record<soundId, score>>`: last 120 days.
- `soundPath: Record<unitId, { stars[], testedOut?, wordScores? }>`.

## 6. Edge cases

- **No microphone, or speech recognition unsupported:** the guide still works. Stages explain how to switch the recogniser (Browser or Whisper).
- The **glottal catch** can't be scored by recognisers (it's folded away), so it isn't picked for workouts.
- **zh** has few course words, so it has only 1 stage.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | Guide for every hard sound | Tip, mouth diagram, words, audio |
| 2 | Sound path with stars, order and test-out | Rules in §4.2; unit-tested |
| 3 | Workout on weakest sounds | Picks by the rules in §4.3; shows before and after |
| 4 | Scores persist and feed Progress | Per-sound history visible |
| 5 | Graceful without a mic | Clear message and alternative |

## 8. Real application

- **More zh content** and minimal-pair drills (e.g. kh/h, gh/g, â/a).
- **Better scoring:** phoneme-level acoustic scoring (forced alignment or a pronunciation model) instead of transcript comparison.
- **Native-speaker audio** for every practice word (see F24).
- **Slow-motion and waveform comparison** of the model vs the learner.

## 9. Metrics *(proposed)*

- Average sound-score gain after 7 days.
- % of learners with every hard sound marked solid.
- Workout completion rate.

## 10. Code references

`src/content/sounds.ts` · `src/lib/sound-path.ts` · `src/lib/sound-workout.ts` · `src/app/app/sounds/page.tsx` · `src/components/SoundPath.tsx` · `src/components/MouthDiagram.tsx`
