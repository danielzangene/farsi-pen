# F21 · Profile and settings

**Product line:** 8. Trust, privacy and content quality · **Priority:** P0 · **Prototype status:** ✅ Live

## 1. Summary

The **Profile** tab holds the learner's settings, data tools and trust pages:

- a summary;
- appearance;
- learning preferences;
- voice and speech;
- progress tools (backup, reminder);
- sync and feedback (online only);
- reset;
- open-source credits;
- build info.

Links go to My cards, Progress, Privacy and Check the content.

## 2. Why it matters

Learners need control over how the app teaches them (direction, script, goal) and over their data. It's also where trust is earned.

## 3. User stories

- *As a learner,* I want to change my goal, reading level and daily goal.
- *As a learner,* I want to choose how cards show (direction, Latin or Persian first, script only).
- *As a learner,* I want to pick a voice and a speech recogniser.
- *As a learner,* I want to back up, sync or reset my progress.

## 4. How it works in the prototype

| Section | Settings |
|---|---|
| **Header** | "No sign-up needed. Your progress is saved in this browser. Use 'Save backup' below to keep it safe…" Name ("So we can greet you") |
| **Links** | My cards (N saved) · Progress ("Calendar, charts and badges") · Privacy ("What's stored and where") · Check the content ("For native speakers: review and record") |
| **Appearance** | Theme: **Dark** (default) · Light · Auto |
| **Learning** | Why you're learning (Travel / Family / Heritage / Curious) · Reading Persian (Not yet / A little / Yes; "I can read Persian script") · Daily goal (5 / 10 / 20 words) · Card direction (FA→EN / EN→FA) · Script (Latin-first / Farsi-first / script-only) · On-screen Persian keyboard · Placement test link |
| **Voice & speech** | Natural Persian voice: Piper **Amir** or **Gyro**, with download / remove (~60 MB) · Speech recognition: Auto / Browser / Whisper, with "Download Whisper now" (~80 MB) and retry |
| **Your progress** | Back up your progress (download / restore a JSON file) · Daily reminder (F20) |
| **Sync** 🌐 | Sync across devices (F22) |
| **Feedback** 🌐 | "What should we improve?", with a rating (F23) |
| **Reset progress** | "Removes XP, streaks, lessons, reviews, bookmarks and badges from this browser. Settings are kept." With confirmation |
| **Made with open sources** | Credits required by the licences (Ganjoor poems; VahidN dictionaries, Apache-2.0; shahind's word list and spell corrector, after Peter Norvig, MIT; Piper voice, MIT; Whisper via transformers.js, Apache-2.0; YouGlish) as plain text |
| **Build info** | "Version {commit} · built {UTC time}", to tell a fresh deploy from a cached copy |

## 5. Data stored

`settings`: name, dailyGoal, direction, script, scriptOnly, showKeyboard, checklistHidden, theme, voice, speechEngine, goal, reads, onboarded, backupNudge, reminder, remindedOn.

## 6. Edge cases

- **Theme "Auto"** follows the OS. The page colour (`theme-color`) follows light or dark.
- **Voice download fails:** "Download failed — check your connection and try again."
- **Storage quota:** large model downloads may fail on low-storage devices.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | Every setting in §4 persists and applies immediately | Manual QA checklist |
| 2 | Reset keeps settings, with confirmation | Unit-tested |
| 3 | Credits for every open-source licence | Legal review |
| 4 | Build info visible | Shows commit and time |

## 8. Real application

- **Account section:** sign up, sign in, email, delete account, export my data (GDPR).
- **Subscription management** if a paid tier launches.
- **Language of the interface:** English first; later Persian UI for heritage learners, or other base languages.
- **Notification preferences** (push, email).

## 9. Code references

`src/app/app/settings/page.tsx` · `src/components/SpeechSetup.tsx` · `src/components/ProgressTools.tsx` · `src/lib/store.ts` (`Settings`, `updateSettings`, `resetProgress`)
