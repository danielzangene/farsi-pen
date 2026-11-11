# 08 · Patterns

The recurring screens and interactions of the Farsi Pen prototype: when to use each, how it is built from top to bottom, its rules and states, and where it lives in the code.

## 1. Principles

- **One thing to do next.** Every root page and every session has one filled, large primary button (`btn-primary btn-lg`). Other actions are `btn-secondary` or `btn-ghost`. The Today plan, Path "Next up" card and session footers all follow this.
- **Sessions are a room with one door.** A practice session hides the app navigation (focus mode), shows a close X and a progress bar at the top, and keeps the main action in a fixed bar at the bottom. The way out is always the X.
- **Feedback is immediate, honest and kind.** An answer is judged at once in a bottom sheet with an icon, a short title and the right answer. Typos count as "almost", not wrong. Missed items come back later in the same session instead of failing the learner.
- **The app says when you are done.** Plans have an end ("That's enough for today"), mastered missions stop asking for daily repeats, and empty states tell the learner exactly what fills them.
- **State is never colour alone.** Correct, wrong, selected, done and current always pair a colour with an icon, a label, a strike-through or a screen-reader text.
- **Degrade, don't break.** Without a microphone, speech engine, network or backend, a feature explains what is missing and offers the nearest alternative (type instead, use the calendar, try another browser).

## 2. Specification

### 2.1 App frame (applies to every non-session page)

| Part | Real value | Source |
|---|---|---|
| Content column | `main` is `max-w-5xl px-4 pt-6`, bottom clearance `pb-[calc(7.5rem+env(safe-area-inset-bottom))]` on phones, `lg:pb-12` on desktop | `src/app/app/layout.tsx:14` |
| Desktop sidebar | `w-64`, solid `bg-card`, `border-r border-line`; groups: tabs, "Practice", "Course" | `src/components/AppNav.tsx:97-114` |
| Phone top bar | `material-canvas`, `h-14`, logo left, streak and XP chips right | `src/components/AppNav.tsx:116-124` |
| Phone tab bar | `glass`, `inset-x-3`, `bottom-[max(0.75rem,env(safe-area-inset-bottom))]`, `rounded-[1.75rem]`; a pill slides to the active tab over 420ms `--ease-spring` | `src/components/AppNav.tsx:126-145` |
| Tabs | Home, Path, Exams, Progress, Profile (Profile routes to `/app/settings/`) | `src/components/AppNav.tsx:13-19` |
| Sticky bars above the tab bar | `bottom-[calc(5.25rem+env(safe-area-inset-bottom))]`, `lg:bottom-4` | `src/components/LessonSession.tsx:86`, `src/app/app/tutor/page.tsx` (form) |
| Focus mode | `<FocusMode />` sets `body[data-focus]`; CSS hides `.app-nav`; layout drops sidebar offset and tab clearance | `src/components/ui.tsx:200-208`, `src/app/globals.css:618`, `src/app/app/layout.tsx:10-14` |

### 2.2 Page types

#### Tab root page (Home, Path, Exams, Progress, Profile)

- **When to use:** the five destinations in the tab bar. Each answers "where am I and what should I do here?"
- **Structure, top to bottom:**
  1. Title. Home: a muted greeting line `سلام · salâm, {name}!` above an h1 "Welcome back" / "Welcome" (`src/app/app/page.tsx:19-24`). Others: `PageHeader` (h1 `text-3xl font-extrabold tracking-tight`, muted subtitle) (`src/components/ui.tsx:184-194`).
  2. Hero card holding the page's single primary action: Today plan (Home), "Next up" (Path), "Find your level" (Exams), stat tiles (Progress), the "You" card (Profile).
  3. Supporting sections, each a `card p-5` or a section with an `h2 text-xl font-extrabold`, stacked with `space-y-6`.
- **Rules:** column width `max-w-2xl` (Home, Path, Exams), `max-w-3xl` (Progress), `max-w-xl` (Profile). One `btn-primary btn-lg` per page. Settings-style rows use a grouped list: `card divide-y divide-line overflow-hidden !p-0`, rows `min-h-[3.75rem]`, ChevronRight `text-faint` (`src/app/app/settings/page.tsx:37-55`, `src/app/app/exams/page.tsx:61-77`).
- **States:** hydrating (see 2.6), first run (Onboarding replaces Today: `src/app/app/page.tsx:26`), day done, everything done.
- **Examples:** Home `src/app/app/page.tsx:14-46`; Path `src/app/app/path/page.tsx:28-148`; Exams `src/app/app/exams/page.tsx:10-79`; Progress `src/app/app/progress/page.tsx:11-34`; Profile `src/app/app/settings/page.tsx:14-230`.

#### List / index page (Lessons, Missions, Grammar, Reading, Scenes, Sounds, Words, Alphabet, Poetry, My cards)

- **When to use:** a catalogue of items the learner picks from.
- **Structure:**
  1. `PageHeader` with a count subtitle ("3 of 31 lessons complete") and, when the list can be filtered, a `Segmented` control in the header slot (`src/app/app/bookmarks/page.tsx:76-86`, `src/app/app/words/page.tsx:60-70`).
  2. Optional summary strip: tinted line (`rounded-2xl bg-firuze-soft p-4 font-bold`, `src/app/app/missions/page.tsx:18-20`) or eyebrow count plus `ProgressBar` (`src/app/app/grammar/page.tsx`, header block).
  3. Optional group banner on a solid accent (`rounded-2xl bg-firuze p-5 text-on-accent`) with an on-banner button `btn btn-sm [--btn-bg:rgb(0_0_0/0.2)]` (`src/app/app/lessons/page.tsx:28-42`).
  4. Rows as `tile` links: leading badge (emoji or Persian letter in a rounded square), text stack (eyebrow meta joined with ` · `, title `font-extrabold` plus Persian title in `text-muted`, muted one-line detail), trailing status `chip`, then `ChevronRight` (`src/app/app/missions/page.tsx:28-56`).
  5. Coming-soon rows: plain `card ... opacity-70`, greyscale emoji, chip "Soon" with a Lock icon (`src/app/app/missions/page.tsx:58-71`).
  6. Optional closing card about what comes next ("Level 5 is being written", `src/app/app/lessons/page.tsx:96-104`).
