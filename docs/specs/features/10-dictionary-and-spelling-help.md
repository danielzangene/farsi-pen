# F10 · Dictionary, word browser and spelling help

**Product line:** 3. Vocabulary that sticks · **Priority:** P1 · **Prototype status:** ✅ Live

## 1. Summary

A search box on the Words tab that looks up **any** word, in English or Persian:

- course words first, with transliteration, audio and lesson;
- then **46,000+ dictionary entries** with example sentences.

Any meaning can be added to **My cards** as a flashcard. A Persian **spelling helper** suggests "Did you mean …?" for misspelled words. A **word browser** lists the course vocabulary with filters.

## 2. Why it matters

- Learners meet words outside the course (in songs, from family, on signs) and want to look them up without leaving the app.
- Spelling Persian is hard: several letters sound the same, and half-spaces are invisible.

## 3. User stories

- *As a learner,* I want to look up a word I heard and add it to my cards.
- *As a learner,* I want help when I misspell a Persian word.
- *As a learner,* I want to browse all course words by lesson, type and progress.

## 4. How it works in the prototype

### 4.1 Dictionary (`dictionary.ts`)

- **Sources:** VahidN/EnglishToPersianDictionaries (Apache-2.0: essential-english-words, generic-1, learn-english). Built by `scripts/build-dictionary.mjs` into per-letter JSON files in `public/data/dict/en|fa`, loaded on demand.
- 46,511 entries and 3,167 example sentences. Meanings are ranked by everyday use, duplicates differing only in spacing are merged, and dropped madde is restored (اب → آب).
- **Persian lookups** strip plural and verb endings and prefixes (`faStems`) to find the dictionary form.
- **Direction** is detected from the script.

### 4.2 Add to my cards

Any meaning can be saved as a custom word (`customWords`). It then appears in My cards and flashcards, without transliteration for now.

### 4.3 Spelling help (`spell.ts`)

- A Peter Norvig-style corrector, after shahind's Persian-Spell-Corrector, with learner-specific costs:
  - swapping sound-alike letters (س/ص/ث, ز/ذ/ض/ظ, ت/ط, ه/ح, ق/غ, ا/آ/ع) and missing half-spaces count as small slips;
  - course words, including spoken forms, rank first.
- **Lexicon:** course vocabulary plus `public/data/fa-words.txt` (60,000 words from shahind/Persian-Words-Database), loaded on demand.
- Two edits are tried only when one isn't enough.

### 4.4 Word browser

- Search plus filters (lesson, type, progress) and a choice of view.
- Say it and "Hear it in real videos" on every card.
- Empty result: "Check the dictionary above, or loosen the filters."

## 5. Data stored

`customWords: Record<id, { fa, en, addedAt, … }>`. Dictionary files are static assets.

## 6. Edge cases

- **Poetic and old words** may be missing ("Not in the dictionary — poetic and old words often aren't").
- **Offline:** dictionary files that have already loaded are cached by the browser; new letters need a connection.
- **Very short Persian queries** may match many stems. The best ranked match is shown first.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | Lookup EN↔FA with course words first | Tests in `dictionary.test.ts` |
| 2 | Add any meaning to My cards | Appears in flashcards right away |
| 3 | "Did you mean …?" for Persian | Tests in `spell.test.ts` |
| 4 | Licences credited | Profile lists open sources (Apache-2.0 etc.) |

## 8. Real application

- **Transliteration and audio for custom words** (generated with TTS, F24).
- **Example sentences for more entries.** Native-speaker review of the most-looked-up entries.
- **Colloquial dictionary:** spoken forms and slang that written dictionaries miss.
- **Look up from anywhere:** tap any Persian word in readings, poems, scenes and the tutor (partly done for readings and poems).
- **Search analytics:** top missing words become new course content.

## 9. Code references

`src/lib/dictionary.ts` · `src/lib/spell.ts` · `src/components/DictionaryPanel.tsx` · `src/app/app/words/page.tsx` · `scripts/build-dictionary.mjs` · `scripts/build-lexicon.mjs` · `src/lib/words.ts`
