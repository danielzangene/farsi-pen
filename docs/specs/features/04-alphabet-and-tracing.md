# F04 · Alphabet and letter tracing ("the pen")

**Product line:** 2. Script and sound · **Priority:** P0 (alphabet) / P1 (tracing) · **Prototype status:** ✅ Live (stroke-order hints 🔜)

## 1. Summary

The full Persian alphabet: 32 letters plus آ (alef madde) and ء (hamze), and the short-vowel signs. Each letter has audio, example words and all its joining forms. **Letter tracing with scoring** is the signature "pen" feature: learners trace each letter on a canvas and get a score.

## 2. Why it matters

- The script is the biggest barrier for English speakers, and for many heritage speakers who speak but can't read.
- Writing a letter by hand fixes it in memory better than recognising it alone.
- It gives the brand its name: Farsi *Pen*.

## 3. User stories

- *As a beginner,* I want to learn each letter's sound and its shapes at the start, middle and end of a word.
- *As a learner,* I want to practise writing letters and know if I did it well.
- *As a learner,* I want to know which letters are unique to Persian, and which don't join to the next letter.

## 4. How it works in the prototype

### 4.1 Letter grid and filters

- Filters: **All**, **Unique to Persian (4)** (پ چ ژ گ), and **Extra** (آ, ء).
- Each tile shows the letter. A dot marks letters unique to Persian. A "Doesn't join to the next letter" note appears on non-connecting letters.

### 4.2 Letter detail

- Name, sound ("sounds like"), and isolated, initial, medial and final forms.
- An example word with transliteration and English. Notes for special letters (e.g. آ starts a word with long â; ء sits on a "seat" ئ أ ؤ).
- Audio for the letter and the example.

### 4.3 Short vowels and signs

zabar (a), zir (e), pish (o), tashdid (doubling), sokun (no vowel), tanvin (-an).

### 4.4 Tracing

- A 300 px canvas shows the letter as a faint guide.
- **Scoring:** a 60×60 grid (5 px cells). Coverage measures how much of the letter the ink covers; precision measures how much of the ink stays within about 10 px of the letter. Scribbling over everything scores low.
- **Pass mark:** 60. Hint text: "Write right to left, and don't forget the dots. Stroke-order hints are coming next."
- **Storage:** best score per letter. **XP:** +3 the first time a letter passes (`XP.tracePass`).
- **Badges:** First Stroke (first letter traced), Full Alphabet (every letter traced).

### 4.5 Integration

- The Today plan teaches letters first for non-readers (F01).
- Path section 1 shows letters traced out of 34.
- Getting-started checklist: "Trace a letter of the alphabet".

## 5. Content

34 letters (`src/content/alphabet.ts`), each with `char`, `name`, `sound`, `connects`, optional `persianOnly`/`extra`, an `example {fa, tr, en}` and an optional `note`. All are recorded.

## 6. Data stored

`traced: Record<letterId, bestScore>`

## 7. Edge cases

- **Mouse, touch or pen** all work. Multi-touch is ignored.
- **Very small screens:** the canvas fits its column with no sideways scrolling at 320 px (audited).
- **Dots and stroke order** aren't checked. Only the overall shape is.

## 8. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | All 34 letters with 4 forms, audio and example | Content complete; every string has audio |
| 2 | Tracing with a score and pass mark | Score 0–100; pass ≥ 60 saves; XP once per letter |
| 3 | Unique and non-joining letters marked | Filter and marks present |
| 4 | Vowel signs page | All 6 signs with examples |
| 5 | Works on touch devices | Tested on iOS Safari and Android Chrome |

## 9. Real application

- **Stroke-order hints:** animated strokes, with per-stroke direction checking (planned).
- **Trace each form** (initial, medial, final), and **whole words** with joins.
- **Free writing:** write a dictated word with no guide, recognised by handwriting recognition.
- **Reading drills:** letter → sound, sound → letter, and word decoding with and without vowel marks.
- **Calligraphy mode** (Nastaliq style) as a premium or delight feature.

## 10. Metrics *(proposed)*

- % of non-readers who trace all letters within 14 days.
- Average attempts to pass per letter (finds hard letters).

## 11. Open questions

- Should tracing require each joining form, or just the isolated form (as now)?

## 12. Code references

`src/content/alphabet.ts` · `src/app/app/alphabet/page.tsx` · `src/components/TraceCanvas.tsx` · `recordTrace` in `src/lib/store.ts`