- **Rules:** the whole row is the link. Status chips carry text ("Mastered", "Check due", "New", "2/3 skills"), never only a colour (`src/app/app/missions/page.tsx:27`).
- **States:** empty (see 2.6), filtered to nothing (Words browse: "Not in the course yet" plus "Clear filters", `src/app/app/words/page.tsx:270-290`), "Show 20 more" / "Show all N" paging (`src/app/app/words/page.tsx:298-307`).

#### Detail / landing page (before a session)

- **When to use:** one lesson, mission, grammar concept or scene, before the learner commits to a session.
- **Structure:**
  1. Back link: `btn-ghost btn-sm -ml-3` with ArrowLeft and the parent's name ("Missions", "Grammar", "Lessons", "Scenes") (`src/components/mission/MissionScreen.tsx:50-52`, `src/components/GrammarLesson.tsx:71-73`).
  2. Eyebrow meta (`world · level`, or a CEFR chip and "Lesson 4 · 8 words").
  3. h1 title with the Persian title after it in `text-muted`.
  4. One-line description or scene setting.
  5. Content: "After this mission you can" list with skill state chips (`src/components/mission/MissionScreen.tsx:69-86`), word cards, grammar table, key points and examples.
  6. Duration and contents line with a Clock icon ("About 10 minutes · listening, phrases, grammar, role-play, final check", `src/components/mission/MissionScreen.tsx:84`).
  7. Actions: one `btn-primary btn-lg`, then a `btn-secondary` alternative ("Already know this? Prove it", "Skip to quiz", "Go through the whole mission").
- **Rules:** the primary label changes with state, not the layout: "Start mission" / "Practise what's left (2 skills)" / "Quick check (1 skill)" / "Mastered — nothing to do here until a check is due." plus "Replay the mission (no XP)" (`src/components/mission/MissionScreen.tsx:88-121`). On a long page the actions sit in a sticky `glass` bar above the tab bar (`src/components/LessonSession.tsx:86-95`).

#### Full-screen session

- **When to use:** any timed or step-by-step practice: lesson, flashcards, Daily Practice, My cards practice, mission, grammar exercises, reading lesson, SAMFA mini mock, scene, hands-free, speaking, sound workout, placement test.
- **Structure:**
  1. `SessionHeader`: sticky `material-canvas`, `-mx-4 mb-6 px-4 py-3`; X button (`btn-ghost btn-icon`, `aria-label="Quit session"`, link to `exitHref` or `onExit` callback); `ProgressBar` filling the row; optional right slot (counter "3/10", step label, a toggle) (`src/components/ui.tsx:211-230`). It mounts `FocusMode`, so the tab bar, top bar and sidebar disappear.
  2. Optional toolbar row under the header: `-mt-3 mb-5 flex justify-center` holding `CardControls` (direction and script) (`src/components/ChoiceRound.tsx:109`).
  3. Round label: `eyebrow text-firuze-ink` ("Round 2 · Recall", "Mastery check · 2/4").
  4. Prompt: h1/h2 `text-2xl font-extrabold` ("How do you say this?", "Say this out loud", "Write this in English").
  5. Stimulus card: `card` centred, `FaWord size="xl"`, "sounds like “…”", `AudioButtons big` (`src/components/RecallRound.tsx:133-148`).
  6. Answer area (see 2.3).
  7. `FeedbackSheet`, fixed to the bottom, with a `h-40` spacer so content scrolls clear (`src/components/ui.tsx:239-292`).
  8. A result screen when the queue is empty (see 2.4).
- **Progress rule:** the bar moves as soon as an item is answered right, not on Continue (`src/components/RecallRound.tsx:104-105`). Multi-round sessions split the bar: lesson study, round 1 and round 2 each fill a third (`src/components/LessonSession.tsx:24-25`, `progressSpan`).

| Session | Header | Bottom bar | Source |
|---|---|---|---|
| Lesson (study, choice, recall) | `SessionHeader` + counter | `FeedbackSheet` | `src/components/LessonSession.tsx` |
| Flashcards | `SessionHeader` with `onExit` | own `material` bar: "Show answer", then three rating buttons | `src/components/FlashcardSession.tsx:145-303` |
| Daily Practice, My cards | `RoundHeader` (copy of SessionHeader with a button X) | `FeedbackSheet` | `src/components/RecallRound.tsx:251-265` |
| Mission | `SessionHeader`, right slot = step label | `FeedbackSheet` / `ContinueBar` | `src/components/mission/MissionSession.tsx:51-55` |
| Grammar exercises | `SessionHeader` + counter | `FeedbackSheet` | `src/components/GrammarLesson.tsx:232-335` |
| Reading lesson | `SessionHeader` + "3/8" | own `material` bar: Back / Next / Finish | `src/components/reading/ReadingLessonView.tsx:61-92` |
| Scene | `SessionHeader`, right slot = Show/Hide English | own `material` bar: speaking status, Pause, mic, Again/Continue | `src/components/scene/ScenePlayer.tsx:184-324` |
| Hands-free | `SessionHeader` with `onExit` | `sticky bottom-0 bg-card` transport controls | `src/components/HandsFree.tsx:268-315` |
| Speaking, sound workout | `SessionHeader` | `FeedbackSheet` (idle holds Skip) | `src/components/SpeakRound.tsx:145-232` |
| Placement test | `SessionHeader`, right = CEFR level | own `material` bar with "Next" | `src/app/app/placement/page.tsx:127-158` |
| SAMFA mini mock | `SessionHeader` with `onExit` | in-flow buttons | `src/app/app/samfa/page.tsx:49-57` |
| SAMFA single part | back link only, no focus mode | in-flow buttons | `src/app/app/samfa/page.tsx:113-125` |

