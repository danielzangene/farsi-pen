# 09 · Persian script and right-to-left

How the prototype shows Persian (right-to-left, cursive, its own digits) inside an English, left-to-right interface, and the rules a designer follows when laying it out.

## 1. Principles

- **English shell, Persian islands.** The page is English and left-to-right (`<html lang="en">`, `src/app/layout.tsx:53`). Persian is wrapped where it appears; the layout itself is never flipped. Skill rule: "never set `dir` on a whole LTR layout" (`.claude/skills/farsi-pen-design-system/SKILL.md:102`).
- **Tag the smallest element that holds Persian.** `lang="fa"` picks the font and the screen-reader voice; `dir="rtl"` sets the reading order. Both go on the element that contains the Persian, not on its card or page.
- **One script per line on learning cards.** Persian, transliteration and English are stacked, each on its own line, in an order the learner chooses. Inline mixing is kept for short references only.
- **Never break the joins.** Persian letters connect. No letter-spacing, no uppercase, and colour individual letters only with zero-width joiners.
- **Forgive how learners type.** Arabic letter forms, missing half-spaces and extra spaces are accepted as the same answer.
- **Give Persian room.** Dots and descenders need taller lines than Latin text: loose leading for anything longer than a word.

## 2. Specification

### 2.1 Primitives

| Primitive | What it renders | Props | Source |
|---|---|---|---|
| `Fa` | `<span lang="fa" dir="rtl">` around any Persian text | `children`, `className` | `src/components/ui.tsx:25-31` |
| `FaWord` | One vocabulary word, laid out per the script settings (see 2.6) | `word` (`fa`, `tr`), `settings`, `size` = `md` / `lg` / `xl` | `src/components/ui.tsx:51-68` |
| `ColoredWord` | A Persian word with each letter coloured by how clearly it was heard | `letters` (from `analyzeSpoken`), `className` | `src/components/PronunciationFeedback.tsx:31-47` |
| `PersianKeyboard` | On-screen ISIRI keyboard | `onKey`, `onBackspace` | `src/components/PersianKeyboard.tsx:18-43` |

`FaWord` sizes (`src/components/ui.tsx:52-53`):

| `size` | Leading script size | Second line size |
|---|---|---|
| `md` | `text-xl` (20px) | `text-sm` (14px); Persian second line `text-lg` |
| `lg` | `text-3xl` (30px) | `text-base` (16px); Persian second line `text-2xl` |
| `xl` | `text-4xl sm:text-5xl` (36px / 48px) | `text-base` (16px); Persian second line `text-2xl` |

Usage: `<Fa>` appears 106 times across `src/`; `FaWord` 5 times (lesson, choice, recall and speak rounds, and the Say it dialog). 21 further elements set `lang="fa"` by hand, mostly reading blocks and inputs (grep `lang="fa"`).

### 2.2 Language and direction attributes

| Situation | Attributes | Example |
|---|---|---|
| Whole document | `lang="en"`, no `dir` (left-to-right) | `src/app/layout.tsx:53` |
| Any Persian word or phrase | `<Fa>` (`lang="fa" dir="rtl"`) | `src/components/WordCard.tsx:21` |
| Reading passage (a block of paragraphs) | `lang="fa" dir="rtl"` on the block | `src/components/reading/ReadingLessonView.tsx:186`, `src/components/samfa/Practice.tsx:143` |
| One Persian sentence on its own line | `<p dir="rtl" lang="fa">` | `src/components/reading/ReadingLessonView.tsx:220`, `src/components/Poetry.tsx:117` |
| Free input that may be English, Finglish or Persian | `dir="auto"` (direction follows the first strong letter typed) | `src/components/RecallRound.tsx:167`, `src/components/mission/AnswerInput.tsx:85`, `src/app/app/words/page.tsx:214`, `src/app/app/tutor/page.tsx:248`, `:321` |
| Echoing the learner's own query inside English copy | `<span dir="auto">` | `src/components/DictionaryPanel.tsx:70` |
| Input that must be Persian | `dir="rtl" lang="fa"` | `src/components/samfa/Practice.tsx:275-276`, `src/components/home/HomeSections.tsx:290-297`, `src/app/app/review/page.tsx:197` |
| Input whose language depends on the exercise | `lang` switches with the direction (`fa` or `en`) | `src/components/RecallRound.tsx:168` |
| A row of Persian items that should read right to left | `dir="rtl"` on the list or grid | Alphabet grid `src/app/app/alphabet/page.tsx:55`; sound tiles `src/components/PronunciationFeedback.tsx:134` |
| Latin label inside a Persian context | `dir="ltr"` (and `lang="en"` where it is a sentence) | Alphabet tile names `src/app/app/alphabet/page.tsx:73`; sound labels `src/components/PronunciationFeedback.tsx:148`; "(AI-written on Ganjoor)" `src/components/Poetry.tsx:129` |
| On-screen keyboard | `lang="fa" dir="ltr"`, so keys sit in physical-keyboard order | `src/components/PersianKeyboard.tsx:20` |

