# Farsi Pen — Feature List

*Taken from the working prototype (`src/`, `worker/`, commit history) as of November 2026. Live dev build: https://danielzangene.github.io/farsi-pen/dev/app/*

Companion document: [PRD_OVERVIEW.md](PRD_OVERVIEW.md)

**Status key**

- ✅ **Live**: built and working in the static app, with no account or server needed
- 🌐 **Optional online**: built, but only shown when `NEXT_PUBLIC_API_URL` points at the Cloudflare Worker
- 🔜 **Not built yet**: planned in the V1 spec but not in the prototype

**Priority key** (proposed, from how the product is put together)

- **P0, core**: the product doesn't work without it
- **P1, key**: a main reason to choose Farsi Pen
- **P2, supporting**: adds depth, retention or trust

---

## 1. Main product lines (the pillars)

| # | Product line | What it promises | Main features |
|---|---|---|---|
| 1 | **Guided daily learning** | "Open the app, press Continue, and you've done the right thing today." | Onboarding, Today plan, Path, placement test |
| 2 | **Script and sound ("the pen")** | Read and write the Persian alphabet, and say the sounds English lacks | Alphabet and tracing, Sounds page, sound path, pronunciation lab |
| 3 | **Vocabulary that sticks** | Learn words once, remember them with spaced repetition | Lessons, flashcards (FSRS), Daily Practice, My cards, dictionary |
| 4 | **Real-world speaking** | Do real things in Persian: taxi, café, bazaar, ta'ârof | Missions, Scenes, Speak, Hands-free, AI tutor |
| 5 | **Structured course A1 → B2** | A full syllabus, from the first letter to reading real texts | Grammar course, Reading track, Poetry |
| 6 | **Exams** | Know your level, prepare for the SAMFA test | Placement test, SAMFA practice and mini mock |
| 7 | **Motivation and progress** | Progress that means something: XP for skills proven, not clicks | XP and levels, streaks, quests, badges, Progress page |
| 8 | **Trust, privacy and content quality** | No sign-up; your data stays yours; content checked by native speakers | Guest mode, backup, sync code, Privacy page, report a problem, content review tool |

---

## 2. App structure (information architecture)

Five tabs: a floating glass tab bar on phones, a grouped sidebar on desktop.

| Tab | Purpose | Pages under it |
|---|---|---|
| **Home** | What to do today, and every way to practise | Words (flashcards), Speak, Scenes, Hands-free, Daily Practice, AI tutor 🌐 |
| **Path** | The whole course in order | Sounds, Lessons, Missions, Grammar, Reading, Alphabet, Poetry |
| **Exams** | Level and test preparation | Placement test, SAMFA |
| **Progress** | Numbers and achievements | Calendar, XP chart, sound history, journey, level, badges |
| **Profile** | Settings, data and trust | My cards, Privacy, Check the content, Sync 🌐, Feedback 🌐 |

Plus a public landing page (`/`): "Learn to read, write and speak Farsi", with *Get started* (opens Lesson 1) and *I already have progress*.

---

## 3. Feature list by area

### 3.1 Onboarding and guidance

| Feature | Description | Status | Priority |
|---|---|---|---|
| Two-question onboarding | *Why are you learning?* (Travel / Family / Heritage / Curious) and *Can you read the script?* (Not yet / A little / Yes) | ✅ | P0 |
| Today plan | Up to 3 steps: (1) review due words, (2) one new thing (letters first for non-readers, otherwise the next lesson or grammar), (3) one real-world mission, or a sound workout once the missions are done. Travellers and heritage readers get the mission first. One **Continue** button, then an honest "that's enough for today" | ✅ | P0 |
| Path | The whole syllabus in 7 sections: Script and sounds → Level 1 First Steps (A1) → Level 2 Everyday Life (A1) → Level 3 Getting Around (A2) → Level 4 Conversations (A2) → Independent (B1) → Confident (B2). Each section mixes lessons, the missions that use those words, and the grammar for that level | ✅ | P0 |
| "Next up" card | The first unfinished item on the Path. Skips the alphabet for readers and starts at the placement level | ✅ | P0 |
| Getting-started checklist | 5 first actions (lesson, practice, trace, grammar, bookmark); can be hidden | ✅ | P2 |
| Placement prompt on Home | Offered to new learners | ✅ | P1 |

