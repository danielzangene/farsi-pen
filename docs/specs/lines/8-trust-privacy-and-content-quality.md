# Line 8 · Trust, privacy and content quality

**Promise:** No sign-up; your data stays yours; content checked by native speakers.

**Features in this line:** F21 Profile and settings · F22 Guest storage, backup and sync · F23 Content quality (report, feedback, native-speaker review) · F25 App shell, design and platform (cross-cutting)

## 1. The problem

- Sign-up walls stop people trying an app. Tracking and ads erode trust.
- Progress stored only in a browser can vanish.
- In a language app, one wrong word or one unnatural phrase damages trust more than any bug. All of Farsi Pen's content is original and still in draft.

## 2. Who it serves

Every learner, and especially privacy-minded learners and heritage speakers who will notice unnatural Persian. It also serves the team, which needs a way to fix content at scale.

## 3. How the features fit together

```
Guest storage (one versioned object in the browser)
   ├─ Backup file (download / restore) — nudged after a 3-day streak
   ├─ Sync code (130-bit, no account) — auto pull and push via the Worker
   └─ later: accounts (merge guest state on sign-up)
Profile → settings (learning, voice, speech, theme), reset, credits, build info, Privacy page
Content loop: Report a problem (every item) + Feedback → native speaker "Check the content" (1,979 items: verdict, fix, record)
            → export → apply-review.mjs → fixes + native audio that plays first
Platform: static Next.js site on GitHub Pages; dev and prod channels; 841 tests gate deploys; WCAG AA; PWA basics
```

## 4. What the prototype has today

- No account, no analytics, no ads, no cookies of its own. A Privacy page explains every third party (GitHub Pages, jsDelivr, Hugging Face, YouGlish and YouTube on demand, the browser speech recogniser's maker, and NVIDIA for the tutor).
- Backup and restore. Optional sync code with auto-sync (last-write-wins). Unused copies are deleted after about a year.
- Report a problem (a GitHub issue, or the Worker). Feedback with a rating. The full content review tool with recordings in IndexedDB, and an apply script. **No review has been applied yet.**
- Design system (Apple-style, Yekan Bakh). Audited accessibility. Installable PWA.

## 5. MVP scope

1. **Native review of at least all A1–A2 content before public launch**, with native recordings for A1.
2. Opt-in, privacy-first analytics (needed to measure every other line).
3. Clear data-loss warnings (done), and testing of the backup restore path on every browser.
4. Legal pages: privacy policy and terms; open-source licence credits (done).

## 6. Real application roadmap

| Now | Next | Later |
|---|---|---|
| Content review, analytics, legal | **Accounts** (Supabase planned) with guest-state merge and per-field merge rules | Data export and delete (GDPR); regional hosting |
| | Offline service worker | Native iOS and Android apps |
| | CMS with draft → reviewed → published workflow; triage dashboard | Paid reviewers and voice talent; "reviewed by a native speaker" badges |
| | | Payments and a Pro tier (SAMFA, unlimited tutor) |

## 7. Success metrics *(proposed)*

- % of content reviewed.
- Content reports per 1,000 sessions, and time to fix.
- % of learners with a backup or sync.
- Lost-progress support tickets.
- Accessibility audit score.

## 8. Risks and open questions

- Last-write-wins sync can lose progress when two devices are used offline. Accounts with merge are the fix.
- Sync codes are bearer secrets: anyone with the code can read that progress.
- The business model (donations vs Pro) is undecided, and it shapes the account and payment work.