### 2.3 Answering patterns

#### Multiple choice with keyboard shortcuts

- **When:** recognition (lesson round 1), grammar "Pick the right answer", mission listening questions, reading and SAMFA questions, placement.
- **Structure:** prompt, stimulus, then a `grid gap-3 sm:grid-cols-2` of `tile` buttons `min-h-16`. Each option has a number badge `size-8 rounded-lg border` showing 1–4 (`src/components/ChoiceRound.tsx:124-172`).
- **Rules:**
  - Select, then Check. Selecting sets `data-state="selected"` (sky) and `aria-pressed`. Check is disabled until something is selected (`src/components/ChoiceRound.tsx:181`).
  - Keys: `1`–`4` or `a`–`d` pick, Enter checks and then continues; ignored while typing in a field or with a modifier key (`src/components/ChoiceRound.tsx:63-84`). Grammar accepts `1`–`9` (`src/components/GrammarLesson.tsx:200-221`). The idle sheet shows the hint "Press 1–4 to pick, Enter to check" on `sm` and up (`src/components/ChoiceRound.tsx:180`).
  - After Check, tiles are disabled; the answer gets `data-state="correct"` and a Check icon; a wrong pick gets `data-state="wrong"`, an X icon and `animate-shake`; the rest fade to `opacity-50`.
  - Mission listening questions and reading checks answer on tap, without a Check step (`src/components/mission/InfoSteps.tsx:91-107`, `src/components/samfa/Practice.tsx:46-53` uses a final "Check answers").
  - Placement adds an "I don't know" option in `text-muted` and gives no per-item feedback (`src/app/app/placement/page.tsx:138-149`).

#### Typed recall with "almost"

- **When:** lesson round 2, Daily Practice, My cards practice, grammar fill-in and translate.
- **Structure:** eyebrow round label, h2 "Write this in Farsi" / "Write this in English", helper "Persian script or Latin letters both work.", stimulus card, then a form: `input` plus (EN → FA only) a keyboard toggle `btn-icon !size-14`, optional on-screen `PersianKeyboard` (`src/components/RecallRound.tsx:129-192`).
- **Rules:**
  - Answers are normalised (case, punctuation, ZWNJ, diacritics, Arabic ك/ي) and compared by edit distance; answers of 1–2 letters must be exact (`src/lib/answer.ts:1-80`).
  - Verdicts: correct (pista border), almost (saffron border in recall; pista in grammar and missions), wrong (anar border plus shake). The input becomes `readOnly` until Continue.
  - Almost counts as right ("hard" outcome) and shows "Accepted spelling: …". Wrong shows "Answer: …" plus "We'll come back to this one." and re-queues the word at the end; when it returns, a chip says "Let's try this one again" (`src/components/RecallRound.tsx:134-138`, `196-212`).
  - After an answer, a context card shows the example sentence, note, audio, bookmark, hide and report actions (`src/components/RecallRound.tsx:225-245`).
  - Enter submits, then continues. Placeholder: "e.g. salâm or سلام" (EN → FA) or "Your answer".

#### Free answer (Finglish or script, or by voice)

- **When:** mission build-sentence, role-play and mastery check tasks.
- **Structure:** `AnswerInput`: `input min-h-14 !text-lg dir="auto"`, placeholder "Type in Finglish or فارسی…", and a `btn-sky btn-icon !size-14` mic when a speech engine exists; a `role="status"` line below for "Listening… say your answer in Persian." or errors (`src/components/mission/AnswerInput.tsx:70-114`).
- **Rules:** speech returns several transcripts and all go to the checker (`src/components/mission/TaskStep.tsx:59-64`). Guided stages offer a "Hint" ghost button and "Hear a model answer" (which counts as help); a missed task comes back once at the end with "· one more try". Unguided mastery checks give no hints and no retries; a ShieldCheck icon marks them (`src/components/mission/TaskStep.tsx:14-19`, `86-129`, `148-161`). The sheet always shows a model answer in Persian, transliteration and English, plus "Missing: …" when relevant.

#### Speaking

- **When:** Speak, sound workout, sound path stages, Say it dialog, scenes, reading "Your turn", SAMFA speaking, hands-free scoring.
- **Structure (SpeakRound):** h1 "Say this out loud", word with English, "sounds like", `AudioButtons big`, optional focus-sound tile with "How to say it", then a round mic button `btn-icon !size-24 !rounded-full` and a `role="status"` line (`src/components/SpeakRound.tsx:146-206`).
- **Mic states:**

| State | Button | Status text | Source |
|---|---|---|---|
| idle | `btn-primary`, Mic icon, `aria-label="Start speaking"` | "Tap the mic, then say the word" | `src/components/SpeakRound.tsx:175-198` |
| preparing (Whisper download) | disabled, `Loader2 animate-spin` | "Downloading speech model… 42%" plus a sky `ProgressBar` | `src/components/SpeakRound.tsx:186-200` |
| listening | `btn-danger`, Square icon, `animate-ping` halo `bg-anar/30`, `aria-label="Stop recording"` | "Listening…" or "Listening… tap to stop" (Whisper) | `src/components/SpeakRound.tsx:173-191` |
| checking | disabled spinner | "Checking…" | `src/components/SpeakRound.tsx:192-193` |
| done | enabled while retries remain | "Tap the mic to try again (2 left)" | `src/components/SpeakRound.tsx:194-197` |

