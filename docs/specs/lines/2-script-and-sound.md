# Line 2 · Script and sound ("the pen")

**Promise:** Read and write the Persian alphabet, and say the sounds English doesn't have.

**Features in this line:** F04 Alphabet and letter tracing · F05 Sounds, sound path and sound workout · F06 Speech recognition, pronunciation feedback and Speak · F24 Audio and voice

## 1. The problem

- The Persian script is the first wall: letters change shape by position, several letters sound the same, and short vowels aren't written. Many heritage speakers can talk but can't read.
- Sounds such as kh, gh, the tapped r and the â/a contrast make English speakers hard to understand. Most apps give no feedback on them.
- Silent audio, or a robotic voice, ruins trust in a language app.

## 2. Who it serves

Every beginner, and especially non-readers (letters first in the Today plan) and heritage speakers closing the reading gap. Pronunciation work serves everyone up to B2.

## 3. How the features fit together

```
Hear it (F24: recorded clip → in-browser voice → device voice)
   ↓
See and write it (F04: letter forms, tracing with a score)
   ↓
Say it (F06: browser or Whisper recognition → score, coloured letters, my voice vs model)
   ↓
Per-sound scores → F05: sound path (stars), weakest-sound workout, guide with mouth diagrams
   ↓
Progress: a sparkline per sound (F20)
```

- **F06 is a shared engine.** Missions, Scenes, Hands-free, SAMFA speaking and the tutor all use it.
- **F24 is a shared engine** for every feature that plays Persian.

## 4. What the prototype has today

- 34 letters with 4 forms, audio and examples. 6 vowel signs. Tracing with a score (pass 60).
- 29 sounds in the guide (12 hard). 8 sound-path units (43 stages). Daily 9-word workout on the 3 weakest sounds.
- Two free recognisers (Web Speech API, or Whisper on the device). Sound-alike folding. Per-letter marks. Accuracy and completeness. Model and my-voice playback.
- 2,169 recorded clips cover 100% of course text (test-enforced). Piper natural voice (Amir or Gyro). YouGlish real-world videos on demand.

## 5. MVP scope

1. Native-speaker recordings for at least A1 words and the alphabet (the pipeline exists in F23).
2. A device QA matrix for audio and the mic (iOS Safari, Android Chrome, desktop Chrome, Safari and Firefox).
3. Clear privacy disclosure for the browser recogniser (audio goes to Google or Apple) vs Whisper (on the device). This is done on the Privacy page.
4. More zh content (only 1 stage today).

## 6. Real application roadmap

| Now | Next | Later |
|---|---|---|
| Native recordings, QA, zh stages | Stroke-order hints; tracing every form and whole words | Phoneme-level pronunciation model (goodness of pronunciation), prosody feedback |
| | Minimal-pair drills (kh/h, gh/g, â/a) | Handwriting recognition for free writing; calligraphy mode |
| | Device-quality hints for recognition | Professional voice talent, a voice per character, offline audio packs in native apps |

## 7. Success metrics *(proposed)*

- % of non-readers who trace every letter within 14 days.
- Average sound-score gain after 7 days. % of learners with every hard sound marked solid (≥ 85).
- Mic permission grant rate. Speech-engine error rate by browser.
- Audio play failures (should be ~0).

## 8. Risks and open questions

- Recognition quality varies by browser, and Whisper is an 80 MB download on mobile data.
- Transcript-based scoring can't catch subtle vowel quality. A real pronunciation model is the long-term fix.
- Should tracing require each joining form?
