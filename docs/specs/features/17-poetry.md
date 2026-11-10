# F17 · Poetry: Fâl-e Hâfez and the poem of the day

**Product line:** 5. Structured course · **Priority:** P2 (delight and culture) · **Prototype status:** ✅ Live (16 poems)

## 1. Summary

"Hafez, Saadi and Khayyam — the lines every Iranian knows, with help to read them."

- **Fâl-e Hâfez:** a learner asks a question and opens one of 12 famous ghazals, with transliteration, English, an omen reading ("What Hafez tells you") and key words.
- **Poem of the day:** one of 16 poems, chosen by date.
- **Read the full poem:** loads any poem from Ganjoor's open data inside the app, with vowel marks and modern-Persian explanations. Any word can be tapped to look it up.

## 2. Why it matters

- Poetry is central to Persian culture. Heritage learners and "curious" learners come for it.
- Fâl-e Hâfez is a beloved ritual. It's delightful, shareable and a reason to come back.

## 3. User stories

- *As a learner,* I want to read a famous line with help: sounds, meaning and key words.
- *As a curious learner,* I want to take a fâl like Iranians do.
- *As an advanced learner,* I want the full poem with explanations.

## 4. How it works in the prototype

- **Content:**
  - `FAL`: 12 ghazals by Hafez;
  - `MORE`: 4 more poems (Saadi, Khayyam);
  - `POETS`: name, Persian name, dates and about.
  Each couplet has Persian, transliteration, an English rendering, key words and audio. The Persian matches Ganjoor exactly.
- **Fâl:** "Tradition says: one question, one fâl. But no one is watching."
- **Full poem:** fetched from `ganjoor/ganjoor-data` on jsDelivr, pinned to a commit. Shows vowel marks. "Explain in modern Persian" toggles explanations; AI-written ones are labelled "(AI-written on Ganjoor)". Every word can be tapped for the dictionary ("Not in the dictionary — poetic and old words often aren't").
- **No outbound links:** the source is credited as plain text.
- **Errors:** "Couldn't load the poem. Check your connection and try again."

## 5. Data stored

None (read-only).

## 6. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | 12 Fâl ghazals + poem of the day | Text matches Ganjoor; recorded |
| 2 | Full poem in-app | Loads from the pinned commit; graceful error |
| 3 | Licence and credit | Ganjoor credited in Profile |

## 7. Real application

- **Poetry path:** a guided mini-course on reading classical verse (metre, archaic words, Arabic loans).
- **Recitations** by native readers. Daily poem notifications. Shareable cards.
- **More poets:** Rumi, Ferdowsi, Forough Farrokhzad, Sohrab Sepehri (checking rights for modern poets).

## 8. Code references

`src/content/poems.ts` · `src/components/Poetry.tsx` · `src/app/app/poetry/page.tsx`