- **Retries:** up to three tries per word; the first try sets the outcome (`src/components/SpeakRound.tsx:25-28`, `139`). Scenes keep the best take and allow "Again" up to three tries (`src/components/scene/ScenePlayer.tsx:121-126`, `270`).
- **Coloured feedback:** `PronunciationFeedback` shows a score ring (pista ≥ 90, saffron ≥ 60, anar below), the word with each letter coloured by how clearly it was heard, a tile per sound with its score, a legend "● clear ● unclear ● off or missing", Model / My voice / Back to back playback, and a tip card with a mouth diagram for the weakest sound (`src/components/PronunciationFeedback.tsx:21-189`). Each coloured letter group has an `aria-label` like "kh clear, a unclear".
- **Sheet titles:** "Spot on!", "Almost — sounds close.", "Not quite yet." with "We heard … · 72%" (`src/components/SpeakRound.tsx:215-226`).

#### Self-rating (flashcards)

- **When:** flashcard decks (Today, My cards, by lesson).
- **Structure:** card front with a prompt eyebrow ("What does it mean?" / "How do you say…"), the word, then "Think of the answer, then flip the card." A `material` bottom bar holds "Show answer"; after the flip it holds three rating buttons in a `grid-cols-3` (`src/components/FlashcardSession.tsx:160-303`).
- **Ratings:** "Didn't know" (`btn-danger`, key 1, "See it again soon"), "Almost" (`btn-sky`, key 2, "Knew it, with effort"), "Knew it" (`btn-success`, key 3, "Got it right away") (`src/components/FlashcardSession.tsx:34-62`). Space or Enter flips. "Didn't know" brings the card back a few cards later in the same session; the eyebrow then adds "· again".

#### Self-check rubric

- **When:** SAMFA writing and speaking, where the app cannot grade.
- **Structure:** model answer block (`rounded-2xl bg-paper`), then "Mark yourself honestly against the model", four rows with 0–3 `tile` radio buttons (`role="radiogroup"`), a legend "0 = not yet · 1 = partly · 2 = mostly · 3 = fully. This is an estimate, not an official score." and a full-width "Save · about 40/60" button, disabled until every row is marked (`src/components/samfa/Practice.tsx:168-187`, `329-336`; rubric rows `src/content/samfa.ts:257-262`).

### 2.4 Feedback and results

#### Correct / wrong sheet (`FeedbackSheet`)

| State | Look | Content | Source |
|---|---|---|---|
| idle | `material border-t border-line` bar, fixed bottom | the main action (Check, Reveal, Continue) and an optional hint or Skip | `src/components/ui.tsx:265`, `285-287` |
| correct / almost | sheet `rounded-t-[1.75rem]`, `animate-slide-up` (420ms `--ease-sheet`), shadow `0_-12px_40px`, background `color-mix(pista 14%, card)` | CheckCircle2 in a `size-11` card circle, title `text-xl font-extrabold`, detail `text-sm font-semibold`, `btn-success btn-lg` Continue | `src/components/ui.tsx:255-283` |
| wrong | same, tinted anar | XCircle, title, answer in detail, `btn-danger btn-lg` Continue (label "Got it" in recall) | same |

Rules: the answered sheet has `role="status"` and autofocuses Continue, so Enter moves on (`src/components/ui.tsx:262`, `281`). "Almost" uses the success look. Titles in use: "Nicely done!", "Correct!", "Almost — watch the spelling", "Not quite", "Correct answer:", "Nicely said!", "Spot on!" (see 11 · Content design for wording rules).

#### Result screen

- **When:** the end of any session.
- **Structure:** centred column `max-w-xl`; a `size-24 rounded-full` medallion with `animate-pop` (saffron fill and PartyPopper for success; Trophy for My cards; plum-soft RotateCcw for "not yet"); h1 `text-3xl sm:text-4xl font-extrabold text-saffron-ink` ("Lesson complete!"); a muted summary line ("12/16 answers right"); a grid of `StatCard`s; a muted reassurance line about spaced repetition; the next step ("Up next: 🍎 Food & Drink"); then actions, `flex-col` on phones and `sm:flex-row-reverse` so the primary sits on the right (`src/components/LessonSession.tsx:259-320`).
- **StatCard:** `card animate-pop px-3 py-3.5 text-center`, label `text-xs font-semibold text-muted`, value `text-2xl font-bold` in the tone's `-ink` with an optional icon (`src/components/ui.tsx:295-305`). The usual set: "Total XP" (saffron, Zap), "Accuracy" (pista, Target), "Good" (sky, ThumbsUp), "Again" (anar, RotateCcw).
- **XP:** shown as a StatCard value or a chip `+12 XP` in `bg-saffron-soft text-saffron-ink` (`src/components/FlashcardSession.tsx:350-356`); SAMFA shows `+{xp} XP` as text (`src/app/app/samfa/page.tsx:101`).
- **Actions:** primary = the natural next step ("Continue" to the next lesson, "Done for today", "Back to my cards"); secondary = repeat ("Review", "Keep practising", "Speak again", "Choose another deck").
- **Score-only results:** placement ("Your level" + `text-6xl` CEFR code, `src/app/app/placement/page.tsx:97-121`) and SAMFA ("Mini mock estimate", `/240`, per-part bars, `src/app/app/samfa/page.tsx:62-90`).

#### Mastery result (missions, grammar, sound path)

| Outcome | Medallion | Title | Body | Primary action | Source |
|---|---|---|---|---|---|
| Mastered | saffron fill, PartyPopper | "Mission mastered!" | "You did it without help. Here's what you can do now:" + skill list + "It'll come back for a quick check in about N days — no daily repeats." | "Next mission" | `src/components/mission/MissionSession.tsx:79-153` |
| Needs practice | sky-soft, Target | "Nearly there" | "Most of it is there. Just a little practice on what's left:" + failed skills with "Try: …" | "Practise this skill" / "Practise these 2 skills" | same |
| Retry | plum-soft, RotateCcw | "Not yet — and that's fine" | "Going through the mission once will make the check much easier." | "Go through the mission" | same |
| Grammar pass / fail (80%) | saffron-soft / plum-soft | "Concept learned!" / "Keep practising" | "You need 80% to pass — you're close." | "Back to grammar" / "Review & try again" | `src/components/GrammarLesson.tsx:31-66` |
| Sound path test-out | stars `size-12` | "Tested out!" / "Not yet" | | next stage | `src/app/app/sounds/page.tsx:84-108` |

