# F11 · Real-world missions

**Product line:** 4. Real-world speaking · **Priority:** P0 (signature feature) · **Prototype status:** ✅ Live (7 missions, 27 skills)

## 1. Summary

Situation-based missions such as taking a taxi, ordering at a café, bargaining at the bazaar and handling ta'ârof as a guest. Each ends with something the learner can **actually do**, proven in an **unguided mastery check**.

Every mission is built from 3–5 **skills** (can-do statements). Skills move through mastery states and come back for re-checks at growing intervals.

## 2. Why it matters

- Learners want to *do* things in Persian, not collect points. Missions turn vocabulary and grammar into real ability.
- Mastery-based progress ("XP for skills you prove, not clicks") is the product's main difference from other apps.
- Ta'ârof and politeness are cultural skills no phrasebook teaches well.

## 3. User stories

- *As a traveller,* I want to practise the exact conversations I'll have in a taxi or a shop.
- *As a learner,* I want to know when I can really do something, without hints.
- *As a learner who already knows some,* I want to "prove it" and skip straight to the check.
- *As a learner who failed a skill,* I want focused practice on just that skill.

## 4. How it works in the prototype

### 4.1 Missions and skills

| Mission | Level | Skills |
|---|---|---|
| Meet someone new | A1 | 4 |
| Take a taxi | A1 | 4 |
| Order at a café | A1 | 4 |
| Ask for directions | A1 | 3 |
| Shop at the bazaar | A2 | 4 |
| At the pharmacy | A2 | 3 |
| Be a guest: ta'ârof at home | A2 | 5 |

The full can-do list is in the Feature List, section 6.

### 4.2 Content model (`content/missions/types.ts`)

A mission has:

- `title` and `titleFa`, `emoji`, `level`, `world` (area of life), `scene` (a one-line situation) and `npc {name, role}`;
- `skills[] {id, canDo}`;
- `dialogue[]` (lines for the NPC and for "you", each with fa, tr, en and register);
- `questions[]` (comprehension), `phrases[]` (each tagged with a skill and register, with a note);
- `grammar {points, table, concepts[]}`, linked to full grammar concepts;
- `wordIds[]`, which join spaced review when the mission is mastered;
- `tasks[]`, each with a skill, a stage (*practice*, *roleplay*, *check* or *recheck*), an NPC cue, a prompt, `must` (required pieces), `mustNot`, a model answer and a hint;
- `culture`, an optional note.

**A new mission is content only**: no code changes. `missions.test.ts` checks that every skill has practice, role-play, check and recheck tasks, and that every model answer passes its own checker.

### 4.3 Session modes (`missions.ts`)

| Mode | When | Steps |
|---|---|---|
| **Full** | First time | Listen to the dialogue (+ comprehension) → Key phrases (spoken + formal) → Grammar on demand → Build sentences (guided) → Role-play (guided) → **Mastery check** (unguided) |
| **Prove it** | Learner thinks they already can | Mastery check only |
| **Repair** | After "needs practice" | Key phrases for the weak skills → guided role-play → a **fresh** recheck they haven't seen |
| **Review** | A mastered skill is due again ("fading") | A short, different recheck only |

### 4.4 Answering

- Type in Finglish or فارسی, or speak (F06).
- Checked by the piece-based checker (F09 §4.2).
- Practice and role-play allow hints; the model answer shows after checking.
- The check: "No hints, no translations. Show what you can do."

### 4.5 Mastery model (`mastery.ts`)

- States: **new** → **recognized** → **usable** → **mastered**. A mastered skill that's due for review displays as **fading**.
- **Evidence:** only the first attempt at each task counts. Using hints makes it *guided*. Only an unguided success in a check makes a skill mastered.
- **Re-check intervals:** first after **7 days**, then ×2.5 after each success, up to **180 days**. A failed re-check drops the skill to *usable*, due now.

### 4.6 Results

- **Mastered:** every tested skill passed. "Mission mastered!" and "You did it without help. Here's what you can do now:".
- **Needs practice:** "Most of it is there. Just a little practice on what's left:" → Repair.
- **Retry:** "Not yet — and that's fine".
- **XP only for proven ability:** +5 the first time each skill is mastered, +15 the first time a whole mission is mastered.

### 4.7 Placement in the course

- Path order: Meet + Café after Level 1; Taxi + Directions after Level 2; Bazaar + Pharmacy after Level 3; Guest after Level 4.
- The Today plan always includes the next unmastered mission (F01).

## 5. Data stored

- `skills: Record<skillId, SkillRecord {state, masteredAt?, interval?, reviewAt?, …}>`.
- `missions: Record<missionId, MissionRecord>`.

## 6. Edge cases

- **Speech recognition can't hear:** "Didn't catch that — try again or type it"; typing is always available.
- **An answer that's right but unusual:** may be marked "almost" or "wrong" if a required piece is missing. Report a problem is available on every task (F23).
- **Fading skills** reopen the mission on the Path and in Today.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | 7 missions, 27 skills, complete content | Content tests pass; native-speaker reviewed (214 mission items) |
| 2 | Four session modes | Steps as in §4.3 |
| 3 | Mastery model and re-checks | `mastery.test.ts` covers state moves and intervals |
| 4 | XP only on first mastery | No XP for repeat passes |
| 5 | Type or speak every answer | Both paths work on mobile |
| 6 | Report a problem on every task | Opens a pre-filled report |

## 8. Real application

- **More missions:** hotel, doctor, phone call, bank, renting a flat, university admin, workplace, and B1–B2 missions (complaints, opinions, negotiation).
- **AI role-play variation:** the tutor (F14) plays the NPC with unscripted replies, then a scripted check confirms mastery.
- **Spoken-only checks** for higher levels, with stricter pronunciation thresholds.
- **Shareable certificates** ("I can order at a café in Persian").
- **Authoring tool** for the content team, with validation from the existing tests.

## 9. Metrics *(proposed)*

- Mission start → mastered funnel.
- Average attempts to master per skill.
- % of skills still mastered at each re-check (true retention).
- Prove-it success rate.

## 10. Code references

`src/content/missions/*.ts` · `src/lib/missions.ts` · `src/lib/mastery.ts` · `src/lib/mission-check.ts` · `src/components/mission/*` · `src/app/app/missions/*` · `completeMission` in `src/lib/store.ts`