### 3.2 Script and sounds

| Feature | Description | Status | Priority |
|---|---|---|---|
| Alphabet | All 32 letters plus آ and ء, with isolated, initial, medial and final forms, audio, example words and a "Unique to Persian" filter | ✅ | P0 |
| Short-vowel signs | zabar, zir, pish, tashdid, sokun, tanvin | ✅ | P1 |
| **Letter tracing with scoring** | Trace each letter in every form and get a score (pass is 60). This is the "pen" in Farsi Pen | ✅ | P1 |
| Sounds page | The 12 Persian sounds English speakers find hard (kh, gh, rolled r, zh, â, a, u, i, o, e, h, the glottal catch), each with a tip, mouth diagram, course words and a running score | ✅ | P1 |
| Sound path | 8 units (kh, gh, tapped r, â/a, u/o, i/e, h, zh). Each unit has up to 6 stages of 4 words and a sentence, then a review. Stages earn 1 to 3 stars and open in order; you can test out of any unit | ✅ | P1 |
| Daily sound workout | Picks your 3 weakest sounds and runs 9 short words, then shows how each sound moved | ✅ | P1 |
| Pronunciation lab | Each letter coloured by how clearly it was heard, a score per sound, accuracy and completeness. Play the model, your take, or both back to back. A tip card for the weakest sound | ✅ | P1 |

### 3.3 Vocabulary

| Feature | Description | Status | Priority |
|---|---|---|---|
| Vocabulary lessons | **40 lessons, 583 words in 5 levels** (A1–B1). Flow: preview grid → study cards → Round 1 recognition (4 options, keys 1–4) → Round 2 typed recall (missed words come back) → result with XP | ✅ | P0 |
| Flashcards | See the word, guess, flip, hear it, see it in a sentence, watch real videos, say it, then rate *Didn't know / Almost / Knew it*. Missed cards come back in the same session | ✅ | P0 |
| Spaced repetition (FSRS) | `ts-fsrs` schedules each card. Decks: Today (due words plus 5 new), My cards, By lesson | ✅ | P0 |
| Daily Practice | 10 words chosen by FSRS: due words first, then the weakest | ✅ | P1 |
| Card controls | FA→EN or EN→FA; Latin-first, Farsi-first or script-only; "sounds like"; bookmark; hide; report | ✅ | P1 |
| Forgiving answer checking | Allows small typos, normalises Arabic ك/ي to Persian ک/ی, ignores ZWNJ and diacritics, accepts synonyms, and says "almost — check your spelling" | ✅ | P0 |
| Persian keyboard | On-screen ISIRI layout. Answers in script or Finglish (transliteration) are both accepted | ✅ | P1 |
| Word browser | Search and filters, with Say it and videos on every card | ✅ | P2 |
| My cards (bookmarks) | Bookmarked and hidden words, with bookmark practice | ✅ | P2 |
| Dictionary | Look up English or Persian: course words first, then 46,000+ open-source entries with example sentences. Plural and verb endings are stripped to find the base word. Any meaning can be added to My cards | ✅ | P1 |
| Spelling help | "Did you mean …?" for misspelled Persian; sound-alike letters and missing half-spaces count as small slips | ✅ | P2 |
| Real-world video clips | YouGlish clips of native speakers saying the word, played inside the app | ✅ | P2 |

### 3.4 Real-world speaking