Rules: never red for a not-yet outcome (plum or sky instead), always a concrete next step, and a secondary "Done for now".

### 2.5 Guidance

| Pattern | When | Structure and rules | Source |
|---|---|---|---|
| Onboarding tiles | First visit to Home | `card p-5 sm:p-6`; "Question 1 of 2"; h2 question; "Skip" ghost top right; step 1: four goal tiles (emoji, label, hint) that advance on tap; step 2: an example line in Persian and three reading-level tiles that finish on tap; "Back" ghost. Answers set the script default (reads "yes" → Persian first, "no" → Latin first). | `src/components/TodayPlan.tsx:23-94` |
| Today plan with one Continue | Home after onboarding | h2 "Today" + "1 of 3 done"; at most three steps (review, learn one new thing, use it); rows show a 44px circle (emoji, or pista Check when done), title (struck through when done), muted detail; the current row is `border-firuze bg-firuze-soft` with `aria-current="step"`; one `btn-primary btn-lg` "Start" / "Continue". End states: pista-soft "That's enough for today. See you tomorrow!" or saffron-soft "You've finished everything here so far". | `src/components/TodayPlan.tsx:96-164`, `src/lib/today.ts` |
| Next up card | Path, Sounds | Tinted section in the section's tone; eyebrow "Next up · Section 2 · …"; badge, h2 title, kind · subtitle; full-width `btn-primary btn-lg` "Start" / "Continue". Done state: plain card "You've walked the whole path". | `src/app/app/path/page.tsx:47-72`, `src/components/SoundPath.tsx:21-58` |
| Getting-started checklist | Home until hidden | `card p-5`; h2 "Getting started" + "2/5"; X "Hide checklist"; `ProgressBar`; five link rows with a 28px circle (saffron + Check when done), done rows `text-muted line-through` plus sr-only "(done)". Can be shown again from Profile. | `src/app/app/page.tsx:48-91`, `src/app/app/settings/page.tsx:150-158` |
| Placement prompt | Home, until a placement exists or XP > 300 | One `tile` row: "Already know some Persian?" + "Take the placement test (3–6 minutes) and start at your level." + chevron. | `src/components/home/HomeSections.tsx:323-336` |
| Backup nudge | Home, streak ≥ 3, at most once every 30 days | `card` row: 🔥, "**3 days in a row!** Your progress lives only in this browser…", `btn-secondary btn-sm` "Save backup", X "Not now". Either action dismisses it. | `src/components/TodayPlan.tsx:166-200` |
| Inline hint | Guided tasks, grammar exercises | `btn-ghost btn-sm` with Lightbulb ("Hint", "Need a hint?"); opens a `bg-saffron-soft` note. | `src/components/mission/TaskStep.tsx:117-129`, `src/components/GrammarLesson.tsx:305-317` |
| Info note | Profile, mission grammar | `rounded-2xl bg-sky-soft` (or saffron-soft) row with an Info icon and a bold lead ("No sign-up needed.", "Culture note.") | `src/app/app/settings/page.tsx:68-74`, `src/components/mission/InfoSteps.tsx:200-207` |

### 2.6 Progress display

| Pattern | Structure and values | Source |
|---|---|---|
| Path sections and items | Accordion of `card` sections: numbered circle `size-12` on the section tone, "Section N · A1", title + Persian, "3 of 8 done", chevron rotating 180° over 300ms; `aria-expanded`. Expanded: timeline of `tile` links with a 24px node (filled + Check when done, tone border when next), a connector line, badge, kind label or "Up next", title, subtitle, and a small `ProgressBar` for partial items. Only the section holding "Next up" opens by default. | `src/app/app/path/page.tsx:84-145` |
| Lesson trail | Zig-zag of 72px nodes (offsets 0, 44, 66, 44, 0, −44, −66, −44 px): saffron + Check (done), firuze + emoji + "Start"/"Continue" bubble (current), `bg-line` + Lock (not started, still openable). | `src/app/app/lessons/page.tsx:9-92` |
| Week strip | `card`; h2 Flame + "N day streak"; "12 XP today"; seven circles (anar fill + Flame = goal met, anar-soft = practised, paper = none, sky ring = today) with `title` and sr-only text; small anar `ProgressBar` "4/10 words"; a line "Reach your daily goal to keep the flame." | `src/components/home/HomeSections.tsx:21-69` |
| Daily quests | `card`; three rows: title, "+10 XP", sky (pista when done) `ProgressBar sm`, "3/10"; done → `btn-success btn-sm` "Collect" → pista check with `aria-label="Collected"`. | `src/components/home/HomeSections.tsx:71-116`, `src/lib/quests.ts` |
| Streak and XP chips | Top bar: Flame (anar fill when > 0, faint when 0) + number; Star + XP; `aria-label="3 day streak"`, `"120 XP"`. | `src/components/AppNav.tsx:70-83` |
| Stat tiles | Progress: four `card p-4` tiles, icon + `text-2xl` value + muted label ("day streak", "best streak", "total XP", "days practised"). | `src/app/app/progress/page.tsx:20-46` |
| Level card | "Level 3", level name + Persian, saffron `ProgressBar`, "**150 XP** to Pencil" or "Top level reached". | `src/components/Achievements.tsx:9-32` |
| Calendar | Month table with prev/next `btn-icon` (next disabled on the current month); days as circles (anar = goal met, anar-soft = practised), sky ring for today, sr-only ", goal met"; legend below. | `src/app/app/progress/page.tsx:48-123` |
| XP chart | Segmented "7 days" / "8 weeks"; bars `bg-saffron/60`, current bar solid; hover tooltip; the visual is `aria-hidden` and an sr-only table carries the data. | `src/app/app/progress/page.tsx:125-199` |
| Sound trends | Row per sound: letter tile, name, TrendingUp/Down delta, sparkline (dashed line at 85), current score. Fewer than two days: "More days needed". | `src/app/app/progress/page.tsx:201-255` |
| Badges | Grid of `tile`s; earned: saffron-soft emoji + "Earned"; not earned: greyscale, description, small saffron bar, "3/7"; first four shown, "Show all 14 badges". | `src/components/Achievements.tsx:34-89` |

