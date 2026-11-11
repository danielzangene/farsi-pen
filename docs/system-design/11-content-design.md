# 11 · Content design and voice

How Farsi Pen talks: the voice found in the prototype's real copy, the rules that keep it consistent, and how Persian, transliteration and English share a screen.

## 1. Principles

- **Honest.** The app tells the truth about effort, results and limits. It says when the learner is done ("That's enough for today. See you tomorrow!", `src/components/TodayPlan.tsx:159`), when something is an estimate ("This is an estimate, not an official score.", `src/components/samfa/Practice.tsx:184`) and where data lives ("Your progress lives only in this browser.", `src/components/TodayPlan.tsx:180`).
- **Warm, not hyped.** Mistakes are normal and recoverable: "Not yet — and that's fine" (`src/components/mission/MissionSession.tsx:82`), "We'll come back to this one." (`src/components/RecallRound.tsx:207`), "Small typos get a tip, not a red cross." (`src/app/page.tsx:70`). Praise is short and specific, never loud.
- **Brief.** Titles are two to five words. Body copy is one or two short sentences. Feedback fits in a bottom sheet.
- **Useful next.** Every message ends in something the learner can do: a button, a setting to change, a way round the problem ("Microphone is blocked — you can type instead.", `src/components/mission/AnswerInput.tsx:62`).
- **Persian is the subject, English is the frame.** English carries instructions; Persian carries the content and is always shown in its own script, with transliteration as a helper the learner can turn off.

## 2. Specification

### 2.1 Voice and tone

The voice is constant: a patient tutor who knows Persian and respects the learner's time. Tone shifts with the moment.

| Moment | Tone | Real examples | Source |
|---|---|---|---|
| Correct answer | Brief praise, then move on | "Nicely done!", "Correct!", "Spot on!", "Nicely said!" | `src/components/ChoiceRound.tsx:176`, `src/components/RecallRound.tsx:198`, `src/components/SpeakRound.tsx:217`, `src/components/mission/TaskStep.tsx:83` |
| Near miss | Accept it, teach the detail | "Almost — watch the spelling", "Accepted spelling: salâm", "Almost — sounds close." | `src/components/RecallRound.tsx:198-203`, `src/components/SpeakRound.tsx:217` |
| Wrong answer | Calm, give the answer, promise a retry | "Not quite", "Answer: …", "We'll come back to this one.", "Let's try this one again" | `src/components/RecallRound.tsx:136`, `198-207` |
| Not passed yet | Reassure, show the shortest way forward | "Nearly there", "Not yet — and that's fine", "You need 80% to pass — you're close." | `src/components/mission/MissionSession.tsx:80-95`, `src/components/GrammarLesson.tsx:44` |
| Finished | Celebrate once, then release the learner | "Lesson complete!", "Deck done!", "That's enough for this situation. It'll come back for a quick check in about 4 days — no daily repeats." | `src/components/LessonSession.tsx:286`, `src/components/FlashcardSession.tsx:328`, `src/components/mission/MissionSession.tsx:129` |
| Error | Plain cause plus fix | "Couldn't reach the server. Check your connection and try again." | `src/components/SyncCard.tsx:17` |
| Privacy and data | Factual, reassuring | "No sign-up needed. Your progress is saved in this browser.", "Only your message and rating are sent — no name or email." | `src/app/app/settings/page.tsx:71`, `src/components/FeedbackCard.tsx:94` |
| Reminder | Light nudge, no guilt | Notification "Time for Persian" / "Ten minutes today keeps your streak going." | `src/components/ReminderWatcher.tsx:23` |

**Person.** The app speaks as "we" ("We heard …", "we'll score it sound by sound", "we read every message") and addresses the learner as "you". Characters and the tutor are named in the third person ("Sara is speaking…", "The tutor couldn't answer.").

**Spelling.** British English: practise (verb) / practice (noun), recognise, recogniser, labelled, colour. Real copy follows this: "Practise your own sentence", "Practice complete!", "You recognised 6 of 8 words" (`src/components/home/HomeSections.tsx:280`, `src/app/app/practice/page.tsx:88`, `src/components/LessonSession.tsx:137`).

### 2.2 Capitalisation and punctuation

