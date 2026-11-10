# F23 · Content quality: report a problem, feedback and the native-speaker review tool

**Product line:** 8. Trust, privacy and content quality · **Priority:** P1 · **Prototype status:** ✅ Live (server feedback 🌐 optional)

## 1. Summary

Three loops keep the content correct:

- **Report a problem:** on every word, flashcard, grammar exercise and mission task.
- **Send feedback:** general, with a rating.
- **Check the content:** a review tool where a native speaker works through all **1,979** Persian items. They mark each one correct or suggest a fix, record it in their own voice, and export one file. A script turns that file into fixes and audio.

## 2. Why it matters

- All course content is original and still in draft. A wrong word or an unnatural phrase damages trust more than any bug.
- Native-speaker recordings are far better than synthetic voices. This tool makes collecting them practical.

## 3. User stories

- *As a learner,* I want to flag a mistake right where I see it.
- *As a native-speaker reviewer,* I want a checklist of every Persian item, where I can fix and record each one.
- *As the team,* I want reviews to become code changes and audio files automatically.

## 4. How it works in the prototype

### 4.1 Report a problem (`ReportButton.tsx`)

- **Without the API:** opens a **pre-filled GitHub issue** (label `content`, with the item id and context). The learner chooses whether to send it.
- **With the API:** posts to the Worker (`POST /feedback`, kind `content`) with the item id, context and page.

### 4.2 Send feedback 🌐 (`FeedbackCard.tsx`)

- "What should we improve?" Free text plus a rating ("How do you like it?").
- Stored in KV under `fb:`. Up to 30 per visitor per day.
- Read with `wrangler kv key list --prefix fb:`.

### 4.3 Check the content (`/app/review`, `review.ts`)

- **Items:** every Persian string in the course, each with a stable id (category + audio key) and where it appears (e.g. "Scene 2 · Sara").

| Category | Items |
|---|---|
| Words | 581 |
| Examples | 580 |
| Letters | 33 |
| Grammar | 162 |
| Missions | 214 |
| Scenes | 77 |
| Reading | 220 |
| SAMFA | 74 |
| Sounds | 38 |
| **Total** | **1,979** |

- **Per item:**
  - hear the current audio;
  - mark ✓ correct or ✗ with a fix (corrected Persian, corrected transliteration or translation, a note);
  - **record** it in their own voice (play, re-record, delete).
- **Filters:** category; all / to-do / flagged. Progress shows checked and flagged counts. Reviewer name.
- **Storage:** verdicts in `localStorage`; recordings in **IndexedDB**, so a long session survives reloads.
- **Export:** one JSON file with verdicts and recordings (as data URLs).
- **Apply:** `node scripts/apply-review.mjs <file>` writes a report of fixes and MP3s to `public/audio/human/` and updates `index.json`. **Native recordings play before the synthetic voice** (F24).
- **Status:** the pipeline is built, but **no review has been applied yet** (`public/audio/human` is empty). An automated pass over every Persian word against a large Persian word list found no typos (the unknown words were valid spoken, inflected or literary forms).

## 5. Edge cases

- **Content changes after export:** item ids come from the Persian text, so a changed item gets a new id and needs review again.
- **Large exports:** many recordings make large files. Export by category if needed.

## 6. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | Report on every reportable item | Present on words, cards, grammar exercises and mission tasks |
| 2 | Review tool covers 100% of Persian items | `reviewItems()` count matches the audio texts |
| 3 | Export → apply → ships | End-to-end run with a test reviewer |
| 4 | **At least A1–A2 reviewed by a native speaker before public launch** | Words, examples, letters, A1–A2 grammar and missions marked correct |
| 5 | Feedback channel | Either the GitHub issue or the Worker, with no dead ends |

## 7. Real application

- **CMS with review workflow:** draft → reviewed → published, with reviewer roles, comments and history.
- **Multiple reviewers** and agreement tracking. Paid native reviewers or voice actors.
- **Triage dashboard** for reports and feedback (in-app instead of KV and GitHub).
- **Learner-visible "reviewed by a native speaker" badge** per lesson.

## 8. Metrics *(proposed)*

- % of items reviewed.
- Reports per 1,000 sessions.
- Time from report to fix.
- % of audio by native speakers.

## 9. Code references

`src/components/ReportButton.tsx` · `src/components/FeedbackCard.tsx` · `src/lib/review.ts` · `src/lib/review-store.ts` · `src/app/app/review/page.tsx` · `scripts/apply-review.mjs` · `worker/src/index.js` (`/feedback`) · tests: `review.test.ts`
