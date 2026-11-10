# F19 · XP, levels, streaks, daily quests and badges

**Product line:** 7. Motivation and progress · **Priority:** P0 (XP, streak) / P1 (levels, quests) / P2 (badges) · **Prototype status:** ✅ Live

## 1. Summary

A light motivation system with one rule: **"XP for skills you prove, not clicks."**

- **XP** for correct answers and first-time mastery;
- **14 pen-themed levels**;
- a **daily goal and streak**;
- **3 daily quests** with bonus XP;
- **14 badges**.

All the logic is in pure functions, so it can move to a server unchanged.

## 2. Why it matters

Habit is the biggest predictor of success in language learning. Light rewards help learners come back, as long as they don't reward busywork.

## 3. User stories

- *As a learner,* I want to see my streak and keep it alive.
- *As a learner,* I want small daily goals I can finish.
- *As a learner,* I want rewards that mean I actually got better.

## 4. How it works in the prototype

### 4.1 XP table

| Activity | XP |
|---|---|
| Lesson | 2 per correct + 10 for finishing + 5 if perfect |
| Daily Practice / flashcards | 1 per correct (flashcards: only due or new cards) |
| Grammar | 2 per correct |
| Speak | 2 per correct word |
| Trace a letter (first pass) | 3 |
| Mission skill mastered (first time) | 5 |
| Whole mission mastered (first time) | 15 |
| Scene | 2 per line said well + 5 for a new part |
| Sound path stage | 2 per good item + 3 the first time; test-out 15 |
| Reading | 2 per correct + 10 the first time |
| Hands-free | ½ per item (rounded up) |
| Placement | 1 per correct |
| SAMFA practice / mock | score ÷ 6 / total ÷ 8 |
| Daily quests | +5 / +10 / +10 |

### 4.2 Levels (14)

| # | XP | Name | Persian |
|---|---|---|---|
| 1 | 0 | Blank Page | صفحهٔ سفید |
| 2 | 100 | First Dot | نقطهٔ اول |
| 3 | 250 | Ink Drop | قطرهٔ جوهر |
| 4 | 500 | Pencil | مداد |
| 5 | 1,000 | Notebook | دفتر |
| 6 | 1,750 | Reed Pen | قلم نی |
| 7 | 2,750 | Letter Writer | نامه‌نویس |
| 8 | 4,000 | Storyteller | قصه‌گو |
| 9 | 6,000 | Calligrapher | خوشنویس |
| 10 | 9,000 | Orator | سخنور |
| 11 | 13,000 | Librarian | کتابدار |
| 12 | 18,000 | Translator | مترجم |
| 13 | 25,000 | Author | نویسنده |
| 14 | 35,000 | Golden Pen | قلم طلایی |

### 4.3 Daily goal and streak

- **Daily goal:** 5, 10 or 20 words a day (Profile).
- **Streak:** extends the first time the goal is met each day. It shows 0 if a day was missed, and the best streak is kept.
- **Home:** a 7-day strip (goal met, practised, or none) with today's XP. "Reach your daily goal to keep the flame." The top bar shows the streak flame and total XP.

### 4.4 Daily quests

| Quest | Need | Bonus |
|---|---|---|
| Finish a practice session | 1 | +5 XP |
| Earn 40 XP | 40 (quest bonuses don't count) | +10 XP |
| Say 10 things out loud | 10 takes | +10 XP |

Learners tap to collect the bonus. Quests reset daily.

### 4.5 Badges (14)

First Words · Level 1 Done · Every Lesson · Warm Ink (3-day streak) · One Week (7) · A Month of Farsi (30) · Word Collector (25 words) · Hundred Words (100) · 100 XP · 1,000 XP · First Stroke · Full Alphabet · Grammar Starter (5) · Grammar Master (all).

Badges are kept once earned, even if a streak later resets. Home shows the four closest badges, with "Show all".

## 5. Data stored

- `xp`
- `streak {current, record, lastDay}`
- `daily: Record<dayKey, {words, xp, spoken?, quests?}>`
- `earnedBadges[]`

## 6. Edge cases

- **Time zones:** days use the device's local date.
- **Restoring a backup** keeps whatever streak was in the backup.
- **XP can't be farmed:** mastery XP is once only, and flashcard XP is limited to due or new cards.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | XP table as in §4.1 | `gamification.test.ts` and store tests |
| 2 | Levels with EN and FA names | Level card with progress to next |
| 3 | Daily goal and streak | Correct across day boundaries; unit-tested |
| 4 | 3 quests with collectable bonus | Reset daily; `quests.test.ts` |
| 5 | 14 badges | Never lost once earned |
| 6 | Native-speaker check of level names | Names reviewed |

## 8. Real application

- **Streak freeze or repair** (a common retention lever). Weekly goals.
- **Leagues and leaderboards** (planned community features), optional and privacy-respecting.
- **Server-authoritative XP** once accounts exist, to stop tampering on leaderboards.
- **Seasonal events** (Nowruz, Yalda) with themed quests and badges.

## 9. Metrics *(proposed)*

- Streak distribution.
- % of days the goal is met.
- Quest claim rate.
- Effect of streak length on retention.

## 10. Code references

`src/lib/gamification.ts` · `src/lib/quests.ts` · `src/components/Achievements.tsx` · `src/components/home/HomeSections.tsx` (WeekStrip, DailyQuests) · `src/components/AppNav.tsx` (stat chips) · store actions in `src/lib/store.ts`