Any element with a `dir` attribute is a bidi isolate (the HTML user-agent style gives it `unicode-bidi: isolate`). That is why `<Fa>` can sit inside an English sentence without dragging neighbouring punctuation or numbers into the wrong place.

### 2.3 Font and type rules for Persian

| Property | Value | Source |
|---|---|---|
| Family | `--font-fa: "Yekan Bakh", Tahoma, sans-serif` | `src/app/globals.css:88` |
| File | `YekanBakhFaNum-VF.woff` (variable, FaNum = Persian digits) | `src/app/globals.css:5-10`, `src/fonts/` |
| Weight range | `font-weight: 100 1000`; theme weights remapped: `font-semibold` 500, `font-bold` 600, `font-extrabold` 700 | `src/app/globals.css:8`, `:91-93` |
| Loading | `font-display: swap` | `src/app/globals.css:9` |
| DOTS axis | `"DOTS" 1` on every `[lang="fa"]`; `"DOTS" 0` inside or on `h1`, `h2`, `h3`. The code comment calls 1 the "dotted style for running text" and 0 "plain, for headings" | `src/app/globals.css:3-4`, `:157`, `:162-165` |
| Letter-spacing | `0` on `[lang="fa"]` ("Letter-spacing breaks Persian letter joining") | `src/app/globals.css:158-159` |
| Case | `text-transform: none` on `[lang="fa"]` | `src/app/globals.css:160` |
| Tracing canvas | Draws guides in the same font: `"Yekan Bakh", Tahoma, sans-serif` | `src/components/TraceCanvas.tsx:9` |

Emphasis: Persian headwords use `font-bold` (600); secondary Persian uses the regular weight in `text-muted`.

### 2.4 Persian digits

| Rule | Detail | Source |
|---|---|---|
| Digits come from the font | The FaNum build of Yekan Bakh draws ASCII digits 0–9 as Persian digits (۰–۹) wherever `lang="fa"` applies | `src/app/globals.css:3`, `SKILL.md:104` |
| Content stores ASCII digits | Only one place stores Unicode Persian digits: the numbers table in grammar A1 ("yek ۱"…"dah ۱۰") | `src/content/grammar/a1.ts:351-360` |
| Outside Persian, digits stay Latin | XP, scores, timers and counts are English UI and use the system font | e.g. `src/components/samfa/Practice.tsx:32` |
| Speech checking folds digits | Persian (۰–۹) and Arabic-Indic (٠–٩) digits are mapped to ASCII before comparing | `src/lib/pronounce.ts:32-40` |

### 2.5 Line height

Tailwind 4 values: `leading-tight` 1.25, `leading-relaxed` 1.625, `leading-loose` 2 (`node_modules/tailwindcss/theme.css:391-395`). Body is 1.5 (`src/app/globals.css:136`).