| Rule | Detail | Real example |
|---|---|---|
| Sentence case everywhere | Headings, buttons, labels, tabs, chips, page titles | "Practise what's left", "Sync across devices", "Start the mini mock" |
| Proper nouns keep capitals | Farsi Pen, SAMFA, Whisper, YouGlish, Hafez, CEFR codes (A1, B2), named features used as names: Daily Practice, My cards (only "My" capped) | `src/components/AppNav.tsx:31`, `42` |
| No ALL CAPS | Only the `eyebrow` style uppercases, through CSS, never in the string. Persian is never uppercased or letter-spaced (`[lang="fa"]` resets both). | `src/app/globals.css` `[lang="fa"]` block |
| Exclamation marks | Only for completion and praise ("Lesson complete!", "Spot on!") and the greeting. Never in errors, warnings or instructions. | `src/components/LessonSession.tsx:286` |
| Full stops | Body sentences end with a full stop. Button labels, headings, chips and short status labels do not. | "Download voice", "Voice ready — works offline" |
| Spaced em dash ` — ` | Joins a result to its fix or adds a beat: "Didn't catch that — tap the mic and try again." | `src/components/SpeakRound.tsx:17` |
| Middle dot ` · ` | Separates metadata items in one line: "Lesson 3 · 8 new words", "Section 2 · A1", "We heard … · 72%" | `src/lib/today.ts:77`, `src/app/app/path/page.tsx:95` |
| En dash for ranges | "3–6 minutes", "Press 1–4 to pick", "B1–B2 grammar" | `src/app/app/exams/page.tsx:21`, `src/components/ChoiceRound.tsx:180` |
| Arrow `→` | Directions and paths: "FA → EN", "Settings → Voice & speech", "38% → 61%" | `src/components/CardControls.tsx:16`, `src/components/PronunciationFeedback.tsx:182`, `src/app/app/sounds/page.tsx` (workout result) |
| Ellipsis `…` (one character) | In-progress states ("Listening…", "Checking…", "Sending…"), a prompt left open ("How do you say…", "Did you mean…"), and a button that asks for more before acting ("Reset progress…"). Never three full stops; none exist in the code. | `src/components/SpeakRound.tsx:190-193`, `src/app/app/settings/page.tsx:211` |
| Curly quotes around quoted words | sounds like “salaam”, “Spoken”, “Save backup” | `src/components/RecallRound.tsx:144`, `src/app/app/settings/page.tsx:71` |

### 2.3 Buttons and actions

- **Start with a verb**, keep to one to four words: "Check", "Continue", "Reveal", "Show answer", "Save backup", "Download voice", "Link this device", "Collect".
- **Name the outcome when it is not obvious:** "Practise these 2 skills", "Go through the mission", "Replay the mission (no XP)", "Start · 12 cards", "Save · about 40/60" (`src/components/mission/MissionSession.tsx:136`, `src/components/mission/MissionScreen.tsx:95`, `src/app/app/words/page.tsx:108`, `src/components/samfa/Practice.tsx:333`).
- **Standard verbs by role:**

| Role | Label | Where |
|---|---|---|
| Begin a session | "Start" (first time), "Continue" (resumed or next) | Today plan, Path next up, Sounds |
| Submit an answer | "Check" | Every quiz sheet |
| Move on after feedback | "Continue"; "Got it" after a wrong typed answer; "Finish" on the last item | `src/components/RecallRound.tsx:212`, `src/components/SpeakRound.tsx:226` |
| Leave without doing | "Skip", "Not now", "I know this — skip", "Skip to quiz" | `src/components/mission/InfoSteps.tsx:28`, `src/app/app/placement/page.tsx:92` |
| Leave a result | "Done", "Done for now", "Done for today" | `src/components/mission/MissionSession.tsx:155`, `src/components/FlashcardSession.tsx:359` |
| Repeat | "Review", "Keep practising", "Speak again", "Play again", "Go again", "Read it again" | result screens |
| Cancel a destructive step | "Cancel" | `src/app/app/settings/page.tsx:205` |
| Confirm a destructive step | "Yes, " + the action in plain words: "Yes, reset everything" | `src/app/app/settings/page.tsx:203` |

- **Disabled buttons explain themselves** through the label ("Done for today") or a line next to them ("Answer every question to go on", `src/components/reading/ReadingLessonView.tsx:84`).

### 2.4 How errors are written

Formula: **what happened** (past tense, plain words, "Couldn't …" or "… is blocked") **+ what to do** (imperative). Optional third part: the fallback.

| Real copy | What happened | What to do | Source |
|---|---|---|---|
| "Couldn't download the Whisper model. Check your connection and try again." | Couldn't download | Check connection, retry | `src/components/SpeakRound.tsx:76` |
| "Microphone access is blocked. Allow it in your browser's site settings." | Blocked | Allow in site settings | `src/components/SpeakRound.tsx:18` |
| "The browser's recogniser needs internet. Try again, or switch to Whisper in Settings." | Needs internet | Retry, or switch engine | `src/components/SpeakRound.tsx:19` |
| "That doesn't look like a sync code: it's 26 letters and numbers." | Wrong format | (implied) re-enter; states the format | `src/components/SyncCard.tsx:64` |
| "That file isn't a Farsi Pen backup." | Wrong file | (implied) pick another | `src/components/ProgressTools.tsx:40` |
| "Notifications are blocked for this site in your browser settings. The calendar reminder still works." | Blocked | Fallback offered | `src/components/ProgressTools.tsx:101` |
| "Type it in Persian script (you can switch your keyboard to Persian)." | (implied) wrong script | Instruction + how | `src/components/home/HomeSections.tsx:303` |

