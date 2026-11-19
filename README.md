# Farsi Pen

Learn to read, write and speak Persian. This is the **MVP demo** of Farsi Pen V1, built from the *Farsi Pen — V1 Product & Technical Spec* and the *learnfarsi.app feature audit*.

**Live demo:** https://danielzangene.github.io/farsi-pen-prototype/ · **Dev branch:** https://danielzangene.github.io/farsi-pen-prototype/dev/

## What the demo includes

The app is organised as it is in the navigation: Home, the **Learn / Practise / Adventures** sections, Exams and Progress.

| Area | In the demo |
| --- | --- |
| Home (Today) | Two onboarding questions (why you're learning; can you read the script?) shape a daily plan of up to three steps — due reviews, one new thing (letters first if you can't read yet), one mission — with a single Continue button and an honest "that's enough for today". Level card with pen-themed level names (EN + FA), XP, daily goal, streak and badges |
| Journey | The whole course in order, from the first letter to reading real Persian, in 7 sections (Start, then A1 → B2); only the current section is open |
| Lessons | 40 vocabulary lessons / 583 words in 5 units (First Steps → Independent). Preview → study cards → Round 1 recognition (4 options, keys 1–4 / A–D) → Round 2 typed recall (missed words re-queue) → result with XP. Only the current unit is open |
| Grammar | 54 concepts from A1 to B2 (pronouns, ezâfe, râ, every tense, subjunctive, conditionals, passive, reported speech, spoken Persian, ta'ârof…), each with a table, key points, examples and exercises (80% to pass) |
| Alphabet | The 32 letters plus آ, short-vowel signs, letter audio, the forms each letter really has (آ: alone/start; ا: alone/end), example words and **letter tracing with scoring** — the "pen" |
| Sounds | The sounds English doesn't have: a path of short stages, a guide to making each one, and a daily workout on the weakest |
| Daily Practice · Words | FSRS spaced repetition. Flashcards: guess, flip, hear it, see it in a sentence, watch real videos, say it, then rate *Didn't know / Almost / Knew it*. Decks: Today (due + 5 new), My cards, By lesson. Browse with search and filters |
| Speak · Hands-free | Hear a word, say it, get a match score. Hands-free: hear it, say it, repeat it with the phone in your pocket |
| Missions | 7 real-world situations (meet someone, café, taxi, directions, bazaar, pharmacy, being a guest). Dialogue → key phrases (spoken + formal) → grammar on demand → build sentences → role-play → unguided mastery check, answered by typing (Finglish or فارسی) or voice. Ends *mastered*, *needs practice* (targeted repair) or *retry*; mastered skills come back for a check after 7+ days |
| Scenes | 8 short everyday sketches with the same family: pick a part, the others are read for you, and you say your lines |
| Reading | 8 lessons on real topics about Iran (Kashan, qanats, Saadi…): each starts with a question and ends with you answering it in Persian |
| Poetry | Fâl-e Hâfez (12 ghazals with transliteration, English and key words) and a poem of the day; full poems load from Ganjoor's open data in-app, and any word can be looked up |
| Exams | Placement test (A0 → B2) and SAMFA proficiency-test practice |
| Progress | Everything done so far, kept in this browser |
| Profile | Name, goals, card defaults, keyboard, voice and speech recognition, backup / restore (file), daily reminder (calendar event), sync, reset |
| Everywhere | Typo-tolerant answer checking (Arabic ك/ي → ک/ی, ZWNJ and diacritics ignored, synonyms, "almost — check your spelling"); on-screen Persian keyboard (ISIRI); English ⇄ Persian dictionary (46,000+ entries) with "Did you mean…?" spelling help; YouGlish clips of native speakers; "Report a problem" on every item (pre-filled GitHub issue, label `content`); installable as a PWA |
| Optional backend | With the Worker in `worker/` configured: an AI conversation tutor, progress sync between devices (by random code, no account) and in-app feedback. Hidden otherwise |

All vocabulary, examples, grammar text, level and badge names are original Farsi Pen content. **They are drafts awaiting native-speaker review** (spec §3) — native speakers can check them at `/app/review/`.

### Not in the demo yet

Accounts (Supabase), community (leaderboards, feed, Talk, friends), donations/products/Pro, games, an offline service worker and push reminders, stroke-order hints, and the rest of Unit 5. See the spec's build plan (M0–M9).

## How it works

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4**, exported as a static site (`output: "export"`).
- **Guest mode:** all progress lives in `localStorage` (`src/lib/store.ts`), shaped so it can be merged into an account later.
- **Spaced repetition:** [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) (`src/lib/srs.ts`). Recall right first time = Good, accepted with a typo = Hard, missed = Again.
- **Audio** (`src/lib/speech.ts`), tried in order: a native speaker's recording if one exists; a pre-recorded clip of every course string (open Piper "Amir" voice, `scripts/make-audio.py`, served from `public/audio/`); Piper running in the browser for anything else, once downloaded (~63 MB, `src/lib/tts.ts`); the device's own Persian voice.
- **Speech recognition:** `src/lib/stt.ts` (the browser's Web Speech API, fa-IR, or Whisper on-device via transformers.js); scoring in `src/lib/pronounce.ts`, where sound-alike letters (س/ص/ث, ز/ذ/ض/ظ, ت/ط, ه/ح, ق/غ) count as the same sound.
- **Missions:** content in `src/content/missions/` (one file per situation, typed by `types.ts`); planning in `src/lib/missions.ts`, answer checking in `src/lib/mission-check.ts`, mastery in `src/lib/mastery.ts`; UI in `src/components/mission/`. A new mission is content only — `src/content/missions.test.ts` checks it.
- **Open data:** `public/data/dict/` is built by `scripts/build-dictionary.mjs` from [VahidN/EnglishToPersianDictionaries](https://github.com/VahidN/EnglishToPersianDictionaries) (Apache-2.0); `public/data/fa-words.txt` by `scripts/build-lexicon.mjs` from [shahind/Persian-Words-Database](https://github.com/shahind/Persian-Words-Database). Poems come from [ganjoor/ganjoor-data](https://github.com/ganjoor/ganjoor-data) via jsDelivr, pinned to a commit (`src/content/poems.ts`).
- **Type and brand:** the system font for Latin and Vazirmatn (Fontsource, OFL) for all Persian. The logo is "FA" in Nunito Black as outlines (`docs/brand/logo.svg`). Design rules: `.claude/skills/farsi-pen-design-system/SKILL.md`, background in `docs/design-system.md`.

```
src/
  app/          routes: / (landing) and /app/* (one folder per page)
  components/   sessions, quiz rounds, players, Persian keyboard, tracing canvas, ui.tsx primitives
  content/      lessons, words, alphabet, grammar, sounds, missions, scenes, readings, poems, samfa  ← content to review
  lib/          store, FSRS, answer checking, audio and speech, Journey/Today planning, gamification
scripts/        dictionary, lexicon, audio, review and icon builders (each documents its usage at the top)
worker/         optional Cloudflare Worker: tutor, sync, feedback
```

Transliteration style (proposed in the spec): `â` long a, `kh` خ, `gh` غ/ق, `sh` ش, `zh` ژ, `ch` چ, `'` ع/ء. Words are tagged **Spoken** (colloquial) or **Formal** where it matters.

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm test
npm run build        # static site in ./out
```

## Deploy

One GitHub Pages site serves two branches (`.github/workflows/deploy.yml`):

| Branch | URL | Built with |
| --- | --- | --- |
| `main` | `/farsi-pen-prototype/` | `NEXT_PUBLIC_BASE_PATH=/farsi-pen-prototype` |
| `dev` | `/farsi-pen-prototype/dev/` | `NEXT_PUBLIC_BASE_PATH=/farsi-pen-prototype/dev`, `NEXT_PUBLIC_CHANNEL=dev` |

Every push to `main` runs the tests and publishes both builds. Pages only deploys from `main`, so a push to `dev` runs its tests and then re-runs the `main` deploy, which picks up the new `dev`. The dev site shows a **DEV** badge, is hidden from search engines, and keeps its progress under its own `localStorage` key, so testing there never touches real progress.

Moving to Vercel later needs no code changes — just drop the base path.
