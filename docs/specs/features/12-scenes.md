# F12 · Scenes: play a part in everyday sketches

**Product line:** 4. Real-world speaking · **Priority:** P1 · **Prototype status:** ✅ Live (8 episodes)

## 1. Summary

Short episodes in spoken Tehran Persian with a recurring cast. The learner **picks a part**. The other lines are read aloud one by one like a script, and the learner **says their own lines**, scored sound by sound. Culture notes explain ta'ârof and everyday phrases. A **scene of the day** appears on Home.

## 2. Why it matters

- Shadowing and role-play in context build fluency faster than isolated words.
- A recurring family cast gives a story to come back to, and models how people really talk at home.

## 3. User stories

- *As a learner,* I want to practise a real conversation by playing one of the characters.
- *As a learner,* I want to replay the scene as a different character.
- *As a learner,* I want to understand the culture behind what's said.

## 4. How it works in the prototype

### 4.1 Cast

| Character | Role |
|---|---|
| Sara | Visiting from Toronto (the learner's stand-in) |
| Khale Mahin | Sara's aunt |
| Arash | Her cousin |
| Agha Mamad | Runs the corner shop |
| Shirin | The neighbour upstairs |
| Driver | Shared taxi |

### 4.2 Episodes

1. Welcome home
2. Bread and cheese
3. Where's the remote?
4. Shared taxi to Tajrish
5. Shirin's birthday
6. Lost in the bazaar
7. Under the weather
8. Until next time

### 4.3 Flow (`ScenePlayer.tsx`)

1. "In this scene": the cast and the situation. **Choose your part** (any playable character).
2. Everyone else's lines and the stage directions play by themselves. The current line stays in view.
3. On "Your line — say it out loud", the learner taps the mic. Their take is scored (F06). They can hear their line, retry (the best take is kept, every try counted) and continue.
4. "Why it's said this way" and "What's happening?" notes appear along the way.
5. **End of the scene:** "Lines said well" N/M, plus XP. "Now try it again with a part of your own."

- **XP:** 2 per line said well, +5 the first time a part is played. Logged as a "speak" activity.
- **Scene of the day:** chosen from the date (`sceneOfTheDay`).
- The Path puts "Scenes with the family" in Level 4. Hands-free can play a scene line by line (F13).

## 5. Data stored

`scenes: Record<sceneId, { parts[], best (0–100), plays, last }>`

## 6. Edge cases

- **No speech recognition:** the scene still plays, and the learner reads their lines aloud unscored ("—" for the score).
- **Stage directions** are not spoken.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | 8 episodes with recorded lines | All 77 scene items have audio and are reviewed |
| 2 | Pick any part; auto-play the others | Works for every playable part |
| 3 | Per-line scoring with retry | Best take kept |
| 4 | Scene of the day on Home | Changes daily |

## 8. Real application

- **Season 2+:** more episodes, B1 storylines, and characters from other cities and accents.
- **Distinct voices per character** (several TTS voices, or recorded actors).
- **Branching scenes:** the learner's reply changes what happens next, with AI-generated variations.
- **Video or illustrated scenes.**

## 9. Metrics *(proposed)*

- Scene completion rate.
- Replays as another part.
- Lines said well per play.

## 10. Code references

`src/content/scenes.ts` · `src/components/scene/ScenePlayer.tsx` · `src/components/scene/Cast.tsx` · `src/app/app/scenes/*` · `completeScene` in `src/lib/store.ts` · tests: `scenes.test.ts`