Rules:
- Never blame: "Didn't catch that", not "You didn't speak".
- No error codes, no "Error", "Oops", "Sorry" or "Please".
- Errors sit next to the control that failed, in `text-anar-ink`, inside `role="status"` or `role="alert"`. A neutral limitation (no mic support, notifications off) uses `text-muted`, not red.

### 2.5 Encouragement without hype

- Praise the act, not the person: "Nicely said!", not "You're a genius!".
- Pair praise with information: "12/16 answers right", "You recognised 6 of 8 words (75%)." (`src/components/LessonSession.tsx:137`, `288`).
- Explain why the method works instead of cheering: "Speaking out loud is the fastest way to sound natural.", "Little and often is how new sounds settle in." (`src/app/app/speak/page.tsx:54`, `src/app/app/sounds/page.tsx:136`).
- Let the learner stop: "That's enough for today.", "Done for now", "no daily repeats".
- Streak copy is a light motivator, not a threat: "Reach your daily goal to keep the flame.", "Keep the streak alive — see you tomorrow." (`src/components/home/HomeSections.tsx:66`, `src/app/app/practice/page.tsx:89`).
- Placement: "you can't fail" (`src/app/app/placement/page.tsx:76`).

### 2.6 XP and gamification wording

| Item | Format | Example | Source |
|---|---|---|---|
| XP amount | number, space, "XP"; plus sign when earned | "+10 XP", "120 XP", "12 XP today" | `src/components/home/HomeSections.tsx:35`, `91` |
| XP to next level | bold amount + "to" + level name | "**150 XP** to Pencil" | `src/components/Achievements.tsx:24` |
| Streak | number + "day streak" (no hyphen, singular "day") | "3 day streak" | `src/components/AppNav.tsx:73`, `src/components/home/HomeSections.tsx:32` |
| Streak in a sentence | hyphenated adjective | "Reach a 3-day streak" | `src/lib/gamification.ts:110` |
| Daily goal | "N words" | "5 words", "4/10 words" | `src/app/app/settings/page.tsx:131`, `src/components/home/HomeSections.tsx:63` |
| Quests | imperative task + reward | "Earn 40 XP", "Say 10 things out loud" + "+10 XP", button "Collect" | `src/lib/quests.ts:26-28` |
| No XP | in brackets after the action | "Replay the mission (no XP)" | `src/components/mission/MissionScreen.tsx:95` |
| Promise | XP rewards proof | "XP for skills you prove, not clicks." | `src/app/page.tsx:76` |

### 2.7 Persian, transliteration and English together

**Order.** The learner's script setting decides which leads (`settings.script`, `settings.scriptOnly`; toggle labels "Latin first" / "فارسی first" / "Script only", `src/components/CardControls.tsx:21-30`).

| Context | Order (top to bottom or left to right) | Source |
|---|---|---|
| A word, "Latin first" | transliteration (large, `font-extrabold`) → Persian (smaller, `text-muted`) | `src/components/ui.tsx:62-67` |
| A word, "فارسی first" | Persian (large, `font-bold`) → transliteration (small, `text-muted`) | `src/components/ui.tsx:55-61` |
| A word, "Script only" | Persian only; "sounds like" lines are hidden too | `src/components/ui.tsx:54`, `src/components/LessonSession.tsx:216` |
| Example sentence, phrase, model answer | Persian → transliteration (muted, hidden in script-only) → English | `src/components/WordCard.tsx:41-45`, `src/components/mission/InfoSteps.tsx:136-140`, `src/components/mission/TaskStep.tsx:139-142` |
| Title of a lesson, mission, concept, section | English title → Persian title (`text-muted`, smaller) | `src/components/LessonSession.tsx:64`, `src/app/app/path/page.tsx:98` |
| An answer revealed inline | transliteration · Persian | "salâm · سلام" (`src/components/ChoiceRound.tsx:94`, `src/components/RecallRound.tsx:109`) |
| Pronunciation hint | "sounds like “…”" in English respelling | `src/components/RecallRound.tsx:144` |
| Greeting | Persian · transliteration | "سلام · salâm, {name}!" (`src/app/app/page.tsx:21`) |

**Transliteration standard** (defined in `src/content/words.ts:3-7`, from spec `docs/specs/features/09-answer-checking-and-persian-keyboard.md:75`):

| Sound | Write | Example |
|---|---|---|
| long a (ا / آ) | â | salâm |
| short a, e, o | a, e, o | daftar, medâd |
| long u (و), long i (ی) | u, i | ghesse-gu, safhe-ye sefid |
| خ | kh | khodâhâfez |
| غ / ق | gh | ghalam |
| ش | sh | khoshnevis |
| ژ | zh | |
| چ | ch | chetore |
| ع / ء | ' | ta'ârof |
| ezâfe | -e / -ye with a hyphen | safhe-ye sefid, ghalam-e ney |

Typing is tolerant: accents and apostrophes are ignored when checking (`src/lib/answer.ts`, `normalize`), so "salam" and "taarof" are accepted.

