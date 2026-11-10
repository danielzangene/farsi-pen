# Farsi Pen — PRD Overview

*Product overview, rebuilt from the working prototype as of November 2026, and checked against the code on 10 November 2026. Live dev build: https://danielzangene.github.io/farsi-pen/dev/app/*

Companion document: [FEATURE_LIST.md](FEATURE_LIST.md) (every feature, with status and priority)

> Facts about what exists come from the code. Anything marked **(proposed)** is a recommendation to confirm, not something the prototype already does.

---

## 1. One-line summary

**Farsi Pen helps English speakers read, write and speak Persian, focusing on everyday spoken Persian and real situations. It's free, has no sign-up, and works in the browser.**

Landing page promise: *"Learn to read, write and speak Farsi. Five-minute lessons, smart review, and a pen for practising the alphabet. Everyday spoken Persian, with formal forms clearly labelled."*

## 2. Problem

- Most Persian courses teach formal, written Persian. What people hear in Tehran, at family dinners or in a taxi is a spoken form most apps leave out.
- The script is a real barrier: letters change shape, and short vowels aren't written. Many learners, especially heritage speakers, can talk but can't read.
- Learners need sounds English doesn't have (kh, gh, the tapped r, â vs a), and mainstream apps give little feedback on them.
- Culture rules everyday talk (ta'ârof, hospitality, bargaining), and generic phrasebooks don't teach it.
- University applicants need SAMFA preparation, and there is very little of it in English.
- Most apps reward taps rather than ability. Learners can't tell whether they could actually order a coffee or take a taxi.

## 3. Target users

The onboarding question *"Why are you learning?"* defines four segments. *"Can you read the script?"* (Not yet / A little / Yes) cuts across all of them.

| Segment | Who | What they need first | How the app adapts |
|---|---|---|---|
| **Travel** | Visiting Iran or Persian-speaking places | Survival speaking: taxi, café, bazaar, directions, pharmacy | Today plan puts the mission first |
| **Family** | Partners, in-laws, family of Persian speakers | Conversation, ta'ârof, warmth at the dinner table | Default plan: due reviews, then a lesson, then a mission |
| **Heritage** | Grew up hearing Persian, may speak but not read | Reading and writing; filling grammar gaps | Mission first if they read; letters first if they don't; lessons replaced by grammar |
| **Curious** | Language lovers, poetry, culture | A broad course, literature, culture notes | Default plan (same as Family) |
| *(plus)* **Students** | Applying to Iranian universities | Placement, SAMFA practice | Exams tab (not an onboarding option) |

## 4. Product principles (from how the app is built)

1. **One clear next step.** The Today plan has one Continue button and at most three steps, then says "that's enough for today".
2. **Can-do, not clicks.** XP comes from proving a skill (a mastery check), and skills come back after 7+ days to check they've stuck.
3. **Spoken first, formal labelled.** Words are tagged *Spoken* or *Formal*; scenes use spoken Tehran Persian.
4. **Forgiving input.** Finglish or فارسی, typos treated as "almost", sound-alike letters treated as one sound, voice wherever typing works.
5. **The pen.** Reading and writing the script is part of the core, not an extra: tracing with scoring, letter forms, vowel signs.
6. **Free, private, no sign-up.** The core app runs in the browser with no account, no API keys, no analytics, no ads and no cookies. Online extras (tutor, sync, feedback) are optional.
7. **Original, reviewed content.** All course content is original Farsi Pen material; native speakers review it with a built-in tool.
8. **Calm, accessible craft.** Apple-style interface, an accessibility-audited baseline, reduced motion respected, Persian shown in Yekan Bakh.

## 5. Goals and success metrics *(proposed)*

The prototype has no analytics, so these are suggestions to agree on before launch.

| Goal | Metric | Signal already in the app |
|---|---|---|
| Learners come back | D1 / D7 / D30 retention; share of days with a practice session | `activity`, `daily`, streak |
| They finish their daily plan | % of active days where all Today steps are done | Today plan `done` flags |
| They gain real skills | Mission skills mastered per learner; % still mastered at the 7-day re-check | `skills` mastery states |
| They learn to read | % of non-readers who trace every letter within 14 days | `traced` |
| They speak | Spoken takes per active day; change in sound scores | `daily.spoken`, `soundHistory` |
| They trust the content | Content reports per 1,000 sessions; % of items reviewed by a native speaker | Report a problem, review tool |

## 6. Main user flows (the main lines)

### 6.1 First visit → first win
Landing page → **Get started** → Lesson 1 *Greetings* (preview → study → recognition round → typed recall → result and XP) → Home → two onboarding questions → personalised **Today plan**.

### 6.2 The daily loop (core loop)
Home → **Continue** → (1) review due flashcards (FSRS) → (2) one new thing (letter / lesson / grammar) → (3) one real-world mission or sound workout → "That's enough for today" → streak extends, quests collected, XP and level move.

### 6.3 Mission (signature flow)
Pick a mission (or follow the plan) → listen to a dialogue → key phrases (spoken and formal) → grammar when needed → build sentences → role-play → **unguided mastery check** (type or speak) → *mastered* / *needs practice* (focused repair and a fresh check) / *retry* → +XP for each skill when first mastered → the skill comes back for a re-check after 7 days, then at growing gaps up to 180 days.

### 6.4 Reading and writing the script
Path → Script and sounds → Alphabet → hear each letter → see its 4 forms → **trace and get a score** → vowel signs → the Today plan moves to lessons once letters are traced.

### 6.5 Pronunciation
Speak a word → recogniser scores it → each letter coloured by clarity → play the model and your own take → tip card and mouth diagram for the weakest sound → scores feed the **sound workout** and **sound path** → Progress shows each sound over time.

### 6.6 Finding your level and exam prep
Exams → **Placement test** (up to 4 rounds) → level A0–B2 → lower content becomes optional, so Path and Today start at your level → **SAMFA** practice per skill → **mini mock** → estimate out of 240.

### 6.7 Keeping your progress
Guest progress in the browser → backup nudge after a 3-day streak → download a JSON backup, or (online) get a **sync code** and enter it on another device.

### 6.8 Content quality loop
Learner taps **Report a problem** → GitHub issue (or server feedback) → native speaker opens **Check the content** → marks or fixes items and records audio → exports a review file → `apply-review.mjs` → fixes and human recordings ship, and play ahead of the synthetic voice. (The pipeline works; no native-speaker recordings have been made yet.)

## 7. Scope

### 7.1 In the prototype (V1 MVP)
Eight product lines, all working. See [FEATURE_LIST.md](FEATURE_LIST.md) for the full list.

1. Guided daily learning: onboarding, Today plan, Path, Next up
2. Script and sound: alphabet and tracing, Sounds, sound path, pronunciation lab, sound workout
3. Vocabulary: 40 lessons and 583 words, flashcards with FSRS, Daily Practice, My cards, dictionary, spelling help
4. Real-world speaking: 7 missions, 8 scenes, Speak, Hands-free, AI tutor (optional online)
5. Course A1 → B2: 54 grammar concepts, 8 B1 reading lessons, 16 poems
6. Exams: placement test, SAMFA practice and mini mock
7. Motivation: XP, 14 levels, streak, daily quests, 14 badges, Progress page, reminders
8. Trust: guest mode, backup, sync code (optional online), privacy page, reporting, content review tool

### 7.2 Out of scope for now (planned later in the V1 spec)
Accounts and Supabase sync · community (leaderboards, feed, Talk, friends) · donations, products, Pro · games · offline service worker and push reminders · stroke-order hints · more lessons and levels beyond what exists.

### 7.3 Non-goals *(proposed)*
- Teaching Dari or Tajik as separate varieties (the course is Iranian Persian, Tehran spoken form)
- Live human tutoring
- Replacing the official SAMFA announcement (the app tells learners to check it each round)

## 8. Experience and information architecture

Five tabs: **Home** (today, practice studio) · **Path** (the course) · **Exams** · **Progress** · **Profile**.

On phones, a floating glass tab bar. On desktop, a sidebar grouped into *Practice* and *Course*. The top bar shows only the logo, streak and XP.

Path sections: Script and sounds → First Steps (A1) → Everyday Life (A1) → Getting Around (A2) → Conversations (A2) → Independent (B1) → Confident (B2).

## 9. Technical overview

| Area | Approach |
|---|---|
| Front end | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4; static export (`output: "export"`) |
| Hosting | GitHub Pages; `main` → `/farsi-pen/`, `dev` → `/farsi-pen/dev/`; tests run before each deploy; can move to Vercel with no code changes |
| Data | Guest progress in `localStorage` (`src/lib/store.ts`), one versioned `ProgressState`, ready to merge into accounts later |
| Learning engine | FSRS spaced repetition (`ts-fsrs`); mastery states for skills; a Today planner; a Path builder; placement logic |
| Voice out | 2,169 pre-recorded MP3s for all course text (open Piper "amir" voice) → in-browser Piper TTS → device voice |
| Voice in | Web Speech API (fa-IR) or on-device Whisper (transformers.js); per-sound scoring |
| Open data | VahidN dictionaries (Apache-2.0), shahind Persian word list, Ganjoor poems (pinned commit), YouGlish embeds |
| Optional backend | One Cloudflare Worker with KV: `/tutor` (proxies NVIDIA's API, key kept server-side, Llama 3.3 70B; 40 replies per visitor and 3,000 in total per day by default), `/sync/:code`, `/feedback`. Hidden unless `NEXT_PUBLIC_API_URL` is set |
| Quality | Vitest unit tests for content (every mission skill has tasks, model answers pass their own checker, all text has audio) and for logic (answers, FSRS, streaks, placement, sync…): 841 tests in 29 files, all passing. Content tooling in scripts/: dictionary and word-list builders, audio generation, review import, icons. Two AI helper agents in .claude/ (UI engineer, design-system reviewer) |

## 10. Privacy

- No account, email or name required. Progress stays in this browser; Farsi Pen's own server only receives data when you turn on sync, use the AI tutor or send feedback.
- No analytics, no advertising and no cookies of Farsi Pen's own.
- Third-party services still see normal web requests: GitHub Pages (app, audio, dictionary), jsDelivr (poems), Hugging Face and jsDelivr (voice and Whisper models), YouGlish and YouTube (only when a video is opened).
- Speaking: with the Browser recogniser, audio goes to the browser maker (for example Google for Chrome, Apple for Safari); with Whisper it stays on the device.
- AI tutor messages go to NVIDIA's AI service to get a reply; Farsi Pen doesn't store the conversation.
- Sync uses a random 130-bit code that only its owner sees; anyone holding the code can read that progress. Unused copies are deleted after about a year.
- Rate limits use a salted hash of the IP that changes every day; nothing else about the visitor is stored.
- The dev site keeps its own storage, so testing never touches real progress.

## 11. Risks and open questions

| # | Risk or question | Notes / suggestion |
|---|---|---|
| 1 | **Content accuracy**: all content is original drafts awaiting native-speaker review | The review tool exists and covers 1,979 items; no native-speaker recordings yet. Set a target, e.g. 100% of A1 reviewed before launch *(proposed)* |
| 2 | **Data loss**: guest data lives in one browser | Backup nudge and sync code exist; accounts are the long-term answer |
| 3 | **Speech recognition quality** varies by browser and device; Whisper is a large download | Sound-alike tolerance helps. Browser recognition sends audio to Google or Apple; Whisper keeps it on the device. Consider showing a quality hint per device *(proposed)* |
| 4 | **AI tutor cost and limits** depend on a free external API | Per-visitor and global daily caps already exist |
| 5 | **No analytics**, so success can't be measured | Add privacy-respecting, opt-in event counts *(proposed)* |
| 6 | **SAMFA format** can change each round | The app already tells learners to check the official announcement |
| 7 | **README is out of date** (it says 36 lessons, 48 grammar concepts, the old navigation) | Update it to match this overview |
| 8 | Business model | Donations or Pro are planned but undecided |

## 12. Roadmap view *(proposed, from what's built and the "not yet" list)*

| Now (prototype → public beta) | Next | Later |
|---|---|---|
| Native-speaker review and recordings of A1–A2 content | Accounts and cloud sync (Supabase) | Community: leaderboards, friends, Talk |
| Turn on the Worker (tutor, sync, feedback) for beta users | Offline service worker and push reminders | Games |
| Basic opt-in analytics for the metrics above | More missions and B1/B2 lessons | Pro tier and monetisation |
| Update the README and landing page to today's scope | Stroke-order hints for tracing | — |
