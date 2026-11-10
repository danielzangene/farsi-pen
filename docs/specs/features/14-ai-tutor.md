# F14 · AI tutor

**Product line:** 4. Real-world speaking · **Priority:** P1 · **Prototype status:** 🌐 Built, optional online (hidden unless `NEXT_PUBLIC_API_URL` is set)

## 1. Summary

A conversation partner in Persian across 7 situations. It replies in **Persian script, with transliteration and an optional English translation**, and gives **gentle corrections** in English. Learners type (Finglish or script) or speak, and can hear every reply.

## 2. Why it matters

- Scripted missions prove specific skills. Open conversation builds the confidence to handle the unexpected.
- Human tutors are expensive; an always-available, patient partner removes the fear of speaking.

## 3. User stories

- *As a learner,* I want to chat freely at my level and be corrected kindly.
- *As a learner,* I want to practise a situation (café, taxi) with a partner who plays the role.
- *As a learner,* I want to see the transliteration and meaning of every reply.

## 4. How it works in the prototype

### 4.1 Situations

| Id | Title | Hint | Tutor plays | Opener |
|---|---|---|---|---|
| chat | Free chat | Talk about your day | A friendly Iranian of the learner's age | سلام! |
| cafe | At a café | Order something | A waiter in a Tehran café | سلام، ببخشید. |
| taxi | Shared taxi | Get across town | A shared-taxi driver in Tehran | سلام آقا. |
| bazaar | In the bazaar | Buy and bargain | A bazaar shopkeeper | سلام، خسته نباشید. |
| guest | Visiting a family | Ta'ârof at the door | A host, with plenty of ta'ârof | سلام، ببخشید دیر کردم. |
| pharmacy | At the pharmacy | Say what's wrong | A pharmacist | سلام. |
| directions | Lost in the city | Ask the way | A passer-by | ببخشید آقا. |

### 4.2 Backend (Cloudflare Worker, `POST /tutor`)

- Proxies to **NVIDIA's API** (`integrate.api.nvidia.com`) with model **meta/llama-3.3-70b-instruct**, max 300 tokens. The API key stays on the server.
- **System prompt:**
  - play the role, at the learner's CEFR level;
  - one or two sentences per reply;
  - colloquial Tehrani Persian;
  - understand both script and Finglish;
  - a short, kind correction in English if the last message had a mistake;
  - avoid politics, religious debate and unsafe topics.
  - Reply only as JSON: `{fa, tr, en, fix}`.
- **Input limits:** the last 12 messages, 600 characters each.
- **Rate limits:** **40 replies per visitor per day** (salted, daily-rotating IP hash) and **3,000 per day in total**.

### 4.3 Client

- Mic input (F06), audio for every reply (F24), and an English toggle.
- Error copy:
  - "That's today's limit for the tutor. Come back tomorrow — or keep practising with missions and scenes."
  - "The tutor is very busy today. Please try again later."
  - "The tutor isn't switched on yet."
  - "Couldn't reach the tutor. Check your connection."
- **Privacy:** messages go to NVIDIA's AI service; Farsi Pen doesn't store the conversation. The Privacy page says "Don't share personal details with it."

## 5. Data stored

None on the server. The conversation lives in the page only.

## 6. Edge cases

- **Invalid JSON from the model:** the Worker handles it and the client shows "The tutor couldn't answer. Try again."
- **Off-topic or unsafe requests:** the prompt steers back to the scene. *(Proposed: add a moderation check.)*
- **Level:** taken from the placement result; A1 when there's none or it's A0.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | 7 situations, in-role replies at level | Manual evaluation set of 50 conversations reviewed by a native speaker |
| 2 | Persian, transliteration, English and correction per reply | JSON always parsed or handled gracefully |
| 3 | Key never in the browser | Worker-only secret |
| 4 | Per-visitor and global limits | 429 with friendly copy |
| 5 | Privacy disclosure | Shown on the tutor page and the Privacy page |

## 8. Real application

- **Model choice and cost control:** evaluate Persian quality across providers, including Claude models. Cache common openers. Paid tier for higher limits.
- **Voice conversation:** streaming speech in and natural voice out.
- **Memory across sessions** (with consent): recap of mistakes, vocabulary used, and progress.
- **Links to the course:** corrections link to grammar concepts, and new words can be saved to My cards.
- **Safety:** moderation, abuse reporting and age gating.
- **AI NPC inside missions** (see F11) and an AI examiner for SAMFA speaking (F18).

## 9. Metrics *(proposed)*

- Conversations per active learner.
- Turns per conversation.
- Correction rate over time.
- Limit-hit rate.
- Cost per conversation.

## 10. Code references

`src/app/app/tutor/page.tsx` · `src/lib/backend.ts` · `worker/src/index.js` · `worker/wrangler.toml` · `worker/README.md`