**Register labels.** Words and lines marked colloquial show a saffron chip "Spoken"; formal ones a plum chip "Formal"; neutral ones show nothing (`src/components/ui.tsx:70-77`). The lesson tips explain: "Words marked “Spoken” are how people talk; “Formal” is for writing and polite speech." (`src/components/LessonSession.tsx:82`).

**Inline Persian.** Any Persian inside English copy is wrapped in `<Fa>` so it gets the Persian font and RTL: `We heard <Fa>{heard}</Fa> · {score}%`. Persian-only inputs use Persian placeholders ("اینجا بنویسید…", "مثلاً: حالت چطوره؟"). Persian praise is used once, on the reading result: "آفرین" (`src/components/reading/ReadingLessonView.tsx:36`).

**Naming the language.** The product name is Farsi Pen; the language is "Persian" in the app (68 uses); typed Latin answers are "Finglish" or "Latin letters"; the script toggle says "فارسی".

### 2.8 Naming

| Kind | Names in use | Source |
|---|---|---|
| Tabs | Home, Path, Exams, Progress, Profile | `src/components/AppNav.tsx:13-19` |
| Practice features | Words (Flashcards, Browse), Speak, Scenes, Scene of the day, Hands-free, Daily Practice, AI tutor, Practice studio, Sound workout, Type from memory, Say it, Practise your own sentence | `src/components/AppNav.tsx:27-33`, `src/components/home/HomeSections.tsx:342-350` |
| Course features | Sounds (Sound path, stages, review, test-out), Lessons, Missions, Grammar, Reading, Alphabet, Poetry | `src/components/AppNav.tsx:34-40` |
| Exams | Placement test ("Find your level"), SAMFA, Mini mock test | `src/app/app/exams/page.tsx:21-36` |
| Personal set | My cards (saved words), Hidden | `src/app/app/bookmarks/page.tsx:76-86` |
| Home modules | Today, Daily quests, Getting started, My weak sounds, Say it by topic | `src/components/TodayPlan.tsx:108`, `src/components/home/HomeSections.tsx` |
| Course structure | Path → Section N (CEFR); Lessons → Level 1–5 (shown as "Unit N" eyebrow); Sound path → Unit → Stage → Review | `src/app/app/path/page.tsx:95`, `src/app/app/lessons/page.tsx:31`, `src/components/SoundPath.tsx:41-45` |
| Skill states (missions) | New, Seen, Practised, Mastered, Due for a check | `src/components/mission/MissionScreen.tsx:13-19` |
| Sound states | Not tried, Needs work, Getting there, Solid; letters: clear, unclear, off, not heard | `src/app/app/sounds/page.tsx:20-23`, `src/components/PronunciationFeedback.tsx:19` |
| XP levels (draft) | Blank Page, First Dot, Ink Drop, Pencil, Notebook, Reed Pen, Letter Writer, Storyteller, Calligrapher, Orator, Librarian, Translator, Author, Golden Pen; each with Persian and transliteration | `src/lib/gamification.ts:18-33` |
| CEFR names | Beginner, A1 · Basic, A2 · Elementary, B1 · Intermediate, B2 · Upper intermediate | `src/app/app/exams/page.tsx:8`, `src/app/app/placement/page.tsx:11` |
| Badges | First Words, Level 1 Done, Every Lesson, Warm Ink, One Week, A Month of Farsi, Word Collector, Hundred Words, 100 XP, 1,000 XP, First Stroke, Full Alphabet, Grammar Starter, Grammar Master | `src/lib/gamification.ts:107-120` |

Naming rules: pen-and-writing themes for levels and badges ("Warm Ink", "First Stroke") tie back to the brand; feature names describe the activity in plain words ("Sound workout", "Type from memory", "Hands-free").

### 2.9 Numbers, dates and times

| Rule | Example | Source |
|---|---|---|
| Digits for counts, scores and durations in UI | "8 words", "about 25 minutes", "3–6 minutes" | `src/app/app/samfa/page.tsx:227` |
| Progress as "n/total" (no spaces) in tight spots, "n of total" in sentences | "3/5", "2 of 3 done", "12 of 40 steps" | `src/components/TodayPlan.tsx:111`, `src/app/app/path/page.tsx:80` |
| Scores out of a fixed maximum | "38/60", "184/240" | `src/app/app/samfa/page.tsx:69`, `99` |
| Percent without a space | "80%", "Accuracy 72%" | `src/components/GrammarLesson.tsx:44` |
| Plurals handled in code | "1 card" / "2 cards", "1 play left" | `src/components/FlashcardSession.tsx:331`, `src/components/samfa/Practice.tsx:98` |
| Thousands separator | "1,000 XP"; clip counts use `toLocaleString()` | `src/lib/gamification.ts:116` |
| Month and weekday names in English | "November 2026" (`month: "long"`), weekday letters "M T W T F S S" | `src/app/app/progress/page.tsx:62`, `79` |
| Times | 24-hour from a time input, default "19:00"; "Notifications on for 19:00." | `src/components/ProgressTools.tsx:14`, `98` |
| Timers | m:ss with "left": "4:05 left"; turns anar at 30 seconds | `src/components/samfa/Practice.tsx:27-35` |
| Persian digits | Come from the font (FaNum) inside `<Fa>`, not from the string | skill §9 |