| Feature | Description | Status | Priority |
|---|---|---|---|
| **Missions** | 7 situation-based missions: Meet someone new (A1), Take a taxi (A1), Order at a café (A1), Ask for directions (A1), Shop at the bazaar (A2), At the pharmacy (A2), Be a guest: ta'ârof at home (A2). 27 skills in all | ✅ | P0 |
| Mission flow | Listen to a dialogue → key phrases (spoken and formal) → grammar when needed → build sentences → role-play → unguided mastery check. Answer by typing (Finglish or فارسی) or by voice | ✅ | P0 |
| Mastery model | Each skill ends as *mastered*, *needs practice* (focused repair, then a fresh check) or *retry*. "Prove it" goes straight to the check. Mastered skills come back for a short check after 7+ days | ✅ | P0 |
| Scenes | 8 short episodes with a recurring cast (Sara visiting from Toronto, her aunt, her cousin, the shopkeeper, the neighbour) in spoken Tehran Persian. Pick a part, the other lines are read aloud, and you say yours and get a score. Culture notes, plus a scene of the day | ✅ | P1 |
| Speak | Hear a word, say it, get a match score. Speak by topic, or type any sentence to practise | ✅ | P1 |
| Hands-free mode | For walks and cooking: English prompt, a pause to answer, then Persian to repeat. Scenes play line by line for shadowing. Optional mic scoring, screen kept awake, and earphone/lock-screen controls | ✅ | P2 |
| AI tutor | A conversation partner in 7 situations (free chat, café, shared taxi, bazaar, visiting a family, pharmacy, lost in the city). Replies in Persian with transliteration, optional English and gentle corrections. Mic input and audio. Daily limits apply | 🌐 | P1 |

### 3.5 Structured course (grammar, reading, literature)

| Feature | Description | Status | Priority |
|---|---|---|---|
| Grammar course | **54 concepts, A1 → B2** (A1: 16, A2: 15, B1: 14, B2: 9): pronouns, ezâfe, râ, all tenses, subjunctive, conditionals, passive, reported speech, spoken Persian, ta'ârof and more. Each concept has a table, key points, examples and 6 exercises; 80% passes | ✅ | P1 |
| Reading track (B1) | 8 lessons: Life in the capital, Yalda night, The windcatchers of Yazd, Travelling by train, In the bazaar, Nowruz, Hafez, A glass of tea. 8 steps each: key words → text (tap any word, listen to all of it or line by line) → comprehension → written vs spoken Persian → grammar → news vocabulary → culture note → speaking task with a model answer | ✅ | P1 |
| Poetry | Fâl-e Hâfez (12 ghazals with transliteration, English, an omen reading and key words) and a poem of the day (Hafez, Saadi, Khayyam). The full poem loads from Ganjoor open data with vowel marks and explanations; tap any word to look it up | ✅ | P2 |

### 3.6 Exams

| Feature | Description | Status | Priority |
|---|---|---|---|
| Placement test | Up to 4 rounds (A1, A2, B1, B2) of 5 questions: word meaning, grammar and listening. 4 right moves you up a round. The result sets the level, suggests a starting point, and marks lower lessons as optional | ✅ | P1 |
| SAMFA overview | The official exam at a glance: 4 skills × 60 points = 240; General and Academic versions; the usual university bar is half the total | ✅ | P1 |
| SAMFA practice | Listening (played twice, no text), timed reading, timed writing (plan, linking words, word count, spelling check), speaking (prep time, timed answer, transcript, useful phrases counted). Model answers and a self-check rubric | ✅ | P1 |
| SAMFA mini mock | Runs all four skills and estimates a score out of 240; results are saved | ✅ | P1 |

### 3.7 Motivation and progress

| Feature | Description | Status | Priority |
|---|---|---|---|
| XP | Earned for correct answers, finished lessons, traces, speaking, and the first time a skill or mission is mastered | ✅ | P0 |
| Levels | 14 pen-themed levels, from *Blank Page* (صفحهٔ سفید) to *Golden Pen* (قلم طلایی) | ✅ | P1 |
| Daily goal and streak | Daily goal of 5, 10 or 20 words; streak, best streak, and the last 7 days on Home | ✅ | P0 |
| Daily quests | Finish a session (+5 XP), earn 40 XP (+10), say 10 things out loud (+10) | ✅ | P1 |
| Badges | 14 badges (First Words, Warm Ink, One Week, A Month of Farsi, Hundred Words, Full Alphabet, Grammar Master…) | ✅ | P2 |
| Progress page | Month calendar (days practised and goal met), XP chart (7 days or 8 weeks, with a screen-reader table), a sparkline per sound, and "Your journey" totals | ✅ | P1 |
| Daily reminder | Repeating calendar event (.ics), plus a browser notification while the app is open if you haven't practised | ✅ | P2 |