| Persian content | Leading | Where |
|---|---|---|
| Reading passage | `leading-[2.3]` | `src/components/reading/ReadingLessonView.tsx:186` |
| SAMFA reading passage | `leading-[2.2]` | `src/components/samfa/Practice.tsx:143` |
| Sentence on its own line, poem line, long textarea | `leading-loose` (2) | `ReadingLessonView.tsx:220`, `Poetry.tsx:25`, `:117`, `Practice.tsx:274` (`!leading-loose`) |
| Headword, dialogue line, phrase card | `leading-relaxed` (1.625) | `ui.tsx:54`, `mission/InfoSteps.tsx:52`, `scene/ScenePlayer.tsx:226` |
| Letter-form tiles (alphabet) | `leading-[1.6]` | `src/app/app/alphabet/page.tsx:151` |
| Single isolated letter in a tile or badge | `leading-none` / `leading-tight` | `alphabet/page.tsx:72`, `PronunciationFeedback.tsx:147`, `scene/Cast.tsx:19` |

The skill asks for "loose leading for Persian running text (`leading-loose` / 2.2 in reading blocks)" (`SKILL.md:55`).

### 2.6 Script settings

Stored in `settings` (`src/lib/store.ts:26-30`; defaults `script: "latin"`, `scriptOnly: false`, `showKeyboard: true` at `:179-181`). Chosen with the **Script** segmented control in `CardControls` (`src/components/CardControls.tsx:21-30`), shown above lessons and in Settings (`src/app/app/settings/page.tsx:139`).

| Option label | Stored value | Card shows | `FaWord` layout |
|---|---|---|---|
| Latin first | `script: "latin"`, `scriptOnly: false` | Transliteration large (`font-extrabold`), Persian below in `text-muted` | `ui.tsx:62-67` |
| فارسی first | `script: "farsi"`, `scriptOnly: false` | Persian large (`font-bold leading-relaxed`), transliteration below (`font-semibold text-muted`) | `ui.tsx:55-61` |
| Script only | `scriptOnly: true` | Persian only; transliteration and "sounds like" hints hidden | `ui.tsx:54` |

`scriptOnly` is checked in 30+ places to hide transliteration (grep `scriptOnly`), for example word cards (`WordCard.tsx:22`, `:36`, `:43`), scene lines (`scene/ScenePlayer.tsx:229`), mission lines (`mission/InfoSteps.tsx:57`) and poems (`Poetry.tsx:28`). Choice options follow the same three layouts (`ChoiceRound.tsx:160-167`).

### 2.7 Mixing Persian, transliteration and English on one card

| Pattern | Rule | Example |
|---|---|---|
| Stacked (default for learning content) | One line per script, in this order: leading script, second script, English meaning, then the example in a `bg-paper` inset in the same order | `src/components/WordCard.tsx:19-46` |
| Inline reference | Persian inside an English sentence goes in `<Fa>`; separate scripts with a middle dot `·` | `{word.tr} · <Fa>{word.fa}</Fa>` in `ChoiceRound.tsx:94`; `ReadingLessonView.tsx:107` |
| Title with Persian name | English title, then `<Fa className="ms-2 … text-muted">` with the Persian title | `GrammarLesson.tsx:78-80`, `samfa/page.tsx:51-52` |
| Spacing around Persian | Logical spacing (`ms-`, `me-`, `ps-`, `pe-`, `text-start`) so gaps sit on the correct side in either direction. Count in `src/**/*.tsx`: 84 logical vs 51 physical (`ml-`, `pl-`, `left-`, `text-left`…) | `ReadingLessonView.tsx:104` (`pe-1 ps-4`) |

### 2.8 Half-space (ZWNJ, U+200C)

Persian uses the zero-width non-joiner to stop a join inside one word (for example می‌خوانم, کتاب‌ها).