### 2.10 Placeholders

- A placeholder shows an example or the purpose, never the only label: "e.g. salâm or سلام" (`src/components/RecallRound.tsx:173`), "So we can greet you" under the visible label "Your name" (`src/app/app/settings/page.tsx:59-65`), "abcd-efgh-…" for the sync code (`src/components/SyncCard.tsx:154`).
- It names both accepted scripts where both work: "Type in Finglish or فارسی…", "Search or look up any word, in English or فارسی".
- Optional fields say so: "What's wrong? (optional)".
- Persian-only fields have Persian placeholders.
- Every input also has a visible label or an `aria-label` ("Your answer", "Search words", "Persian word or sentence").

### 2.11 Accessibility labels

| Rule | Real examples | Source |
|---|---|---|
| Icon buttons get a verb phrase | "Play audio", "Play slowly", "Quit session", "Close", "Copy sync code", "Hide checklist", "Previous month" | `src/components/ui.tsx:102-106`, `217` |
| Labels follow state | "Add to my cards" / "Remove from my cards"; "Start speaking" / "Stop recording"; "Audio unavailable — try again" | `src/components/ui.tsx:121`, `143`; `src/components/SpeakRound.tsx:179` |
| Include the object when there are many | "Play Sara's line", "Play sentence 3", "Say “salâm” and check your pronunciation" | `src/components/scene/ScenePlayer.tsx:239`, `src/components/SayItButton.tsx:20` |
| Spell out compact visuals | "3 day streak", "120 XP", "Overall 72%", "2 of 3 stars", "kh clear, a unclear" | `src/components/AppNav.tsx:73-77`, `src/components/PronunciationFeedback.tsx:32-37`, `54` |
| Screen-reader-only state text | "(done)", "Done", "Next", ", goal met", "2026-11-10: practised" | `src/app/app/page.tsx:85`, `src/components/TodayPlan.tsx:137`, `src/app/app/progress/page.tsx:104` |
| Decorative emoji and icons are hidden | `aria-hidden` on emoji badges, flame and star icons | `src/components/TodayPlan.tsx:64`, `src/components/AppNav.tsx:74` |

### 2.12 Word list

| Use | Avoid | Why |
|---|---|---|
| Not quite, Almost, Not yet | Wrong, Incorrect, Failed | Kind and accurate; "almost" is accepted |
| Spot on, Nicely done, Nicely said | Amazing, Awesome, Perfect, Genius | Praise without hype |
| Couldn't …, … is blocked, Didn't catch that | Error, Oops, Sorry, Failed to | Plain cause, no blame |
| Check your connection | Network error, offline mode | Tells the learner what to do |
| Try again | Retry (as a visible label) | Plain English |
| Check / Continue / Got it | Submit / Next (in quizzes) / OK | Consistent session verbs |
| Practise (verb), practice (noun) | Practice (as a verb), practicing | British English used throughout |
| Persian (the language) | Farsi (outside the product name and the "فارسی" toggle) | One name for the language |
| Finglish, Latin letters | romanisation, Pinglish | Terms learners recognise |
| Spoken, Formal | colloquial, literary (in UI) | The chip labels |
| My cards, Add to my cards | bookmark, saved words, deck (as a feature name) | One name for the personal set |
| Profile (the tab and screen) | Settings (as a place to go) | The tab is called Profile |
| day streak, daily goal, XP | points, score (for XP), lives | Current game vocabulary |
| mastered, due for a check | complete (for missions), expired | Mastery model wording |
| in this browser | on our servers, in the cloud | Where progress actually lives |
| That's enough for today, Done for now | Don't stop now, Keep going to earn more | Respect the learner's time |
| you, we | the user, the learner (in UI) | Direct address |

## 3. Usage: do and don't (before and after)

"Real" means the text is in the code today. "Modelled" means an invented but typical alternative, used to show why the real copy is right. Rewrites of real copy are *(proposed)*.