### 2.7 System states

| State | Pattern in use | Examples |
|---|---|---|
| Empty | Centred `card p-8`: 80px tinted icon circle, h2 `text-2xl` ("No cards saved yet", "Nothing to practise yet"), muted how-to sentence, one CTA ("Go to flashcards", "Go to lessons"). Lighter variant inside a section: a muted sentence only ("Say a few words out loud and the sounds you find hardest will show up here."). | `src/app/app/bookmarks/page.tsx:94-116`; `src/app/app/practice/page.tsx:48-58`; `src/components/home/HomeSections.tsx:167-169`; `src/app/app/progress/page.tsx:231-233`; `src/components/HandsFree.tsx:253-262` |
| Nothing due | Disabled primary with the reason as its label: "Done for today"; muted "All caught up. Nothing is due — come back tomorrow, or pick a deck below." | `src/app/app/words/page.tsx:100-109` |
| Hydrating | Progress lives in `localStorage`, so pages wait for `useHydrated()`. Home fades in with `transition-opacity` from `opacity-0`; most other pages and sessions `return null` until hydrated (20 files use the hook). | `src/app/app/page.tsx:16-18`; `src/app/app/path/page.tsx:38`; `src/components/mission/MissionScreen.tsx:27` |
| Loading | `Loader2 animate-spin` + a present-tense line ending in "…" inside `role="status"`: "Finding videos…", "Opening the poem…", "Downloading voice… 42%", "Sending…". Long downloads add a sky `ProgressBar sm`. `aria-busy` on the dictionary panel. | `src/components/YouglishPlayer.tsx` (status block), `src/components/Poetry.tsx:85-91`, `src/components/SpeechSetup.tsx:52-58`, `src/components/DictionaryPanel.tsx:62-66` |
| Offline / network | Muted or anar text that names the cause and the fix: "Couldn't load the poem. Check your connection and try again.", "Videos couldn't load", "Couldn't reach the server. Check your connection and try again." Audio buttons disable and explain in `title`; a failed play shows "Audio unavailable". | `src/components/Poetry.tsx:93-96`; `src/components/SyncCard.tsx:15-18`; `src/components/ui.tsx:92`, `111` |
| Permission: microphone | Error line under the mic: "Microphone access is blocked. Allow it in your browser's site settings." In free-answer tasks: "Microphone is blocked — you can type instead." No engine at all: a muted card "This browser can't listen to speech. Try Chrome, Edge or Safari…" and the Start button disabled. | `src/components/SpeakRound.tsx:16-23`, `208-212`; `src/components/mission/AnswerInput.tsx:61-63`; `src/app/app/speak/page.tsx:95-106` |
| Permission: notifications | The "Notify me in this browser" button is hidden when denied or unsupported; a muted line says "Notifications are blocked for this site in your browser settings. The calendar reminder still works." | `src/components/ProgressTools.tsx:90-101` |
| Feature off (no backend) | `hasBackend` false: Sync and Feedback cards render nothing, the AI tutor link is dropped from nav and Practice studio, the tutor page shows "Coming soon", and Report opens a pre-filled GitHub issue instead. | `src/components/SyncCard.tsx:36`; `src/components/FeedbackCard.tsx:15`; `src/components/AppNav.tsx:32`; `src/app/app/tutor/page.tsx:105-114`; `src/components/ReportButton.tsx:79-81` |
| Destructive confirmation | Reset: an anar eyebrow "Reset progress", a sentence listing what is removed and what is kept, `btn-secondary` "Reset progress…" that swaps in place to `btn-danger` "Yes, reset everything" + "Cancel". Restore backup, join sync and stop sync use `window.confirm`. | `src/app/app/settings/page.tsx:190-214`; `src/components/ProgressTools.tsx:38`; `src/components/SyncCard.tsx:66-71`, `133-137` |
| Inline success / error message | `role="status"` paragraph under the control, `text-pista-ink` with CheckCircle2 for success, `text-anar-ink` for errors ("Progress restored.", "That file isn't a Farsi Pen backup."). | `src/components/ProgressTools.tsx:70-74` |

### 2.8 Dialogs, sheets and popovers

| Kind | Build | Rules | Source |
|---|---|---|---|
| Modal dialog | Native `<dialog>` opened with `showModal()`, rendered in a portal to `body`; classes `card m-auto !rounded-[1.75rem] max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] animate-pop overflow-y-auto p-0 backdrop:bg-black/40`; global `dialog::backdrop` blur 4px | Eyebrow title top left in the feature's tone ("Say it", "Persian sound", "Hear it in real videos"); X `btn-ghost btn-icon` `aria-label="Close"` top right; click on the backdrop and Escape close it; `aria-label` on the dialog. Wider variant `min(48rem,…)` for video. | `src/components/SayItButton.tsx:96-177`; `src/app/app/sounds/page.tsx:273-324`; `src/components/YouglishPlayer.tsx:114-151`; `src/app/globals.css:606-609` |
| Bottom sheet | `FeedbackSheet` answered state: fixed bottom, `rounded-t-[1.75rem]`, `animate-slide-up` | Only for answer feedback; it is not dismissible except through Continue. | `src/components/ui.tsx:239-292` |
| Popover | `ReportButton`: `card absolute bottom-full mb-2 w-72 animate-pop shadow-lg`, anchored to its trigger, `align` left/right | Toggle with `aria-expanded`; textarea + one primary "Send report"; on success shows "Thanks — report sent" and closes after 1400ms. | `src/components/ReportButton.tsx:84-149` |
| Disclosure | `<details>` with a bold `summary` ("Study tips", "A plan to follow", "Show what was said") | For optional help that should not compete with the task. | `src/components/LessonSession.tsx:78-85`; `src/components/samfa/Practice.tsx:106-118` |
| System confirm | `window.confirm` / `alert` | Used for replace-progress confirmations and one mic error. | see 2.7 |

