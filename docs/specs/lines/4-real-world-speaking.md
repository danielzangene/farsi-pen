# Line 4 · Real-world speaking

**Promise:** Do real things in Persian: take a taxi, order at a café, bargain at the bazaar, handle ta'ârof.

**Features in this line:** F11 Missions · F12 Scenes · F13 Hands-free mode · F14 AI tutor (uses F06 speech and F24 audio)

## 1. The problem

- Learners collect words and points but freeze in real conversations.
- Spoken Tehran Persian differs a lot from the written form most courses teach.
- Cultural rules (ta'ârof, hospitality, bargaining) decide whether a conversation goes well, and phrasebooks don't teach them.

## 2. Who it serves

Travellers (missions first in their plan), family learners (scenes with a family cast), heritage speakers (spoken fluency and culture), and anyone afraid of speaking.

## 3. How the features fit together

| Feature | Kind of practice | Structure | Proof |
|---|---|---|---|
| **Missions** | Scripted real situations | Listen → phrases → grammar → build → role-play → **unguided check** | Skill **mastery** with re-checks (7 days → ×2.5 → 180 days) |
| **Scenes** | Story role-play | Pick a part; others read aloud; say your lines | Lines said well per play |
| **Hands-free** | Audio shadowing | English → pause → Persian → repeat | Optional scoring tones |
| **AI tutor** | Open conversation | 7 situations, replies with transliteration and corrections | (none yet: free practice) |

Missions are the **signature feature** and the measure of progress: XP only for skills proven without help. Scenes and Hands-free build fluency. The tutor adds the unexpected.

## 4. What the prototype has today

- 7 missions (4 at A1, 3 at A2) with 27 can-do skills and four session modes (full, prove it, repair, review). A piece-based answer checker for free answers, typed or spoken.
- 8 scene episodes with 6 recurring characters in spoken Tehran Persian, and a scene of the day.
- Hands-free with cards, a lesson or a scene; three pace settings; lock-screen and earphone controls; Wake Lock.
- An AI tutor through a Cloudflare Worker (Llama 3.3 70B via NVIDIA), with 40 replies per visitor and 3,000 in total per day. Hidden unless the API is configured.

## 5. MVP scope

1. Native-speaker review of the 214 mission items and 77 scene items. Native recordings for missions.
2. Turn on the Worker for beta users. Run a 50-conversation quality evaluation of the tutor in Persian.
3. Moderation for the tutor (on top of the prompt rules).
4. Analytics: mission funnel, mastery retention at re-checks, scene completion, tutor turns.

## 6. Real application roadmap

| Now | Next | Later |
|---|---|---|
| Review, recordings, tutor evaluation | More missions: hotel, doctor, phone call, bank, renting, university | AI NPC inside missions with a scripted check; branching scenes |
| | Season 2 scenes, a distinct voice per character | Voice-to-voice tutor (streaming); tutor memory across sessions |
| | Tutor corrections linked to grammar; save words from chat | Native background audio and car mode; shareable "I can…" certificates |

## 7. Success metrics *(proposed)*

- Skills mastered per learner per week.
- % still mastered at each re-check.
- Prove-it success rate.
- Scene replays as another part.
- Tutor conversations per learner, and cost per conversation.

## 8. Risks and open questions

- Tutor cost and quality depend on an external free API. Plan a paid model and a paid tier.
- Unusual but correct answers can fail the piece checker. Monitor "Report a problem" on tasks.
- Should missions be locked until their lessons are done?
