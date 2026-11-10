# F09 · Forgiving answer checking and the Persian keyboard

**Product line:** 3. Vocabulary that sticks (used everywhere learners type) · **Priority:** P0 · **Prototype status:** ✅ Live

## 1. Summary

Every typed answer goes through one shared checker. It forgives the slips that don't matter (typos, Arabic vs Persian letter forms, missing half-spaces, vowel marks, informal English) and tells the learner "almost — check your spelling" instead of marking them wrong.

An on-screen **Persian keyboard** (ISIRI layout) lets learners answer in script without installing a keyboard. Answers in **Finglish** (Latin transliteration) are accepted too.

## 2. Why it matters

- Being marked wrong for a typo is the most common frustration in language apps, and it's often unfair.
- Most learners don't have a Persian keyboard installed. Requiring one blocks EN→FA practice.

## 3. User stories

- *As a learner,* I want small typos accepted, with a gentle spelling tip.
- *As a learner,* I want to answer in Finglish or Persian script, whichever I can.
- *As a learner without a Persian keyboard,* I want one on screen.

## 4. How it works in the prototype

### 4.1 Vocabulary, grammar and practice checker (`answer.ts`)

- **Normalisation:**
  - lower case; punctuation and spaces removed;
  - Arabic ك/ي → Persian ک/ی;
  - ZWNJ (half-space) and diacritics removed, so â = a;
  - English contractions expanded (I'm → I am);
  - informal English allowed (nite → night, thx → thanks, pls → please, u → you, ur → your).
- **Typo tolerance by answer length:**
  - 1–2 characters: exact match only (so "na" doesn't become "ne");
  - 3–6 characters: 1 edit;
  - 7 or more: 2 edits.
- **Verdicts:** *correct*, *almost* (accepted, with a spelling tip) or *wrong*.
- **Guard:** an exact match with another item's answer is never "almost". "grandmother" isn't accepted as a typo of "grandfather".
- **Synonyms:** in EN→FA, any other word with the same English meaning is accepted (mersi / mamnun).

### 4.2 Mission free-answer checker (`mission-check.ts`)

- Free sentences can't be matched exactly. Each task lists **required pieces** (groups of alternatives in Finglish and Persian script), and every group must appear anywhere in the answer.
- **Stricter tolerance per piece:** short pieces are easy to find inside other words (شیر inside پنیر).
- Persian-script answers (typed or recognised) are compared **by sound**, so صلام matches سلام.
- **mustNot pieces** mark an answer that's about something else (e.g. "I'm from…" when asked your name).
- Verdicts: correct, almost or wrong. The first missing piece is reported as the hint.

### 4.3 Persian keyboard

- Standard ISIRI layout on screen, shown for EN→FA answers when enabled ("On-screen Persian keyboard when typing in Farsi").
- Includes the half-space (ZWNJ) key.

## 5. Data stored

`settings.showKeyboard`. The checker itself is stateless.

## 6. Edge cases

- **Mixed script answers** (half Finglish, half Persian): each is normalised separately and compared with the forms of the same script.
- **Spoken vs formal variants** (mikhâm / mikhâham): both listed as accepted where relevant.
- **Right-to-left input:** inputs set `dir` automatically per script.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | One shared checker | Used by lessons, practice and grammar; unit-tested (`answer.test.ts`) |
| 2 | Tolerance rules in §4.1 | Tests for each length band and the guard |
| 3 | Finglish and script accepted | Both forms in content for every word |
| 4 | Mission piece checker | Every model answer passes its own checker (`missions.test.ts`) |
| 5 | On-screen keyboard | Toggle in Profile; usable by touch and mouse |

## 8. Real application

- **One transliteration standard** published to learners (â, kh, gh, sh, zh, ch, ' for ع/ء), plus tolerant variants (aa, x, q).
- **AI-assisted grading** for open answers (SAMFA writing, tutor), with the rule-based checker as a fast first pass.
- **Error analytics:** most common wrong answers per item, feeding the content team.

## 9. Code references

`src/lib/answer.ts` · `src/lib/quiz.ts` · `src/lib/mission-check.ts` · `src/components/PersianKeyboard.tsx` · tests: `answer.test.ts`, `mission-check.test.ts`