| Layer | Behaviour | Source |
|---|---|---|
| Content | Stored as the real character or `‌` (documented in the word file header) | `src/content/words.ts:7` |
| On-screen keyboard | A **نیم‌فاصله** key inserts U+200C | `src/components/PersianKeyboard.tsx:31-32` |
| Answer checking | ZWNJ and ZWJ are removed, and so are spaces, so می‌بینمت, میبینمت and می بینمت all match | `src/lib/answer.ts:47`, tests `src/lib/answer.test.ts:14-15` |
| Spelling suggestions | ZWNJ is one of the insertable letters; inserting a missing half-space costs 0.3 of a normal edit ("a tiny slip") | `src/lib/spell.ts:12`, `:64` |
| Dictionary look-up | Strips ZWNJ, tries plural and verb prefixes with and without it, and retries with a space | `src/lib/dictionary.ts:53-62`, `:95` |
| Tap-a-word reading | Text is split on spaces only, so a ZWNJ compound stays one tappable word | `ReadingLessonView.tsx:194`, `Poetry.tsx:118` |
| Word counts (SAMFA writing) | Split on `\s+`; ZWNJ is not whitespace, so a compound counts as one word | `src/components/samfa/Practice.tsx:214` |
| Pronunciation feedback | A half-space renders as nothing but still separates words for scoring | `src/lib/phonics.ts:73-76` |

### 2.9 Arabic and Persian letter forms

Persian uses ک (keheh) and ی (farsi yeh); Arabic keyboards and pasted text often give ك and ي / ى.

| Layer | Behaviour | Source |
|---|---|---|
| Content | Persian forms only. The single Arabic ي in `src/content` is deliberate, in the alphabet note that contrasts the two | `src/content/alphabet.ts:65` |
| Answer checking | ك → ک, ي / ى → ی before comparing | `src/lib/answer.ts:45-46`, test `answer.test.ts:12-13` |
| Spelling | Same mapping, plus vowel marks and ZWJ removed | `src/lib/spell.ts:18-25` (`cleanFa`) |
| Speech scoring | Both forms map to the same sound | `src/lib/phonics.ts:63-64` |

### 2.10 Cursive joining and coloured letters

| Need | How the code keeps the joins | Source |
|---|---|---|
| Show a letter's initial, medial or final form on its own | Add a zero-width joiner (ZWJ, U+200D): initial = letter + ZWJ, medial = ZWJ + letter + ZWJ, final = ZWJ + letter. Non-connecting letters get no trailing ZWJ | `src/content/alphabet.ts:21-29` (`letterForms`) |
| Colour each letter of a word differently | Each letter is its own `<span>`; `joinedText` adds a ZWJ on the side(s) where the letter joins, so the browser still shapes connected forms across span boundaries | `src/lib/phonics.ts:208-212`, used in `PronunciationFeedback.tsx:41`; tests `phonics.test.ts:53-55` |
| Know which letters join | `joinPrev` / `joinNext` from the non-joining set ا آ أ إ د ذ ر ز ژ و ؤ ء ة | `src/lib/phonics.ts:53-54`, `:166-167` |
| Show a vowel sign on its own | Prefix the tatweel `ـ` so the mark has a base | `src/app/app/alphabet/page.tsx:97` |

Colour changes alone do not break joins in modern browsers, but some engines drop shaping across element boundaries; the ZWJ makes the intended form explicit.

### 2.11 On-screen Persian keyboard

| Property | Value | Source |
|---|---|---|
| Layout | ISIRI 9147 (standard Persian), rows in physical order: ض on Q. Row 1 ض ص ث ق ف غ ع ه خ ح ج چ; row 2 ش س ی ب ل ا ت ن م ک گ; row 3 ظ ط ز ر ذ د پ و ژ آ | `src/components/PersianKeyboard.tsx:5-12` |
| Bottom row | Half-space (`!flex-[0.7] !text-xs`), space labelled فاصله (`!flex-[3]`), backspace (`aria-label="Backspace"`) | `:30-40` |
| Key | `h-11` (44px) tall, `flex-1`, `rounded-xl border border-line bg-card text-xl font-bold`; rows indent by `i * 4%` | `:15-16`, `:22` |
| Focus | Keys are `tabIndex={-1}` (not in the tab order); the text field keeps focus | `:24` |
| Where | Recall rounds when answering in Farsi; toggled by a keyboard button (`aria-pressed`) next to the input and by Settings ("On-screen Persian keyboard when typing in Farsi") | `RecallRound.tsx:180-192`, `settings/page.tsx:142-149` |