### 3.8 Profile, data, privacy and trust

| Feature | Description | Status | Priority |
|---|---|---|---|
| Guest mode | No sign-up. All progress is kept in `localStorage`, shaped so it can be merged into an account later | ✅ | P0 |
| Settings | Name, goal, reading level, daily goal, card defaults, keyboard, voice and speech recognition, appearance (light/dark/auto) | ✅ | P0 |
| Backup and restore | Download or upload a JSON file; a one-time nudge after a 3-day streak | ✅ | P1 |
| Sync across devices | A private 130-bit code, with no email or account; automatic push and pull | 🌐 | P1 |
| Privacy page | What is stored, where, and who can see it | ✅ | P1 |
| Report a problem | On every word, flashcard, grammar exercise and mission task. Opens a GitHub issue, or posts to the server when the API is on | ✅ / 🌐 | P1 |
| Send feedback | Free-text feedback | 🌐 | P2 |
| Content review tool | "Check the content" lists all 1,763 Persian items. A native speaker marks each one correct or suggests a fix, records it in their own voice, and exports one review file. `scripts/apply-review.mjs` turns it into fixes and MP3s | ✅ | P1 |
| Reset progress | Clear everything (with confirmation) | ✅ | P2 |
| Build info | Commit and build time shown in Settings | ✅ | P2 |

### 3.9 Platform and voice (cross-cutting)

| Feature | Description | Status | Priority |
|---|---|---|---|
| Recorded audio for all course text | ~2,170 MP3 clips (open Piper "amir" voice); native-speaker recordings play first when they exist. A test fails if new text has no recording | ✅ | P0 |
| In-browser natural voice | Piper neural TTS (~63 MB once, then offline); falls back to the device's Persian voice | ✅ | P1 |
| Speech recognition | Web Speech API (fa-IR) or Whisper on the device (transformers.js). No API keys. Sound-alike letters count as the same sound | ✅ | P0 |
| Design system | Apple-style interface (grouped surfaces, glass materials, weight-based hierarchy, calm motion), with Yekan Bakh for Persian and Farsi Pen's own colours | ✅ | P1 |
| Accessibility | axe and Hallmark audits: contrast ≥ 4.5:1, labelled progress bars, keyboard focus rings, reduced motion and transparency, no sideways scroll at 320px | ✅ | P0 |
| PWA basics | Manifest and icons (installable to the home screen) | ✅ | P2 |
| Dev and prod channels | `main` → `/farsi-pen/`, `dev` → `/farsi-pen/dev/` (DEV badge, separate storage, hidden from search) | ✅ | P2 |

---

## 4. Not built yet (from the V1 spec)

| Feature | Notes |
|---|---|
| Accounts and server sync (Supabase) | Guest data is already shaped to merge on sign-up |
| Community | Leaderboards, feed, Talk, friends |
| Monetisation | Donations, products, Pro tier |
| Games | — |
| Offline service worker and push reminders | Only the manifest and in-app reminders exist today |
| Stroke-order hints for tracing | — |
| More content | More lessons, levels and grammar; native-speaker review of all drafts |

---

## 5. Content inventory (counted from the code)

| Content | Amount |
|---|---|
| Vocabulary | 583 words in 40 lessons, 5 levels (L1: 6, L2: 10, L3: 10, L4: 10, L5 B1: 4 lessons) |
| Alphabet | 34 letters (32 + آ and ء) plus the vowel signs |
| Grammar | 54 concepts (A1 16 · A2 15 · B1 14 · B2 9) |
| Missions | 7 missions, 27 skills |
| Scenes | 8 episodes |
| Reading lessons | 8 (B1) |
| Hard sounds | 12 on the Sounds page; 8 sound-path units |
| Poetry | 12 Fâl-e Hâfez ghazals, poem of the day, full poems from Ganjoor |
| Dictionary | 46,000+ entries, 3,167 example sentences |
| SAMFA | 4 skills, writing and speaking prompts, mini mock |
| AI tutor situations | 7 🌐 |
| Persian items in content review | 1,763 |
| Recorded audio clips | ~2,170 |
