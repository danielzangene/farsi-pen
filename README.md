# Farsi Pen

Learn to read, write and speak Persian. This is the **MVP demo** of Farsi Pen V1, built from the *Farsi Pen — V1 Product & Technical Spec* and the *learnfarsi.app feature audit*.

**Live demo:** https://danielzangene.github.io/farsi-pen/ · **Dev branch:** https://danielzangene.github.io/farsi-pen/dev/

## What the demo includes

| Area | In the demo |
| --- | --- |
| Home | Landing page with a lesson preview and feature overview |
| Dashboard | Level card (own pen-themed level names, EN + FA), XP bar, daily goal, streak, stats, badges, “Getting started” checklist |
| Vocabulary lessons | 6 Level 1 lessons / 50 words. Full flow: preview grid → study cards → Round 1 recognition (4 options, keys 1–4 / A–D) → Round 2 typed recall (missed words re-queue) → result with Good/Again and XP |
| Card controls | FA→EN / EN→FA, Latin-first / Farsi-first / script-only, “sounds like”, bookmark, hide from practice, report |
| Answer checking | Typo-tolerant (“good nite” ✓), Arabic ك/ي → Persian ک/ی, ZWNJ and diacritics ignored, synonyms, “almost — check your spelling” |
| Persian keyboard | On-screen keyboard (standard ISIRI layout) for EN→FA answers; script or Latin transliteration accepted |
| Daily Practice | 10 words chosen by FSRS spaced repetition (due first, then weakest) |
| Word Library | Search (EN / FA / transliteration), lesson, type and progress filters |
| Bookmarks | Bookmarked and hidden tabs, bookmark practice |
| Alphabet | All 32 letters with isolated / initial / medial / final forms, “Unique to Persian” filter, example words, **letter tracing with scoring** (the “pen”) |
| Grammar | Full course of 48 concepts, A1 → B2, in 10 units (pronouns, ezâfe, râ, all tenses, subjunctive, conditionals, passive, reported speech, spoken Persian, ta’ârof…). Each has a table, key points, examples and 6 exercises (multiple choice, fill-in, translation, hints, 80% pass) |
| Speaking practice | Hear a word, say it, get a match score. Free speech recognition: the browser's Web Speech API (fa-IR) or Whisper running on-device (transformers.js). Sound-alike letters (س/ص/ث, ز/ذ/ض/ظ, ت/ط, ه/ح, ق/غ) count as the same sound |
| Natural voice | Free open-source Piper neural TTS (fa_IR Amir / Gyro) running in the browser; ~63 MB one-time download, then offline. Falls back to the device's Persian voice |
| Real-world audio | YouGlish embed in the Word Library and on word cards: YouTube clips of native speakers saying the word |
| Settings | Name, daily goal, card defaults, keyboard, voice & speech recognition, reset progress |
| PWA basics | Web app manifest and icon (installable to home screen) |

All vocabulary, examples, grammar text, level and badge names are original Farsi Pen content. **They are drafts awaiting native-speaker review** (spec §3).

### Not in the demo yet

Accounts and sync (Supabase), community (leaderboards, feed, Talk, friends), donations/products/Pro, games, offline service worker and push reminders, recorded TTS audio, alphabet symbols & course lessons, stroke-order hints, and the remaining lessons/grammar concepts. See the spec’s build plan (M0–M9).

## How it works

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4**, exported as a static site (`output: "export"`).
- **Guest mode:** all progress lives in `localStorage` (`src/lib/store.ts`), shaped so it can be merged into Supabase on sign-up later.
- **Spaced repetition:** [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) (`src/lib/srs.ts`). Recall right first time = Good, accepted with a typo = Hard, missed = Again.
- **Audio:** Piper TTS in the browser (`src/lib/tts.ts`, models from Hugging Face cached in OPFS), else the device’s Persian voice (`src/lib/speech.ts`).
- **Speech recognition:** `src/lib/stt.ts` (Web Speech API or Whisper via transformers.js); scoring in `src/lib/pronounce.ts`. No API keys, no backend.
- **Fonts:** Yekan Bakh (Farsi, `src/fonts/`) and Fraunces (display, via Fontsource).

```
src/
  app/            routes: / and /app/* (dashboard, lessons, practice, words, bookmarks, alphabet, grammar, settings)
  components/     lesson session, quiz rounds, Persian keyboard, tracing canvas, UI pieces
  content/        words.ts, lessons.ts, alphabet.ts, grammar.ts  ← content to review
  lib/            answer checker, FSRS wrapper, XP/levels/streaks/badges, progress store
```

Transliteration style (proposed in the spec): `â` long a, `kh` خ, `gh` غ/ق, `sh` ش, `zh` ژ, `ch` چ, `'` ع/ء. Words are tagged **Spoken** (colloquial) or **Formal** where it matters.

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # answer checker, streaks, levels, practice queue
npm run build        # static site in ./out
```

## Deploy

One GitHub Pages site serves two branches (`.github/workflows/deploy.yml`):

| Branch | URL | Built with |
| --- | --- | --- |
| `main` | `/farsi-pen/` | `NEXT_PUBLIC_BASE_PATH=/farsi-pen` |
| `dev` | `/farsi-pen/dev/` | `NEXT_PUBLIC_BASE_PATH=/farsi-pen/dev`, `NEXT_PUBLIC_CHANNEL=dev` |

Every push to `main` runs the tests and publishes both builds. Pages only deploys from `main`, so a push to `dev` runs its tests and then re-runs the `main` deploy, which picks up the new `dev`. The dev site shows a **DEV** badge, is hidden from search engines, and keeps its progress under its own `localStorage` key, so testing there never touches real progress.

Moving to Vercel later needs no code changes — just drop the base path.