### 2.12 Alphabet letter display

| Element | Spec | Source |
|---|---|---|
| Letter grid | `dir="rtl"` grid, 4 / 6 columns; square `tile`s; letter `text-3xl leading-none`; Latin name `text-[11px] font-bold` with `dir="ltr"` | `src/app/app/alphabet/page.tsx:55-84` |
| Letter hero | `size-20` firuze-soft tile, letter `text-5xl` | `:125` |
| Four forms | Four `tile`s: Alone, Start, Middle, End; glyph `text-3xl leading-[1.6]`; label `eyebrow text-[11px]` | `:141-155`, labels `:11` |
| Non-joiners | Chip "Doesn’t join to the next letter" | `:136` |
| Tracing | Uses the selected form's text (with its ZWJ) | `:179-181` |

### 2.13 Display rules: how to lay out Persian

**A word (headword or option)**

| Rule | Value |
|---|---|
| Wrap | `FaWord` for vocabulary prompts; `<Fa>` elsewhere |
| Size and weight | Leading script ≥ `text-xl`; `font-bold` (600) for Persian headwords |
| Leading | `leading-relaxed` |
| Second line | Transliteration `text-sm`/`text-base font-semibold text-muted`; hidden when `scriptOnly` |
| Audio | `AudioButtons` beside or below, never instead of the text |

**A sentence (example or reading line)**

| Rule | Value |
|---|---|
| Container | Own line: `<p dir="rtl" lang="fa">` or `<Fa className="block">` |
| Size | `text-base` in examples, `text-xl` on its own |
| Leading | `leading-loose` (2) |
| Translation | English on the next line in `text-sm font-semibold text-muted` |
| Passage | Block with `lang="fa" dir="rtl"`, `bg-paper`, `rounded-2xl`, `p-5 sm:p-7`, `text-xl` (to `sm:text-2xl`), `leading-[2.2]`–`[2.3]`, `space-y-4`/`5` between paragraphs |

**A dialogue line (mission or scene)**

