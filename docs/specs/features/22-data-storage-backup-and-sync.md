# F22 · Guest storage, backup and device sync

**Product line:** 8. Trust, privacy and content quality · **Priority:** P0 (guest storage) / P1 (backup, sync) · **Prototype status:** ✅ Live (sync 🌐 optional online; accounts 🔜)

## 1. Summary

There is **no sign-up**. All progress lives in one versioned object in the browser's `localStorage`, shaped so it can be merged into an account later. Learners keep it safe with a **backup file**, and move it between devices with a private **sync code** (no email, no account).

## 2. Why it matters

- No sign-up removes the biggest barrier to trying the app, and keeps it private.
- Browser storage can be wiped. Without backup or sync, a lost streak is a lost learner.

## 3. User stories

- *As a new learner,* I want to start without creating an account.
- *As a learner,* I want to save a copy of my progress.
- *As a learner with a phone and a laptop,* I want the same progress on both.

## 4. How it works in the prototype

### 4.1 Guest storage (`store.ts`)

- One key: `farsipen:v1` (the dev site uses `farsipen:v1:dev`, so testing never touches real progress).
- **`ProgressState` v1 fields:**
  - `xp`, `lessons`, `cards`, `bookmarks`, `hidden`;
  - `daily`, `streak`, `grammar`, `traced`, `practiceSessions`, `earnedBadges`, `settings`;
  - `skills`, `missions`, `activity`, `customWords`;
  - `soundStats`, `scenes`, `readings`, `soundPath`, `soundHistory`;
  - `placement`, `samfa`.
- Rolling windows: activity 30 days, sound history 120 days, SAMFA mocks last 20.
- Every change goes through pure actions (`completeLesson`, `completeMission`…) and notifies subscribers (`onSave`).

### 4.2 Backup and restore

- **Save backup** downloads a JSON file. **Restore** asks "Replace the progress in this browser with the backup file?". Invalid files show "That file isn't a Farsi Pen backup."
- **Nudge:** a one-time card after a 3-day streak (F01).

### 4.3 Sync across devices 🌐 (`sync.ts`, Worker `GET/PUT /sync/:code`)

- **Turn on:** creates a random **26-character code** (base32, 130 bits) and uploads this device's progress. "Sync is on. Enter this code on your other device." Shown in groups of 4, with a copy button.
- **Join:** enter the code on another device. Spaces, dashes and capitals are accepted. The device asks "Replace the progress on this device with the synced progress?". It can return "Linked…" or "No progress is saved under that code."
- **Auto-sync:**
  - On start, it pulls the remote copy if it's newer than the last sync.
  - On every save, it pushes after **4 seconds** (debounced), and right away when the tab is hidden.
- **Stop syncing:** removes the code from this device. Other devices keep it.
- **Server:** Cloudflare KV. Up to **500 sync requests per code per day**. Unused copies are deleted after about a year.
- **Privacy:** anyone with the code can read that copy, so the code is long and shown only to its owner.

## 5. Edge cases

- **Conflict:** sync is **last-write-wins on the whole state**. Practising on two devices offline, then syncing, loses the older device's changes. This is the main limitation.
- **Private browsing:** storage may be cleared at the end of the session. The Privacy page warns about this.
- **Schema changes:** `version: 1` lets a future migration run on import.

## 6. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | Guest storage survives reloads | `store.test.ts` |
| 2 | Backup and restore round-trip | Restore of an export gives identical state |
| 3 | Sync on and join with a code | `sync.test.ts`; friendly errors |
| 4 | Clear warning about data loss | Privacy page and backup nudge |

## 7. Real application

- **Accounts (planned: Supabase):** email or passkey, or Google/Apple sign-in. On first sign-up, merge the guest state into the account.
- **Field-level merge:**
  - cards: latest review wins per card;
  - XP and daily: sum per day without double counting;
  - mastery: highest state, latest re-check date;
  - settings: latest wins.
- **Server-authoritative progress** for leaderboards and paid features.
- **Data rights:** export and delete my data, retention policy, regional hosting.

## 8. Metrics *(proposed)*

- % of learners with a backup or sync.
- Sync errors.
- Support tickets about lost progress.

## 9. Code references

`src/lib/store.ts` · `src/lib/sync.ts` · `src/components/SyncCard.tsx` · `src/components/AutoSync.tsx` · `src/components/ProgressTools.tsx` · `worker/src/index.js` (`/sync/:code`) · tests: `store.test.ts`, `sync.test.ts`