| # | Before | After | Note |
|---|---|---|---|
| 1 | Modelled: "Amazing!!! You're on fire! 🔥" | Real: "Nicely done!" (`src/components/ChoiceRound.tsx:176`) | Short, specific praise |
| 2 | Modelled: "Mission failed." | Real: "Not yet — and that's fine" + "Going through the mission once will make the check much easier." (`src/components/mission/MissionSession.tsx:82`, `95`) | Outcome plus the way forward |
| 3 | Modelled: "Incorrect." | Real: "Not quite" + "Answer: salâm · سلام" + "We'll come back to this one." (`src/components/RecallRound.tsx:198-207`) | Give the answer and the retry promise |
| 4 | Modelled: "Spelling error." | Real: "Almost — watch the spelling" + "Accepted spelling: salâm" (`src/components/RecallRound.tsx:198-203`) | Accept and teach |
| 5 | Modelled: "Don't stop now! Do another lesson for bonus XP!" | Real: "That's enough for today. See you tomorrow!" (`src/components/TodayPlan.tsx:159`) | Honest end point |
| 6 | Modelled: "No data." | Real: "No cards saved yet" + "Tap the bookmark icon (Add to my cards) on any word…" + "Go to flashcards" (`src/app/app/bookmarks/page.tsx:105-114`) | Empty state that teaches |
| 7 | Modelled: "Error 503" | Real: "Download failed — check your connection and try again." (`src/components/SpeechSetup.tsx:64`) | What happened + what to do |
| 8 | Real: "Something went wrong — try again." (`src/components/SpeakRound.tsx:22`) | *(proposed)* "Couldn't check that take. Tap the mic to try again." | Name what failed |
| 9 | Real: "Something went wrong. Try again in a minute." (`src/components/SyncCard.tsx:18`) | *(proposed)* "Couldn't sync right now. Try again in a minute." | Same |
| 10 | Real: `alert("Microphone access is needed to record.")` (`src/app/app/review/page.tsx:90`) | *(proposed)* Inline status: "Microphone access is blocked. Allow it in your browser's site settings, then tap Record again." | Same wording as the other mic errors; no browser alert |
| 11 | Real: "The tutor is very busy today. Please try again later." (`src/app/app/tutor/page.tsx:82`) | *(proposed)* "The tutor is busy right now. Try again in a few minutes." | No "Please"; a concrete wait |
| 12 | Real: "…or switch to Whisper in Settings." (`src/components/SpeakRound.tsx:19`) | *(proposed)* "…or switch to Whisper in Profile → Voice & speech." | The screen is called Profile |
| 13 | Real: StatCard "Total XP" showing this session's XP (`src/components/LessonSession.tsx:291`) | *(proposed)* "XP earned" | "Total XP" is the lifetime figure on Progress |
| 14 | Real: "Almost! Watch the spelling." (`src/components/GrammarLesson.tsx:155`) | *(proposed)* "Almost — watch the spelling" | Match recall and missions |
| 15 | Real: "Translate into Farsi (Latin letters)" (`src/components/GrammarLesson.tsx:150`) | *(proposed)* "Translate into Persian — Latin letters are fine" | One language name |
| 16 | Real: "Write this in Farsi" (`src/components/RecallRound.tsx:130`) | *(proposed)* "Write this in Persian" | Same |
| 17 | Real: chip "NEW" (`src/components/WordCard.tsx:32`) | *(proposed)* "New" | No ALL CAPS in strings |
| 18 | Real: checklist "Bookmark a word" (`src/app/app/page.tsx:55`) | *(proposed)* "Add a word to My cards" | One name for the feature |
| 19 | Real: "Daily practice" (`src/app/app/exams/page.tsx:64`) | *(proposed)* "Daily Practice" | Feature name as in the nav |
| 20 | Real: "Last mock: 184/240 on 2026-11-10" (`src/app/app/samfa/page.tsx:230`) | *(proposed)* "Last mock: 184/240 on 10 Nov" | Human date |
| 21 | Real: "Toggle Persian keyboard" (`src/components/RecallRound.tsx:186`) | *(proposed)* "Persian keyboard" (with `aria-pressed`) | Screen readers already announce the toggle state |

Further pairs to follow:

| Do | Don't |
|---|---|
| "Microphone is blocked — you can type instead." | "Microphone permission denied." |
| "Reset progress…" then "Yes, reset everything" | "Are you sure?" / "OK" |
| "Removes XP, streaks, lessons, reviews, bookmarks and badges from this browser. Settings are kept." | "This cannot be undone." alone |
| "Take the placement test (3–6 minutes) and start at your level." | "Click here to take the test." |
| "Answer every question to go on" next to a disabled Next | A disabled button with no reason |

## 4. Accessibility notes

- Every icon-only control has an `aria-label` that starts with a verb and changes with state (2.11). New controls must follow the same pattern.
- Status changes that matter (answer verdicts, mic state, downloads, save results) are written as a short sentence in a `role="status"` region so they are read aloud. Avoid relying on an icon or colour to carry the verdict; the title text must carry it ("Not quite", not just a red sheet).
- Persian text inside English must be wrapped in `<Fa>` (or `lang="fa" dir="rtl"`) so screen readers switch voice and the text renders right to left. The onboarding example uses a raw `span lang="fa"` (`src/components/TodayPlan.tsx:77`); it works but should use `<Fa>`.
- Transliteration is a reading aid, not a replacement for audio: every word with a transliteration also has a "Play audio" button.
- Keep labels short enough to read at 375px without truncation; titles truncate only in list detail lines (`truncate`).
- Do not put instructions only in placeholders; they disappear on input.
- Keyboard hints ("Press 1–4 to pick, Enter to check") are shown only from `sm` up; they must stay supplementary.