| Rule | Value |
|---|---|
| Speaker | English name as label (`eyebrow` or `text-sm font-extrabold` in the speaker's tone); Persian initial on a `CastAvatar` |
| Line | `<Fa>` `text-xl`–`text-2xl font-bold leading-relaxed` |
| Below | Transliteration (unless `scriptOnly`), then English when shown |
| Bubble side | Missions: the learner's lines align to the end (`justify-end`), others to the start, `max-w-[85%]` (`mission/InfoSteps.tsx:45-46`). Scenes: one column, the learner's part gets `border-s-4 border-firuze bg-firuze-soft` (`scene/ScenePlayer.tsx:214`) |
| Play | Icon button with `aria-label` naming the speaker or line |

**A table (grammar forms)**

| Rule | Value |
|---|---|
| Direction | The table stays left-to-right; Persian sits in its own column (`GrammarLesson.tsx:85-104`) |
| Persian cell | Any cell containing Persian is wrapped in `<Fa className="text-lg">` (`:100`) |
| Other columns | Transliteration in `font-extrabold text-plum-ink` (column 2); English plain |
| Overflow | `overflow-x-auto` around the table |
| Do not | Mix Latin and Persian in one cell (see Gap 2) |

**A poem couplet**

| Rule | Value |
|---|---|
| Layout | Each half-line (misra) on its own centred line, `text-center` (`Poetry.tsx:21-30`, `:116-120`) |
| Size | `text-xl sm:text-3xl font-bold leading-loose` |
| Under each line | Transliteration `text-sm font-semibold text-muted` (unless `scriptOnly`) |
| Meaning | Full English meaning once, below the couplet, in a `bg-paper` inset |
| Explanation | Modern-Persian summary in `lang="fa" dir="rtl"`, `text-start`, `leading-relaxed`; English provenance tag inside it uses `lang="en" dir="ltr"` |

## 3. Usage: do and don't

| Do | Don't |
|---|---|
| Wrap every Persian string in `<Fa>` (or `lang="fa"` + `dir` on its block) | Leave Persian bare in an English element; it renders in the system font and is read by the English voice |
| Use `dir="auto"` on inputs that accept Finglish or Persian | Force `dir="rtl"` on a field where most learners type Latin letters |
| Put Persian, transliteration and English on separate lines | Run them together in one line without `·` and `<Fa>` isolation |
| Use logical spacing (`ms-2`, `ps-4`, `text-start`) next to Persian | Use `ml-2` / `text-left` and then patch for RTL |
| Colour letters with `joinedText` spans | Wrap letters in spans without joiners, or add `tracking-*` to Persian |
| Store digits as ASCII and let the FaNum font draw Persian digits | Type Persian digits into Latin text, or mix "yek ۱" in one cell |
| Store ک and ی; let the checker accept ك and ي | Mark a learner wrong for typing Arabic forms or skipping the half-space |
| Give running Persian `leading-loose` or more | Set Persian sentences at `leading-tight` or `leading-none` |
| Use `DOTS 1` for text and let `h1`–`h3` switch to `DOTS 0` | Set `font-variation-settings` by hand on single elements |

## 4. Accessibility notes

- `lang="fa"` on Persian lets screen readers switch to a Persian voice where one is installed; English UI stays in the English voice. Persian that is not tagged is mispronounced.
- Transliteration is deliberately left untagged (read as English). This is a reasonable approximation for learners.
- `ColoredWord` hides the coloured spans (`aria-hidden`) and gives the paragraph an English `aria-label` listing each sound and its status, for example "kh clear, â unclear" (`PronunciationFeedback.tsx:32-37`).
- Alphabet tiles have an English `aria-label`: "be, sounds like b" (`alphabet/page.tsx:69`).
- The on-screen keyboard is an aid, not the only way to type: the field accepts a physical keyboard and Finglish ("Persian script or Latin letters both work", `RecallRound.tsx:131`).
- Persian line heights (≥ 1.625 for words, 2 for sentences) also help readers who need more line spacing (WCAG 1.4.12); nothing in the Persian styles caps line height.
- Answer checking that ignores ك/ي, ZWNJ and spaces reduces errors that are about typing, not knowledge, which matters for dyslexic learners (see 10 · Accessibility).

## 5. Code reference

| Area | Files |
|---|---|
| Primitives | `src/components/ui.tsx` (`Fa`, `FaWord`) |
| Font, DOTS, Persian resets | `src/app/globals.css:3-10`, `:88`, `:155-165` |
| Script settings | `src/lib/store.ts:26-30`, `src/components/CardControls.tsx` |
| Keyboard | `src/components/PersianKeyboard.tsx` |
| Letter forms | `src/content/alphabet.ts` (`letterForms`), `src/app/app/alphabet/page.tsx` |
| Joining and coloured letters | `src/lib/phonics.ts` (`joinedText`, `NON_JOINING`), `src/components/PronunciationFeedback.tsx` (`ColoredWord`) |
| Normalisation (ك/ي, ZWNJ, digits) | `src/lib/answer.ts` (`normalize`), `src/lib/spell.ts` (`cleanFa`), `src/lib/pronounce.ts` (`soundKey`), `src/lib/dictionary.ts` |
| Reading, poetry, dialogue, tables | `src/components/reading/ReadingLessonView.tsx`, `src/components/Poetry.tsx`, `src/components/mission/InfoSteps.tsx`, `src/components/scene/ScenePlayer.tsx`, `src/components/GrammarLesson.tsx` |

## 6. Gaps and recommendations

**P1**

1. **Persian outside `<Fa>`.** Several strings are bare Persian in English elements, so they render in the system font and are read by the English voice: the Script option "فارسی first" (`CardControls.tsx:27`), the alphabet subtitle and filter "آ and ء" (`alphabet/page.tsx:31`, `:39`). Placeholders with Persian (`RecallRound.tsx:173`, `AnswerInput.tsx:86`, `words/page.tsx:207`) cannot be tagged at all. *(proposed)* Let `Segmented` options accept a React node so labels can use `<Fa>`; keep Persian out of placeholders or tag the whole input `lang="fa"` only when it expects Persian.
2. **Mixed cell in the grammar numbers table.** `GrammarLesson.tsx:100` wraps any cell that contains a Persian character in `<Fa>` (RTL). The cells "yek ۱" … "dah ۱۰" (`grammar/a1.ts:351-360`) therefore render with the digit first on the left ("۱ yek"). The column is also headed "Farsi" but holds transliteration. *(proposed)* Split into a Persian digit column and a transliteration column; only wrap cells that are wholly Persian.
3. **Grammar ignores "Script only".** Grammar examples always show transliteration (`GrammarLesson.tsx:126`), unlike every other learning surface. *(proposed)* Hide `e.tr` when `scriptOnly`.
4. **Alignment of Persian blocks is inconsistent.** Word cards force `text-left` on Persian (`WordCard.tsx:21`, `:27`), scene lines use inline `<Fa>` (left) and `ColoredWord` with `text-left` (`scene/ScenePlayer.tsx:223-226`), while mission bubbles and phrase cards use `<Fa className="block">`, which aligns right (`mission/InfoSteps.tsx:52`, `:136`). *(proposed)* Rule: on cards where Persian is stacked with Latin lines, align to the card's start (left) so the lines share an edge; in passages and Persian-only blocks, align right.

**P2**

5. **Utilities override the Persian resets.** `[lang="fa"]` lives in `@layer base`, so any utility on the same element wins. The landing page's letter strip uses `tracking-[0.5em]` on `lang="fa"` (`src/app/page.tsx:184-190`). It is harmless there (isolated letters, `aria-hidden`), but nothing stops tracking on joined text. *(proposed)* Add a review-checklist item and a lint rule for `tracking-*` / `uppercase` / `eyebrow` on Persian.
6. **DOTS 0 only on `h1`–`h3`.** The skill says "0 in headings" (`SKILL.md:52`); the code applies it only to heading tags (`globals.css:162-165`). Persian in headline-styled `<p>` elements keeps DOTS 1. Decide whether that is intended and document it.
7. **Tight leading on single letters.** `leading-none` and `leading-tight` on Persian letters (`alphabet/page.tsx:72`, `PronunciationFeedback.tsx:147`, `scene/Cast.tsx:19`) can clip dots below the baseline at large sizes. *(proposed)* Verify at 200% zoom; use at least `leading-tight` with padding.
8. **Keyboard details.** The code comment describes the old style ("2px border plus a 3px bottom edge", `PersianKeyboard.tsx:14`) while the class uses a 1px `border`; keys press with `active:translate-y-[3px]` instead of the system's scale (`:16`). ژ and آ are appended to row 3 rather than shown as a shift layer, and there are no punctuation keys (، ؟). At 320px the 12-key top row leaves keys about 19px wide. *(proposed)* Restyle on `tile` press rules, add a shift layer with ، ؟ ئ ء, and let the top row wrap below 360px.
9. **No rule for Persian digits in content.** The FaNum font shows Persian digits inside `lang="fa"`, but there is no guidance on when learners should see Persian digits versus Latin ones (prices, times, phone numbers in missions). *(proposed)* Write a content rule with doc 11.
10. **`ColoredWord` label language.** The English `aria-label` sits on a `lang="fa"` element (`PronunciationFeedback.tsx:37`), so some screen readers read it with the Persian voice. *(proposed)* Move the label to an `sr-only` `<span lang="en">` sibling.
