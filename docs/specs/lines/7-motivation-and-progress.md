# Line 7 · Motivation and progress

**Promise:** Progress that means something: XP for skills you prove, not clicks.

**Features in this line:** F19 XP, levels, streaks, daily quests and badges · F20 Progress page and daily reminders

## 1. The problem

- Language learning is a long game, and most learners quit in the first weeks.
- Gamification that rewards tapping (not learning) feels hollow, and teaches people to game the system.

## 2. Who it serves

Everyone. It matters most in the first 30 days, and on the A2 plateau.

## 3. How the features fit together

```
Every activity → XP (correct answers; first-time mastery; never repeat farming)
            → daily record (words, XP, spoken takes) → daily goal → streak
            → 3 daily quests (+bonus XP) → badges (kept forever)
            → 14 pen-themed levels (Blank Page → Golden Pen)
Progress tab → calendar · XP chart (7 days / 8 weeks) · sound sparklines · journey · level · badges
Reminders → .ics calendar event + in-app notification if not practised
```

## 4. What the prototype has today

- The full XP table across all features. 14 levels with English and Persian names. Daily goal of 5, 10 or 20 words, with streak and best streak.
- 3 daily quests (+5, +10, +10). 14 badges. A 7-day strip on Home. Streak and XP in the top bar.
- Progress page: month calendar, XP chart with an accessible table, per-sound history (120 days), journey totals.
- Reminders: a daily repeating calendar event with an alert, plus an in-browser notification while the app is open.

## 5. MVP scope

1. Native check of level names (pen and writing themed).
2. A UI note that changing the reminder time needs the old calendar event removed.
3. Analytics on streak, goal and quest behaviour, to tune the numbers.

## 6. Real application roadmap

| Now | Next | Later |
|---|---|---|
| Name review, analytics | **Web push** (service worker + push server) and native push, with smart timing | Leagues and leaderboards (opt-in); friends |
| | Streak freeze or repair; weekly goals | Seasonal events (Nowruz, Yalda) with themed quests and badges |
| | Weekly email summary (with accounts) | Skill radar and a CEFR estimate; shareable progress and certificates |

## 7. Success metrics *(proposed)*

- D7 and D30 retention.
- % of days the goal is met.
- Streak distribution.
- Quest claim rate.
- Reminder opt-in, and return rate on reminder days.

## 8. Risks and open questions

- Leaderboards need server-authoritative XP (accounts) to prevent cheating.
- Too many rewards can crowd out the "mastery" message. Keep XP tied to proof.