## 3. Usage: do and don't

| Do | Don't |
|---|---|
| Put one `btn-primary btn-lg` at the end of a root page's hero card ("Continue"). | Add a second filled large button beside it. Exams currently pairs `btn-primary` "Start the test" with `btn-plum` "Open SAMFA" (`src/app/app/exams/page.tsx:31`, `54`). |
| Start every session with `SessionHeader`, so focus mode and the X come for free. | Hand-roll a header; `RoundHeader` already duplicates it to get a button X (`src/components/RecallRound.tsx:251-265`). Add `onExit` to `SessionHeader` instead (it exists, `src/components/ui.tsx:211`). |
| End answered items in `FeedbackSheet` with a title, the right answer and Continue. | Show only a red cross. Recall says "Not quite", then "Answer: …" and "We'll come back to this one." |
| Count typos as "almost" and accept them. | Reject "salam" for "salâm"; `normalize` strips accents on purpose (`src/lib/answer.ts`). |
| Re-queue a missed item at the end of the session. | End the session early or subtract XP for misses. |
| Give empty states an icon, a one-line reason, a how-to and one CTA. | Leave an empty grid or a bare "No data". |
| Disable a primary button and say why in its label ("Done for today") or next to it. | Hide the button so the learner wonders where it went. |
| Explain a missing capability and offer the nearest alternative ("you can type instead"). | Throw a generic error with no next step. |
| Confirm destructive actions in place with an anar `btn-danger` and a plain Cancel. | Use `alert()` for errors (`src/app/app/review/page.tsx:90`). |
| Use `<dialog>` + `showModal()` + portal for modals, X top right, backdrop closes. | Build a modal from absolutely positioned divs without focus handling. |
| Keep result screens in focus mode (`SessionHeader progress={1}` or `<FocusMode />`). | Let the tab bar reappear on some result screens and not others (see Gaps). |
| Show progress with a number next to every bar ("4/10 words", "3 of 8 done"). | Rely on bar length or colour alone. |

## 4. Accessibility notes

- **Focus and keyboard.** Every session must be completable with the keyboard: choice keys 1–4 / a–d, Enter to check and continue, Space or Enter to flip a flashcard, 1–3 to rate (`src/components/ChoiceRound.tsx:63-84`, `src/components/FlashcardSession.tsx:111-129`). Key handlers must ignore inputs, textareas, dialogs and modifier keys. Continue autofocuses after an answer. The focus ring is a 3px sky outline shown only for keyboard input (`src/app/globals.css:145-155`).
- **Announcements.** Answer sheets use `role="status"` (`src/components/ui.tsx:262`); mic status lines, loading lines, inline save/error messages and the tutor error (`role="alert"`) are live regions. New patterns must announce their result the same way.
- **State without colour.** Option tiles add Check/X icons with `aria-label="Correct"`/`"Wrong"`; done steps add a Check, strike-through and sr-only "(done)" / "Done" / "Next"; calendars and the week strip carry sr-only day states; the XP chart has an sr-only table; coloured letters carry an `aria-label` per sound.
- **Names.** Icon buttons need `aria-label`, and toggles need `aria-pressed` (bookmark, keyboard, Show English) or `aria-expanded` (accordion, report popover, "Show all").
- **Targets.** Tabs, rows and option tiles meet 44px (`min-h-11`, `min-h-16`, `btn-icon` 2.75rem). `btn-sm` is 2.25rem (36px) high (`src/app/globals.css:355-356`) and is used for real actions ("Collect", "Save backup", "Hint"); see Gaps.
- **Motion.** All patterns rely on `animate-pop`, `animate-slide-up` and `animate-shake`, which collapse under `prefers-reduced-motion` (`src/app/globals.css:166-173`). The mic `animate-ping` halo and `animate-pulse` on playing audio are the only repeating animations; both stop when the state ends.
- **Dialogs.** Native `<dialog>` gives focus containment and Escape. The Report popover does not; it must not hold content that needs to be reached by Tab after it opens without closing first.

## 5. Code reference

| Area | Files |
|---|---|
| Frame and navigation | `src/app/app/layout.tsx`, `src/components/AppNav.tsx` |
| Primitives used by every pattern | `src/components/ui.tsx` (`PageHeader`, `SessionHeader`, `FocusMode`, `FeedbackSheet`, `StatCard`, `ProgressBar`, `Segmented`, `AudioButtons`, `FaWord`, `RegisterTag`, `BookmarkButton`, `Bubble`) |
| Utilities | `src/app/globals.css`: `tile` (+ `data-state`), `card`, `material`, `material-canvas`, `glass`, `chip`, `eyebrow`, `input`, `select`, `btn-*`, `animate-pop`, `animate-slide-up`, `animate-shake`, `dialog::backdrop`, `body[data-focus] .app-nav` |
| Answering | `ChoiceRound.tsx`, `RecallRound.tsx`, `PersianKeyboard.tsx`, `mission/AnswerInput.tsx`, `mission/TaskStep.tsx`, `SpeakRound.tsx`, `PronunciationFeedback.tsx`, `FlashcardSession.tsx`, `samfa/Practice.tsx`, `GrammarLesson.tsx`; checkers in `src/lib/answer.ts`, `src/lib/mission-check.ts`, `src/lib/pronounce.ts` |
| Sessions | `LessonSession.tsx`, `mission/MissionSession.tsx`, `reading/ReadingLessonView.tsx`, `scene/ScenePlayer.tsx`, `HandsFree.tsx`, `src/app/app/placement/page.tsx`, `src/app/app/samfa/page.tsx` |
| Guidance | `TodayPlan.tsx` (`Onboarding`, `TodayPlan`, `BackupNudge`), `home/HomeSections.tsx`, `src/app/app/page.tsx` (`Checklist`), `SoundPath.tsx` (`NextUpCard`), `src/lib/today.ts` |
| Progress | `src/app/app/path/page.tsx`, `src/app/app/lessons/page.tsx`, `src/app/app/progress/page.tsx`, `Achievements.tsx`, `src/lib/progress.ts`, `src/lib/quests.ts`, `src/lib/gamification.ts` |
| System states | `SpeechSetup.tsx`, `ProgressTools.tsx`, `SyncCard.tsx`, `FeedbackCard.tsx`, `ReportButton.tsx`, `DictionaryPanel.tsx`, `YouglishPlayer.tsx`, `Poetry.tsx`, `src/lib/backend.ts`, `src/lib/store.ts` (`useHydrated`) |
| Dialogs | `SayItButton.tsx` (`SayItDialog`), `YouglishPlayer.tsx` (`YouglishDialog`), `src/app/app/sounds/page.tsx` (`SoundDialog`), `ReportButton.tsx` |

