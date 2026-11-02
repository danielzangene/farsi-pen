# Farsi Pen

Learn to read, write and speak Persian. This is the **MVP demo** of Farsi Pen V1, built from the *Farsi Pen — V1 Product & Technical Spec* and the *learnfarsi.app feature audit*.

**Live demo:** https://danielzangene.github.io/farsi-pen/ · **Dev branch:** https://danielzangene.github.io/farsi-pen/dev/

## What the demo includes

| Area | In the demo |
| --- | --- |
| Today | Two onboarding questions (why you’re learning; can you read the script?) shape a daily plan of up to three steps — due reviews, one new thing (letters first if you can’t read yet), one real-world mission — with a single Continue button and an honest “that’s enough for today” |
| Home | Landing page with a lesson preview and feature overview |
| Dashboard | Level card (own pen-themed level names, EN + FA), XP bar, daily goal, streak, stats, badges, “Getting started” checklist |
| Vocabulary lessons | 36 lessons / 535 words in 4 levels (First Steps, Everyday Life, Getting Around, Conversations). Full flow: preview grid → study cards → Round 1 recognition (4 options, keys 1–4 / A–D) → Round 2 typed recall (missed words re-queue) → result with Good/Again and XP |
| Card controls | FA→EN / EN→FA, Latin-first / Farsi-first / script-only, “sounds like”, bookmark, hide from practice, report |
| Answer checking | Typo-tolerant (“good nite” ✓), Arabic ك/ي → Persian ک/ی, ZWNJ and diacritics ignored, synonyms, “almost — check your spelling” |
| Persian keyboard | On-screen keyboard (standard ISIRI layout) for EN→FA answers; script or Latin transliteration accepted |
| Daily Practice | 10 words chosen by FSRS spaced repetition (due first, then weakest) |
| Words | **Flashcards**: see the word, guess, flip to hear it, see it in a sentence, watch real videos, say it — then rate *Didn’t know / Almost / Knew it*. Missed cards come back later in the same session; ratings feed FSRS. Decks: Today (due + 5 new), My cards, By lesson. **Browse**: search and filters, with Say it and videos on every card |
| Bookmarks | Bookmarked and hidden tabs, bookmark practice |
| Alphabet | All 32 letters plus آ and ء, short-vowel signs (zabar, zir, pish, tashdid, sokun, tanvin), letter audio, with isolated / initial / medial / final forms, “Unique to Persian” filter, example words, **letter tracing with scoring** (the “pen”) |
| Grammar | Full course of 48 concepts, A1 → B2, in 10 units (pronouns, ezâfe, râ, all tenses, subjunctive, conditionals, passive, reported speech, spoken Persian, ta’ârof…). Each has a table, key points, examples and 6 exercises (multiple choice, fill-in, translation, hints, 80% pass) |
| Real-world missions | Situation-based missions (meet someone, take a taxi, order at a café, shop at the bazaar, be a guest / ta’ârof). Listen to a dialogue → key phrases (spoken + formal) → grammar on demand → build sentences → role-play → unguided mastery check. Answer by typing (Finglish or فارسی) or by voice. Ends with *mastered*, *needs practice* (targeted repair of weak skills with a fresh check) or *retry*. "Prove it" skips straight to the check. XP only when a skill is first mastered; mastered skills come back for a short check after 7+ days |
| Speaking practice | Hear a word, say it, get a match score. Free speech recognition: the browser's Web Speech API (fa-IR) or Whisper running on-device (transformers.js). Sound-alike letters (س/ص/ث, ز/ذ/ض/ظ, ت/ط, ه/ح, ق/غ) count as the same sound |
| Natural voice | Free open-source Piper neural TTS (fa_IR Amir / Gyro) running in the browser; ~63 MB one-time download, then offline. Falls back to the device's Persian voice |
| Real-world audio | YouGlish embed in the Word Library and on word cards: YouTube clips of native speakers saying the word |
| Settings | Name, goal and reading level, daily goal, card defaults, keyboard, voice & speech recognition, progress backup / restore (file), daily reminder (calendar event), feedback, reset progress |
| Dictionary | Look up any word in English or فارسی from the word search: course words first (with transliteration and lesson), then 46,000+ dictionary entries with example sentences; plurals and verb endings are stripped to find the dictionary form. Any meaning can be added to My cards and studied as a flashcard |
| Spelling help | “Did you mean …?” for misspelled Persian: a Norvig-style corrector where sound-alike letters (س/ص/ث…) and missing half-spaces count as small slips, ranking course words first |
| Poetry | Fâl-e Hâfez (12 famous ghazals with transliteration, English, an omen reading and key words) and a poem of the day (Hafez, Saadi, Khayyam). “Read the full poem” loads any of them from Ganjoor's open data with vowel marks and modern-Persian explanations; tap any word to look it up |
| Beyond the app | Curated free resources (stories, podcasts, grammar, community) and credits for every open source used |
| Reporting | “Report a problem” on every word, flashcard, grammar exercise and mission task opens a pre-filled GitHub issue (label `content`) |
| PWA basics | Web app manifest and icon (installable to home screen) |

All vocabulary, examples, grammar text, level and badge names are original Farsi Pen content. **They are drafts awaiting native-speaker review** (spec §3).

### Not in the demo yet

Accounts and sync (Supabase), community (leaderboards, feed, Talk, friends), donations/products/Pro, games, offline service worker and push reminders, recorded TTS audio, alphabet symbols & course lessons, stroke-order hints, and the remaining lessons/grammar concepts. See the spec’s build plan (M0–M9).

## How it works

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4**, exported as a static site (`output: "export"`).
- **Guest mode:** all progress lives in `localStorage` (`src/lib/store.ts`), shaped so it can be merged into Supabase on sign-up later.
- **Spaced repetition:** [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) (`src/lib/srs.ts`). Recall right first time = Good, accepted with a typo = Hard, missed = Again.
- **Audio:** tried in order — Piper TTS in the browser once downloaded (`src/lib/tts.ts`), the device’s Persian voice, then Google Translate’s free online TTS so audio works out of the box (`src/lib/speech.ts`).
- **Missions:** content in `src/content/missions/` (one file per situation, typed by `types.ts`); session planning in `src/lib/missions.ts`, free-answer checking in `src/lib/mission-check.ts`, skill mastery states in `src/lib/mastery.ts`; UI in `src/components/mission/`. A new mission is content only — `src/content/missions.test.ts` checks it (every skill has practice/role-play/check/recheck tasks, every model answer passes its own checker).
- **Open data:** `public/data/dict/` is built by `scripts/build-dictionary.mjs` from [VahidN/EnglishToPersianDictionaries](https://github.com/VahidN/EnglishToPersianDictionaries) (Apache-2.0: essential-english-words, generic-1, learn-english), with meanings ranked by everyday use and missing madde restored; `public/data/fa-words.txt` is built by `scripts/build-lexicon.mjs` from [shahind/Persian-Words-Database](https://github.com/shahind/Persian-Words-Database). Poems come from [ganjoor/ganjoor-data](https://github.com/ganjoor/ganjoor-data) via jsDelivr, pinned to a commit (`src/content/poems.ts`).
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