## 5. Code reference

| What | Where |
|---|---|
| Feedback titles | `src/components/ChoiceRound.tsx:176`, `src/components/RecallRound.tsx:198`, `src/components/GrammarLesson.tsx:153-157`, `src/components/mission/TaskStep.tsx:83`, `src/components/SpeakRound.tsx:217`, `src/components/SayItButton.tsx:165`, `src/components/scene/ScenePlayer.tsx:267`, `src/components/HandsFree.tsx:299` |
| Speech error copy (four copies) | `src/components/SpeakRound.tsx:16-23`, `src/components/SayItButton.tsx:30-37`, `src/components/scene/ScenePlayer.tsx:22-29`, `src/components/mission/AnswerInput.tsx:61-63` |
| Network and sync copy | `src/components/SyncCard.tsx`, `src/components/ProgressTools.tsx`, `src/components/SpeechSetup.tsx`, `src/app/app/tutor/page.tsx:79-85` |
| Mission and task copy | `src/components/mission/TaskStep.tsx:14-19`, `src/components/mission/MissionSession.tsx:79-96`, `src/components/mission/MissionScreen.tsx:13-19` |
| Today plan copy | `src/lib/today.ts`, `src/components/TodayPlan.tsx` |
| Levels and badges | `src/lib/gamification.ts:18-33`, `107-120` |
| Quests | `src/lib/quests.ts:25-29` |
| Register chip | `src/components/ui.tsx:70-77` |
| Script order | `src/components/ui.tsx:51-68`, `src/components/CardControls.tsx` |
| Transliteration standard | `src/content/words.ts:3-7`; answer normalisation `src/lib/answer.ts` |
| Page titles | `src/app/app/*/layout.tsx` (`metadata.title`), `src/app/app/layout.tsx:5`, `src/app/layout.tsx:16` |

## 6. Gaps and recommendations

> Priorities in this section are this designer's view. The agreed, deduplicated priority for each issue is in *13 · Governance and roadmap*, §3.

**P0**

1. **The settings screen has two names.** The tab, page title and h1 say "Profile" (`src/components/AppNav.tsx:18`, `src/app/app/settings/page.tsx:23`), but 13 strings send learners to "Settings" ("switch to Whisper in Settings", "download the voice in Settings", "Settings → Voice & speech"; e.g. `src/components/SpeakRound.tsx:19-20`, `src/components/ui.tsx:92`, `src/components/home/HomeSections.tsx:306-309`), while the sync card says "Profile → Sync across devices" (`src/components/SyncCard.tsx:145`). *(proposed)* Use "Profile" everywhere, and "Profile → Voice & speech" for deep pointers.
2. **"Total XP" means two things.** On result screens it is the XP earned in that session (`src/components/LessonSession.tsx:291`, `src/app/app/practice/page.tsx:91`, `src/app/app/speak/page.tsx:56`); on Progress "total XP" is lifetime (`src/app/app/progress/page.tsx:23`). Missions say just "XP" (`src/components/mission/MissionSession.tsx:122`). *(proposed)* "XP earned" on results.
3. **The transliteration standard is not shown to learners.** It exists only as a code comment (`src/content/words.ts:3-7`), though the spec says it is "published to learners" (`docs/specs/features/09-answer-checking-and-persian-keyboard.md:75`). *(proposed)* A short "How we write Persian in Latin letters" card in Alphabet and in Study tips.

**P1**