## 6. Gaps and recommendations

**P0**

1. **Inconsistent focus mode on result screens.** Lesson, flashcard, mission and grammar results stay in focus mode; Daily Practice, My cards, Speak, sound workout, hands-free, reading, placement and SAMFA results bring the tab bar back (`src/app/app/practice/page.tsx:81-105`, `src/app/app/speak/page.tsx:47-69`, `src/components/reading/ReadingLessonView.tsx:32-52`). *(proposed)* Make "result is part of the session" the rule: add `<FocusMode />` to every result view, or add a `ResultScreen` primitive that includes it.
2. **Three bottom-bar builds for one job.** `FeedbackSheet`, hand-built `material fixed` bars (flashcards, placement, reading, scene) and an opaque `sticky bottom-0 bg-card` bar (hands-free, `src/components/HandsFree.tsx:305`) differ in spacer height (`h-32`, `h-40`, `h-48`), padding and translucency. *(proposed)* Add a `SessionFooter` primitive (the idle half of `FeedbackSheet`) and use it everywhere; hands-free should use `material`.
3. **Sticky CTA on grammar breaks two rules.** `bg-linear-to-t from-card` is a decorative gradient and `bottom-[calc(4rem+…)]` is below the 5.25rem tab-bar clearance, so the tab bar can cover it on phones (`src/components/GrammarLesson.tsx:134`). *(proposed)* Use the lesson preview's `glass` bar at `bottom-[calc(5.25rem+env(safe-area-inset-bottom))]`.

**P1**

4. **Skill vs code: sheets have no grabber.** The skill says bottom sheets "show a grabber"; no component renders one (no match for "grabber" in `src`). Either add one to sheets that can be dragged, or change the skill to say answer sheets have none.
5. **Lesson trail still carries the old look.** The current lesson bubble keeps the `animate-bob` class (now a static centring utility, `src/app/globals.css:600-604`), nodes press with `group-active:translate-y-1.5 group-active:shadow-none` instead of the 0.97/0.98 scale (`src/app/app/lessons/page.tsx:72`), and not-started lessons show a Lock although they open (`src/app/app/lessons/page.tsx:82`, `95`). *(proposed)* Rename the utility, use `active:scale-[0.97]`, and replace Lock with a neutral circle.
6. **No exit confirmation in long sessions.** The X leaves at once; a SAMFA mini mock or a timed writing task loses all work (`src/app/app/samfa/page.tsx:49`). *(proposed)* Confirm in place ("Leave the mock? Your answers so far won't be saved.") only for sessions over ~5 minutes or with typed text.
7. **SAMFA single-part practice is not a session.** It has a back link, no `SessionHeader` and no focus mode, while the same tasks inside the mock do (`src/app/app/samfa/page.tsx:113-125`). *(proposed)* Use `SessionHeader` with `onExit` for both.
8. **Confirmations mix in-place and browser dialogs.** Reset is in place; restore backup, join sync and stop sync use `window.confirm`; the content review page uses `alert` (`src/app/app/review/page.tsx:90`). *(proposed)* Use the in-place pattern (or a `<dialog>`) everywhere.
9. **Hydration is handled two ways.** Home fades in; 19 other files render nothing until hydrated, which shows a blank page. *(proposed)* Use the opacity fade (or a skeleton) everywhere so layout does not jump.
10. **Small targets.** `btn-sm` is 36px high but is used for primary actions in cards (Collect, Save backup, Link this device). *(proposed)* Raise `btn-sm` to `min-height: 2.75rem` on touch devices, or keep `btn-sm` for secondary actions only.

**P2**

11. **Feedback titles vary by feature** (punctuation, "Almost!" vs "Almost —"); see 11 · Content design.
12. **Report popover lacks Escape and outside-click close** (`src/components/ReportButton.tsx:96-148`). *(proposed)* Close on Escape and on outside click, and return focus to the flag button.
13. **Next up cards differ:** Path uses a borderless tinted block (`rounded-[1.25rem]`), Sounds adds a border (`rounded-2xl border`) (`src/app/app/path/page.tsx:48`, `src/components/SoundPath.tsx:37`). *(proposed)* One `NextUpCard` primitive.
14. **Every `ProgressBar` defaults to the accessible name "Progress"** (`src/components/ui.tsx:34`). *(proposed)* Pass a `label` ("Lesson progress", "Daily goal", "Quest: Earn 40 XP").
15. **Option badge sizes differ:** `size-8` in `ChoiceRound`, `size-7` in grammar, `size-6` on the landing mock-up. *(proposed)* One option-tile primitive.
