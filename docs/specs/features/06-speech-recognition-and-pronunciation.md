# F06 · Speech recognition, pronunciation feedback and Speak

**Product line:** 2. Script and sound (used by 4. Real-world speaking) · **Priority:** P0 · **Prototype status:** ✅ Live

## 1. Summary

A shared speaking engine used across the app (Speak, Sounds, Missions, Scenes, Hands-free, SAMFA speaking, the AI tutor). The learner hears a word or line, says it, and gets:

- a **match score**;
- a **sound-by-sound view**, with each letter coloured by how clearly it was heard;
- **playback** of the model, their own take, or both back to back;
- a **tip card** with a mouth diagram for their weakest sound.

It runs free, with no API keys: either the browser's recogniser or Whisper running on the device.

## 2. Why it matters

- Speaking is the skill learners fear most and practise least. Apps that only do tap-to-choose don't build it.
- Feedback per sound, not just right or wrong, tells learners *what* to fix.

## 3. User stories

- *As a learner,* I want to say a word and know how close I was.
- *As a learner,* I want to hear myself next to the model.
- *As a learner,* I want speaking to work on my phone, and offline if possible.
- *As a privacy-minded learner,* I want the option of recognition that stays on my device.

## 4. How it works in the prototype

### 4.1 Recognition engines (`stt.ts`)

| Engine | How | Pros | Cons |
|---|---|---|---|
| **Browser** | Web Speech API, fa-IR (Chrome, Edge, Safari, Samsung Internet) | Instant, no download | Audio goes to the browser maker (Google, Apple); needs internet; not in Firefox |
| **Whisper** | `onnx-community/whisper-base` via transformers.js (WebGPU or WASM) | Works offline, on the device, in any modern browser | ~80 MB one-time download; slower on old phones |

- Setting: **Auto** (default), Browser or Whisper. Auto uses the browser engine where supported, otherwise Whisper.
- Long answers keep listening across pauses (continuous mode).
- On desktop, the learner's own take is recorded alongside for "My voice". On phones with the browser engine it isn't, because recording at the same time can steal the mic.

### 4.2 Scoring

- **Folding sound-alike letters** (`pronounce.ts`): letters that sound the same in modern Persian are merged before comparing (س/ص/ث, ز/ذ/ض/ظ, ت/ط, ه/ح, ق/غ, ا/آ/ع). Saying "salâm" right is never marked wrong because the recogniser wrote صلام.
- **Verdict:**
  - *correct:* the same sounds;
  - *almost:* one sound off (two for long phrases), or at least 75% similar;
  - *wrong:* anything else.
  The best match is taken over every recogniser guess and every accepted form.
- **Letter marks** (`phonics.ts`): up to 5 recogniser guesses. Each target letter is aligned against every guess:
  - *good:* heard in the best guess;
  - *close:* heard only in a weaker guess;
  - *off* or *missed:* not heard;
  - *silent:* diacritics and the light ع, never marked.
  The result includes accuracy (mean letter score) and completeness (share of sounds heard at all).
- **Per-sound scores** are averaged per take and update `soundStats` (F05).

### 4.3 Speak page

- **Hear each word, say it, get a match score.** Up to 3 tries per word; the first try sets the outcome.
- **Practise by topic** (each lesson is a topic, with "Show all 40 topics").
- **Say your own sentence:** type any Persian text and see each sound scored. Persian script is required, with a nudge to switch keyboard.
- **XP:** 2 per correct word. Each spoken take counts toward the "Say 10 things out loud" daily quest.

### 4.4 Error states (copy from the app)

- "Microphone access is blocked. Allow it in your browser's site settings."
- "Persian recognition isn't available here. Switch to Whisper in Settings."
- "The browser's recogniser needs internet. Try again, or switch to Whisper in Settings."
- "Didn't catch that — tap the mic and try again."
- "Loading speech model…" (shown while Whisper downloads)

## 5. Data stored

- `settings.speechEngine` ("auto" | "browser" | "whisper").
- `soundStats`, `soundHistory`.
- `daily[day].spoken` (takes per day).
- Whisper model files sit in the browser cache, not in progress.

## 6. Edge cases

- **Firefox:** no Web Speech API, so Auto falls back to Whisper.
- **iOS:** the mic and audio must be unlocked by a tap. One shared audio element is reused.
- **Noisy environments:** recognisers return nothing. Show the "Didn't catch that" message and allow retry or typing where the task allows it.
- **Accents and heritage speakers:** dialect pronunciations may score lower. Sound folding reduces this.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | Two engines with Auto | Works on Chrome, Edge, Safari (Browser) and Firefox (Whisper) |
| 2 | Verdict and score per take | Rules in §4.2; unit-tested |
| 3 | Letter colouring and per-sound score | Visible after each take; colours have text labels too |
| 4 | Model, my voice and back-to-back playback | Works where recording is allowed |
| 5 | Clear errors for mic, unsupported browser and offline | Copy as in §4.4 |
| 6 | Privacy disclosure | The Privacy page explains Browser vs Whisper |

## 8. Real application

- **Phoneme-level scoring** with a dedicated pronunciation model (goodness of pronunciation), instead of transcript edit distance.
- **Server-side recognition option** (higher accuracy, consistent across browsers) with explicit consent.
- **Prosody feedback:** stress and intonation for questions and ta'ârof phrases.
- **Learner recordings history**, so learners can hear their progress over weeks.
- **Device quality hints** (e.g. "Your browser's Persian recognition is limited; Whisper is recommended").

## 9. Metrics *(proposed)*

- Mic permission grant rate.
- Takes per active learner per day.
- % of takes rated "correct".
- Engine usage split and error rate per engine and browser.

## 10. Code references

`src/lib/stt.ts` · `src/lib/pronounce.ts` · `src/lib/phonics.ts` · `src/components/SpeakRound.tsx` · `src/components/PronunciationFeedback.tsx` · `src/components/SayItButton.tsx` · `src/components/SpeechSetup.tsx` · `src/app/app/speak/page.tsx`