4. **Feedback titles are inconsistent in wording and punctuation:** "Nicely done!" (choice, grammar), "Correct!" (recall); "Almost — watch the spelling" (recall, no full stop), "Almost — watch the spelling." (missions), "Almost! Watch the spelling." (grammar); "Not quite" / "Not quite yet." / "Not quite — we’ll come back to it." / "Not quite — here's one way to say it."; hands-free "Spot on" / "Close" without "!". *(proposed)* One table in a shared module: correct "Nicely done!" (speaking: "Spot on!"), almost "Almost — watch the spelling" (speaking: "Almost — sounds close"), wrong "Not quite"; no trailing full stops on titles.
5. **"Farsi" and "Persian" both name the language** in instructions: "Write this in Farsi" (`src/components/RecallRound.tsx:130`), "Translate into Farsi (Latin letters)" (`src/components/GrammarLesson.tsx:150`), "On-screen Persian keyboard when typing in Farsi" (`src/app/app/settings/page.tsx:142`), "speak Farsi" on the landing hero (`src/app/page.tsx:158-159`). *(proposed)* "Persian" in the app; keep "Farsi" for the brand and, if wanted, marketing.
6. **"My cards" vs bookmarks.** The feature is "My cards" in nav, page and buttons, but the route is `/app/bookmarks/`, the checklist says "Bookmark a word" (`src/app/app/page.tsx:55`), the empty state says "Tap the bookmark icon" (`src/app/app/bookmarks/page.tsx:108`), Reset lists "bookmarks" (`src/app/app/settings/page.tsx:192`), and Speak's picker says "My words" (`src/app/app/speak/page.tsx:87`). *(proposed)* "My cards" in all copy; "the bookmark icon" is fine only when describing the icon.
7. **Content titles mix Title Case and sentence case.** Lesson titles and level names are Title Case ("Food & Drink", "Everyday Words", "Level 1 · First Steps", `src/content/lessons.ts:21-66`); mission and grammar titles are sentence case ("Order at a café", "The object marker râ"). Level names and badges are Title Case (`src/lib/gamification.ts`). *(proposed)* Sentence case for lesson titles; keep Title Case only for XP level and badge names, treated as proper names.
8. **One feature, several names.** Speak = "Speak" (nav, page title) / "Speaking practice" (h1) / "Say it" (dialog); Sounds = "Sounds" (nav) / "Persian sounds" (page); the tutor = "AI tutor" / "Talk with the tutor"; Words = "Words" (nav, h1) / "Word Library" (browser title, `src/app/app/words/layout.tsx:1`); Home = "Home" (tab) / "Dashboard" (browser title, `src/app/app/layout.tsx:5`); placement = "Placement" / "Placement test" / "Find your level". *(proposed)* A single name per feature, used in nav, h1 and `<title>`; descriptive phrases only as subtitles.
9. **"Level" is overloaded.** It names XP levels ("Level 3 · Ink Drop"), lesson groups ("Level 1 · First Steps", shown with the eyebrow "Unit 1 · A1", `src/app/app/lessons/page.tsx:31-35`), CEFR bands ("Level A1" in grammar) and placement results ("Your level"). *(proposed)* Keep "level" for CEFR; call lesson groups "Unit" in both eyebrow and heading; call XP tiers "rank" or keep "Level" only on Progress.
10. **"Next up" vs "Up next".** Path and Sounds cards say "Next up"; path items, the lesson trail and lesson results say "Up next" (`src/app/app/path/page.tsx:50`, `129`; `src/app/app/lessons/page.tsx:50`; `src/components/LessonSession.tsx:301`). *(proposed)* "Next up".
11. **Duplicated speech error copy** in four components, with drift ("Microphone access is blocked…" vs "Microphone is blocked — you can type instead." vs "Couldn't listen — check the microphone." in SAMFA, `src/components/samfa/Practice.tsx:378`). *(proposed)* One `STT_ERRORS` map in `src/lib/stt.ts` with an optional "type instead" variant.

**P2**

12. **Apostrophes and quotes are mixed:** 37 `&apos;` and about 60 straight `'` in strings against 7 curly `’` (e.g. "you’ll" in Study tips, `src/components/LessonSession.tsx:83`; "we’ll" in `src/components/GrammarLesson.tsx:156`), and one `&quot;I don&apos;t know&quot;` (`src/app/app/placement/page.tsx:85`) where other copy uses curly “ ”. *(proposed)* Curly apostrophes and quotes in all visible copy.
13. **Numbers in words vs digits:** "Ten words…", "three to six minutes", "Three minutes on your weakest sounds" next to "3–6 minutes" and "8 words" (`src/app/app/practice/page.tsx:66`, `src/app/app/placement/page.tsx:76`, `src/components/home/HomeSections.tsx:174`). *(proposed)* Digits everywhere in UI copy.
14. **Ranges written three ways:** "A1 to B2", "A1 → B2" (`src/app/page.tsx:45`), "B1–B2". *(proposed)* "A1–B2" in labels, "from A1 to B2" in sentences; keep "→" for directions only.
15. **Dates are raw or locale-dependent:** the SAMFA "Last mock" shows an ISO day key (`src/app/app/samfa/page.tsx:230`); "Last synced" uses `toLocaleString()` with seconds (`src/components/SyncCard.tsx:127`). *(proposed)* "10 Nov" / "10 Nov, 19:05" via `toLocaleDateString("en", { day: "numeric", month: "short" })`.
16. **ALL CAPS strings:** "NEW" (`src/components/WordCard.tsx:32`) and "DEV" (`src/components/AppNav.tsx:65`). *(proposed)* "New"; "Dev".
17. **Stray "Please"** in one error (`src/app/app/tutor/page.tsx:82`) and a technical leftover on the landing chip "MVP demo" (`src/app/page.tsx:155`). *(proposed)* Drop "Please"; say "Free preview" instead of "MVP demo".
18. **Lock icon on lessons that are open** contradicts the copy "you can open any of them" (`src/app/app/lessons/page.tsx:82`, `95`). *(proposed)* Neutral icon, status "Not started".
19. **Level names are marked draft** ("DRAFT for review", `src/lib/gamification.ts:18`) and the vocabulary is "pending native review" (`src/content/words.ts:1`). *(proposed)* A native-speaker review of every Persian string, including level and badge Persian names, before launch.
