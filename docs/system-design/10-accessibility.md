# 10 · Accessibility

The accessibility standard Farsi Pen holds itself to, how the prototype meets it today, what has been audited, and the checks every release must pass.

## 1. Principles

- **WCAG 2.1 AA is the floor.** The overview names "WCAG 2.1 AA" as the bar (`docs/system-design/00-overview.md:38`). Some house rules go further (44px targets are AAA 2.5.5).
- **Tokens carry the guarantee.** Contrast is built into `-ink`, `muted`, `field-edge` and `on-accent`, so a screen built from tokens starts accessible. Hard-coded colours lose that.
- **Never colour alone.** Every state (correct, wrong, selected, done) has an icon, a word or a shape as well as a colour.
- **Respect the device's settings.** Reduced motion, reduced transparency and more contrast are honoured globally in `globals.css`.
- **Every skill has a way in.** Audio always comes with text; speaking can be skipped or typed; a missing microphone or voice never blocks progress.
- **Learning adds its own needs.** A new script, speaking tasks and exam timers raise barriers that WCAG does not cover; we design for them on purpose (section 2.16).

## 2. Specification

### 2.1 Standard and scope

| Item | Value |
|---|---|
| Standard | WCAG 2.1 Level AA |
| House rules beyond AA | 44px touch targets; state never by colour alone; a non-speaking path for speaking tasks |
| Platforms | Static web app (Next.js 16 export), phones from 320px to desktop, light and dark themes (`globals.css:181-256`) |
| Testing today | One-off audits (section 2.17). No automated accessibility checks in CI: `npm test` runs Vitest unit tests only (`package.json:9`, `.github/workflows/deploy.yml:38`, `:58`) |

### 2.2 Text contrast

Ratios computed for this doc from the token hex values (`globals.css:27-83`, dark `:183-216`) with the WCAG formula. `-soft` backgrounds are the accent mixed over `card` at their stated percentage.

| Pair | Light | Dark | Use | AA (4.5:1) |
|---|---|---|---|---|
| `ink` on `card` / `canvas` | 16.83 / 15.08 | 15.63 / 19.29 | Body text | Pass |
| `muted` on `card` / `canvas` | 6.45 / 5.78 | 6.61 / 8.16 | Secondary text, disabled labels (`globals.css:301-302`) | Pass |
| `muted` on `paper` (over card) | 5.59 | 4.99 | Disabled buttons, insets | Pass |
| `faint` on `card` | 2.57 | 2.84 | Decorative only; also input placeholders (`globals.css:489`) | Fail (allowed only for decoration) |
| `firuze-ink` on `firuze-soft` | 5.39 | 8.58 | Secondary buttons | Pass |
| `pista-ink` on `pista-soft` | 4.96 | 8.08 | Correct states | Pass |
| `anar-ink` on `anar-soft` | 4.89 | 6.48 | Wrong states | Pass |
| `saffron-ink` on `saffron-soft` | 5.34 | 7.91 | Rewards, chips | Pass |
| `sky-ink` on `sky-soft` | 5.61 | 6.72 | Selected tiles | Pass |
| `plum-ink` on `plum-soft` | 5.67 | 6.94 | Grammar | Pass |
| `on-accent` on `firuze` / `pista` / `anar` | 4.70 / 5.06 / 4.57 | 11.04 / 10.39 / 6.16 | Button labels | Pass |
| `on-accent` on `sky` / `plum` | 4.80 / 4.52 | 5.76 / 5.96 | Audio and grammar buttons | Pass |
| `on-accent` on `saffron` | **2.25** | 11.77 | Reward icons and "done" nodes | Fail in light (see Gap 3) |

The skill adds: `text-on-accent` only on solid accent fills, at 15px semibold or larger (`SKILL.md:112`). Saffron buttons are avoided on purpose: `TONE.saffron.btn` maps to `btn-primary` (firuze) (`ui.tsx:20`).

### 2.3 Non-text contrast (WCAG 1.4.11)

| Element | Token | Light | Dark | Source |
|---|---|---|---|---|
| Input and select edge | `field-edge` #8e8e93 / #7c7c80 | 3.26 on card, 2.92 on canvas | 4.09 on card, 5.05 on canvas | `globals.css:34-35`, `:190`, `:475`, `:499` |
| Focused input | Border turns `sky` + 4px ring at 22% | sky 4.80 on card | — | `globals.css:484-487` |
| Focus ring | `sky` mixed 70% with transparent | ≈2.95 on card, 2.76 on canvas | ≈2.91 on card | `globals.css:145-148` |
| Separators under "more contrast" | `line` becomes `field-edge`; cards get a 1px `field-edge` outline | 3.26 | 4.09 | `globals.css:548-555` |

### 2.4 Focus

| Rule | Value | Source |
|---|---|---|
| Ring | `:focus-visible { outline: 3px solid color-mix(in srgb, var(--color-sky) 70%, transparent); outline-offset: 2px }` | `globals.css:145-148` |
| Keyboard only | An inline script sets `html[data-input]` to `pointer` on load and on pointer-down, and to `keyboard` on Tab or an arrow key; in pointer mode the ring is hidden | `layout.tsx:9-10`, `globals.css:149-154` |
| Text fields | Use their own `:focus` style (sky border + ring), so they always show focus | `globals.css:484-487`, `:514-518` |
| Selected sound tile | `ring-[3px] ring-sky` | `PronunciationFeedback.tsx:145` |
| Focus on new content | 36 `autoFocus` uses: the Continue button in `FeedbackSheet` (`ui.tsx:281`), the close button in dialogs (`YouglishPlayer.tsx:142`), answer inputs (`RecallRound.tsx:175`) | grep `autoFocus` |

### 2.5 Target sizes

| Control | Size | Source | Meets 44px |
|---|---|---|---|
| `btn` (default) | `min-height: 2.875rem` (46px) | `globals.css:269` | Yes |
| `btn-lg` | 3.25rem (52px) | `globals.css:361-366` | Yes |
| `btn-icon` | 2.75rem (44px) round | `globals.css:368-374` | Yes |
| `btn-sm` | 2.25rem (36px); 69 uses | `globals.css:355-360` | No |
| `Segmented` option | `min-h-10` (40px), never wraps | `ui.tsx:173` | Agreed exception (Hallmark audit) |
| Mobile tab | full fifth of the bar, about 55px tall | `AppNav.tsx:166` | Yes |
| Sound tile | `min-h-11 min-w-14` (44 × 56px) | `PronunciationFeedback.tsx:145` | Yes |
| Persian keyboard key | `h-11` (44px) tall, width shared | `PersianKeyboard.tsx:16` | Height yes; about 19px wide at 320px |
| SAMFA rubric marks | `size-10` (40px) | `samfa/Practice.tsx:177` | No |
| Tap-a-word in reading | inline text with `px-0.5` | `ReadingLessonView.tsx:199` | Inline exception |

### 2.6 Names, labels and screen-reader text

| What | Count / rule | Example |
|---|---|---|
| `aria-label` | 133 uses in 44 files (grep) | "Play audio", "Play slowly" (`ui.tsx:102-106`), "Quit session" (`ui.tsx:217`) |
| Icon buttons | Always an `aria-label`; `title` adds a hover hint (45 `title=` uses) | `BookmarkButton`: `aria-pressed` + "Add to my cards" / "Remove from my cards" (`ui.tsx:142-144`) |
| `sr-only` text | 7 uses: state words ("Done", "Next", ", goal met", "(done)"), a hidden file input, "Tip:" and the XP data table | `TodayPlan.tsx:137`, `progress/page.tsx:104`, `:167`, `app/page.tsx:85` |
| Decorative icons and spacers | `aria-hidden` (48 uses) | `FeedbackSheet` spacer `ui.tsx:260` |
| Toggle state | `aria-pressed` (15), `aria-expanded` (8) | Keyboard toggle `RecallRound.tsx:185`; "Read the full poem" `Poetry.tsx:54` |
| Progress | `role="progressbar"` with `aria-valuenow/min/max` and a name (default "Progress") | `ui.tsx:37-42` |
| Segmented control | `role="radiogroup"` with `aria-label`, options `role="radio"` + `aria-checked` | `ui.tsx:164-170` |
| Language | `lang="en"` on the page, `lang="fa"` on Persian (see 09) | `layout.tsx:53`, `ui.tsx:27` |

### 2.7 State not by colour alone

| State | Colour | Second signal | Source |
|---|---|---|---|
| Choice correct / wrong | `tile` `data-state` pista / anar | Check / X icon with `aria-label` "Correct" / "Wrong" replacing the number badge; wrong also shakes | `ChoiceRound.tsx:151-157`, `:147` |
| SAMFA question result | `tile` state | CheckCircle2 / XCircle icon | `samfa/Practice.tsx:50-52` |
| Answer feedback | Pista or anar sheet | Icon, title ("Correct!", "Not quite"), detail text | `ui.tsx:272-279` |
| Pronunciation per letter | pista / saffron / anar text | Missed letters get a dotted underline; tiles show the label and a score number; legend in words | `PronunciationFeedback.tsx:12-19`, `:40`, `:148-160` |
| Calendar days | `bg-anar` / `bg-anar-soft` | Filled vs tinted, `sr-only` ", goal met" / ", practised", `title` | `progress/page.tsx:97-104` |
| Checklist done | Saffron check circle | Line-through label and `sr-only` "(done)" | `app/page.tsx:75-85` |
| Selected / current | sky / firuze border | Inset 1px ring doubles the border; `aria-pressed` / `aria-current` | `globals.css:411-432` |
| Register | Saffron / plum chip | The word "Spoken" or "Formal" | `ui.tsx:70-77` |

### 2.8 Charts and data

| Chart | Visual | Text alternative | Source |
|---|---|---|---|
| XP bars | `aria-hidden` bar chart | `sr-only` `<table>` with caption and one row per day or week | `progress/page.tsx:152-176` |
| Sound trend sparkline | SVG | `role="img"` + `aria-label` "From X to Y"; `<title>` per point | `progress/page.tsx:208-215` |
| Pronunciation score ring | SVG ring | `role="img"` + "Overall N%" | `PronunciationFeedback.tsx:54` |
| Mouth diagram | SVG | `role="img"` + "Mouth position: …" | `MouthDiagram.tsx:66` |
| Scene cast stack | Overlapping avatars | `role="img"` + "With Name, Name"; each avatar `aria-hidden` | `scene/Cast.tsx:9-11`, `:28` |

### 2.9 Structure and landmarks

| Item | Value | Source |
|---|---|---|
| Main | `<main>` in the app layout and on the landing page | `src/app/app/layout.tsx:14`, `src/app/page.tsx:151` |
| Navigation | `<nav aria-label="Main">` in the desktop sidebar (`<aside>`) and in the mobile tab bar; only one shows per breakpoint | `AppNav.tsx:97-101`, `:127-130` |
| Header | `<header>` for the top bar | `AppNav.tsx:117` |
| Current page | `aria-current="page"` on tabs and sidebar links; `aria-current="step"` in the Today plan | `AppNav.tsx:155`, `:183`, `TodayPlan.tsx:122` |
| Sections | 35 `aria-labelledby` sections tied to their headings | e.g. `progress/page.tsx:132` |
| Page titles | Per-route `metadata` titles ("Lessons · Farsi Pen") | `src/app/app/*/layout.tsx` |
| Focus mode | Sessions hide the app nav (`body[data-focus] .app-nav { display: none }`) | `globals.css:618-620`, `ui.tsx:200-208` |

### 2.10 Live regions and announcements

| Pattern | Count | Example |
|---|---|---|
| `role="status"` | 24 | `FeedbackSheet` when answered (`ui.tsx:262`); mic status "Listening…" (`SpeakRound.tsx:185`); trace score (`TraceCanvas.tsx:181`); word gloss (`ReadingLessonView.tsx:253`) |
| `aria-live="polite"` | 2 | Content review panel (`review/page.tsx:168`); tutor chat (`tutor/page.tsx:229`) |
| `role="alert"` | 1 | Tutor error (`tutor/page.tsx:290`) |
| `role="timer"` | 1 component | SAMFA `Timer` (implicitly not live, so it does not announce every second) (`samfa/Practice.tsx:31`) |

### 2.11 Keyboard

| Where | Keys | Behaviour | Source |
|---|---|---|---|
| Choice rounds | 1–4 or A–D | Select option; Enter checks, then continues. Ignored in text fields and with Cmd/Ctrl/Alt. Hint "Press 1–4 to pick, Enter to check" (hidden below `sm`) | `ChoiceRound.tsx:63-84`, `:180` |
| Grammar exercises | 1–9 | Select option; Enter submits, then continues | `GrammarLesson.tsx:200-221` |
| Flashcards | Space or Enter | Flip | `FlashcardSession.tsx:119-121` |
| Flashcards (flipped) | 1 / 2 / 3 | Didn't know / Almost / Knew it | `FlashcardSession.tsx:40-60`, `:122-124` |
| Typed answers | Enter | Submits the form ("Press Enter to check") | `RecallRound.tsx:150-156`, `:214`; `AnswerInput.tsx:83` |
| Tutor | Enter (Shift+Enter for a new line) | Send | `tutor/page.tsx:326-327` |
| Dialogs | Esc | Close (native `<dialog>`) | `SayItButton.tsx:97-103` |

### 2.12 Dialogs and focus management

| Rule | Value | Source |
|---|---|---|
| Element | Native `<dialog>` opened with `showModal()` (inert background, Esc to close) | `SayItButton.tsx:52`, `YouglishPlayer.tsx:118`, `sounds/page.tsx:278` |
| Name | `aria-label` on the dialog ("Say it") | `SayItButton.tsx:101` |
| Close | X button with `aria-label="Close"`; backdrop click closes | `SayItButton.tsx:99`, `:106` |
| Visual | `backdrop:bg-black/40` + 4px backdrop blur, `!rounded-[1.75rem]`, `animate-pop` | `SayItButton.tsx:100`, `globals.css:606-609` |
| Answer sheet | `FeedbackSheet` moves focus to Continue (`autoFocus`) and announces itself (`role="status"`) | `ui.tsx:262`, `:281` |
| Focus return | Not handled explicitly: closing by X or backdrop unmounts the dialog without `dialog.close()` | `SayItButton.tsx:23`, `YouglishPlayer.tsx:109` |

### 2.13 Motion, transparency and contrast preferences

| Preference | What happens | Source |
|---|---|---|
| `prefers-reduced-motion: reduce` | Every animation and transition runs in 0.01ms; the tab pill uses `motion-reduce:transition-none` | `globals.css:166-173`, `AppNav.tsx:135` |
| `prefers-reduced-transparency: reduce` | `glass`, `material`, `material-canvas` become solid `card` with no blur | `globals.css:531-539` |
| No backdrop-filter support | Same solid fallback | `globals.css:541-547` |
| `prefers-contrast: more` | Separators become `field-edge`; cards get a `field-edge` outline | `globals.css:548-555` |
| Looping motion | The skill bans loops (`SKILL.md:97`); the code still uses `animate-pulse` (6), `animate-ping` (3) for playing / listening, and `animate-spin` (14) for loading | grep |

### 2.14 Reflow, zoom and inputs

| Rule | Value | Source |
|---|---|---|
| 320px wide | No sideways scrolling at 320px (Hallmark audit); `overflow-x: clip` on `html, body` as a safety net (not `hidden`, which breaks sticky) | `globals.css:108-112`, commit 15aefcc |
| Zoom | Viewport sets `width=device-width, initial-scale=1` with no maximum scale, so pinch zoom works | `layout.tsx:42-49` |
| Input text ≥ 16px | `input` 1.0625rem (17px); `select` 1rem with the note "16px or more, or iOS zooms the page"; overrides only go up (`!text-base`, `!text-lg`) | `globals.css:478`, `:506-507` |
| Minimum label size | 11px for form labels (Hallmark audit) | commit 15aefcc |

### 2.15 Audio and microphone alternatives

| Feature | If you can't hear | If you can't speak or have no mic | Source |
|---|---|---|---|
| Any word or sentence | Text is always on screen; audio is an extra button | — | `ui.tsx:89-132` |
| Audio fails | "Audio unavailable" text and a `title` explaining why | — | `ui.tsx:92`, `:111`, `:121` |
| Speak round | Text prompt shown | **Skip**; without speech recognition a card says "This browser can't listen to speech…" | `SpeakRound.tsx:209-211`, `:228-229` |
| Missions | Text dialogue | Type the answer (Finglish or Persian); mic errors say "you can type instead" | `mission/AnswerInput.tsx:60-63`, `:73-88` |
| Scenes | Every line in text, English on demand | **Skip**; without recognition "lines aren't scored" | `scene/ScenePlayer.tsx:286-296` |
| SAMFA speaking | Prompt in text | Without recognition: "say your answer aloud on your own" then **I've answered**; self-marking rubric | `samfa/Practice.tsx:437-443`, `:463` |
| SAMFA listening | Transcript only after answering ("Show what was said") | — | `samfa/Practice.tsx:106-117` |
| Say it dialog | Text, transliteration, meaning | Close; nothing is required | `SayItButton.tsx:97-130` |

### 2.16 Learning-specific accessibility

**Deaf and hard-of-hearing learners**

- Works today: every vocabulary, grammar, reading, mission and scene item shows its text; audio never replaces text. Listening practice is the exception by design.
- Barriers: SAMFA listening (`samfa/Practice.tsx:63-130`) has no route for a learner who cannot hear: the text is hidden until answers are submitted and plays are limited to two (`:94`). Hands-free mode (`/app/listen`) is audio-led by nature.
- Speaking feedback is visual (coloured letters, scores, mouth diagram), which suits learners who cannot hear their own recording well.

**Learners who cannot or prefer not to speak**

- Missions accept typing; speak rounds and scenes offer Skip; SAMFA speaking offers a self-marked path.
- The overview's promise of "a typing alternative for every speaking task" (`00-overview.md:38`) is only true for missions (Gap 6).

**Dyslexia and a new script**

- Script settings let a learner lead with transliteration, lead with Persian, or hide transliteration (see 09 §2.6).
- Answer checking forgives typing errors that are not about knowledge: case, punctuation, spaces, half-spaces, Arabic letter forms and accents are ignored (`answer.ts:40-57`); near misses count as "almost" with a spelling nudge.
- Spelling suggestions treat sound-alike Persian letters (س/ص/ث, ز/ذ/ض/ظ…) as smaller mistakes (`spell.ts:1-16`).
- Persian has loose leading (2 to 2.3 in passages) and the dotted DOTS style for running text.
- Not yet available: a text-size or spacing control inside the app (browser zoom is the only route), a reading ruler or line focus, and a plain (undotted) Persian option for learners who find it easier.

**Timers in SAMFA**

| Task | Timer | What happens at zero | Can the learner adjust? | Source |
|---|---|---|---|---|
| Reading | 6 (mock) or 8 minutes | Message "Time's up — answer what you can and check"; nothing locks | No | `samfa/Practice.tsx:133-150`, `samfa/page.tsx:55` |
| Writing | 15 or 20 minutes (`task.minutes`) | Timer turns `anar-ink` at ≤30s; the textarea stays editable | No | `samfa/Practice.tsx:31`, `:212`, `content/samfa.ts` |
| Speaking prep | 30 or 45 seconds | Moves on to the speaking step; **I'm ready** skips early | Skip only | `samfa/Practice.tsx:355`, `:415` |
| Speaking answer | 60 or 90 seconds | Recording stops at the limit | No | `samfa/Practice.tsx:371` |
| Listening | No timer; two plays | Play button disables | No | `samfa/Practice.tsx:94` |

The timer is `role="timer"`, so it is not announced every second. Reading and writing timers are advisory (WCAG 2.2.1 is met because nothing is lost at zero); the speaking limit and the two-play limit mirror the real exam but are not adjustable.

**Motor**

- Letter tracing is pointer-only (`TraceCanvas.tsx`); path-based drawing is exempt from WCAG 2.1.1, and tracing is optional.
- On-screen keyboard keys are out of the tab order (`PersianKeyboard.tsx:24`); keyboard users type with their own keyboard, in Persian or Finglish.

### 2.17 Audit history

| Date | Commit | Audit or change | What changed |
|---|---|---|---|
| 2026-11-02 | 15aefcc | **Hallmark audit** (rendered checks of every main route at eight widths, manual review at 375px) | No sideways scroll at 320px; `overflow-x: clip`; tab labels 11px sentence case; `field-edge` token (3:1) for inputs and selects; readable `muted` disabled labels; segmented options 40px and no wrap; 11px minimum form labels; balanced headings. Findings that contradict the design system (eyebrows, lesson emoji, dashes in copy) kept by design. |
| 2026-11-09 | ae7f32a | Apple-style redesign | Reduced motion, reduced transparency and more contrast handled; no looping animations; sentence-case buttons |
| 2026-11-09 | bbbe424 | Design bug fixes | Focus rings for keyboard navigation only; hover only on hover-capable devices; 16px `select`; segmented selection visible in dark mode |
| 2026-11-09 | e9c9ef8 | Floating glass tab bar | Glass turns solid when transparency is reduced or blur is unsupported; pill motion off under reduced motion. Tab labels went from 11px to 10px (regression, Gap 4) |
| 2026-11-09 | 745b1b7 | **axe audit** | Progress bars named; scene cast avatars `role="img"`; darker light-mode firuze, sky, pista and secondary text for 4.5:1; tab label uses `sky-ink`; banner buttons darken instead of lighten; chart bars inside the `aria-hidden` chart no longer focusable (table carries the data); landing page content in `<main>`; manifest colours match the light canvas |

## 3. Usage: do and don't

| Do | Don't |
|---|---|
| Use `-ink` text on `-soft` fills and `on-accent` on solid fills | Put `text-on-accent` on `bg-saffron` in light mode, or use `faint` for anything a learner must read |
| Give every icon-only button an `aria-label` that names the action ("Play this line") | Rely on `title` alone; it never reaches touch or most screen readers |
| Pair every colour state with an icon or word | Mark right and wrong by green and red only |
| Use `btn`, `btn-icon` or `btn-lg` for anything tapped often | Use `btn-sm` for primary session actions |
| Add `role="status"` to text that changes after an action | Announce timers or progress every second |
| Hide a chart with `aria-hidden` and add an `sr-only` table | Leave bars focusable or unlabeled |
| Give speaking tasks a Skip and, where possible, a typed route | Block progress on the microphone |
| Keep inputs at 16px or more | Shrink inputs with `!text-sm` |
| Use native `<dialog>` with `showModal()` and a labelled close button | Build modal overlays from `div`s |
| Test with keyboard only, at 320px, and with the three media preferences on | Ship after checking only with a mouse on desktop |

## 4. Accessibility notes

What this area must guarantee on every release.

**Per-release accessibility checklist**

1. **Contrast.** No new hard-coded colours; any new token pair checked (text 4.5:1, large text and UI parts 3:1) in light and dark.
2. **Keyboard.** Every new control reachable with Tab, operable with Enter/Space, with a visible focus ring; no keyboard traps; Esc closes dialogs.
3. **Names.** Every icon-only button has an `aria-label`; every input has a label or `aria-label`; new dialogs have a name.
4. **State.** Correct / wrong / selected / done carry an icon or text as well as colour.
5. **Announcements.** Results and errors that appear after an action sit in `role="status"` (or `role="alert"` for errors).
6. **Targets.** New tap targets ≥ 44px (segmented 40px is the only agreed exception).
7. **Reflow.** Each changed screen at 320px and 375px: no horizontal scroll, nothing hidden under the tab bar.
8. **Preferences.** Reduced motion, reduced transparency and more contrast switched on: nothing moves, floating chrome is solid, edges are visible.
9. **Persian.** All Persian in `<Fa>` or `lang="fa"` (see 09); no letter-spacing or uppercase on Persian.
10. **Audio and speech.** Any new audio has on-screen text; any new speaking task has Skip and, where it can, a typed answer.
11. **Charts.** Any new chart has a text or table alternative.
12. **Automated check.** Run axe on changed routes in both themes *(proposed until CI runs it)*.

## 5. Code reference

| Area | Files |
|---|---|
| Tokens, focus ring, media queries, field edge | `src/app/globals.css` |
| Input-mode script, `lang`, viewport | `src/app/layout.tsx` |
| Primitives with built-in semantics | `src/components/ui.tsx` (`ProgressBar`, `Segmented`, `FeedbackSheet`, `AudioButtons`, `BookmarkButton`, `SessionHeader`) |
| Landmarks and navigation | `src/components/AppNav.tsx`, `src/app/app/layout.tsx` |
| Keyboard shortcuts | `src/components/ChoiceRound.tsx`, `src/components/FlashcardSession.tsx`, `src/components/GrammarLesson.tsx` |
| Dialogs | `src/components/SayItButton.tsx`, `src/components/YouglishPlayer.tsx`, `src/app/app/sounds/page.tsx` |
| Charts with tables | `src/app/app/progress/page.tsx` |
| Speech alternatives | `src/components/mission/AnswerInput.tsx`, `src/components/SpeakRound.tsx`, `src/components/scene/ScenePlayer.tsx`, `src/components/samfa/Practice.tsx` |
| Answer forgiveness | `src/lib/answer.ts`, `src/lib/spell.ts` |

## 6. Gaps and recommendations

**P0**

1. **Single-key shortcuts cannot be turned off (WCAG 2.1.4, Level A).** 1–4 and A–D (`ChoiceRound.tsx:79-80`), 1–9 (`GrammarLesson.tsx:214-216`) and 1–3 (`FlashcardSession.tsx:122-124`) are listened for on `window`. Speech-input users who say a letter or number can pick an answer by accident. *(proposed)* Add a "Keyboard shortcuts" switch in Settings, or require focus inside the option group.

**P1**

2. **Reduced motion does not stop loops.** The global rule shortens duration to 0.01ms but leaves `animation-iteration-count` infinite (`globals.css:166-173`), so `animate-pulse`, `animate-ping` and `animate-spin` keep cycling every frame. *(proposed)* Add `animation-iteration-count: 1 !important` and replace the pulse/ping on playing and listening buttons with a static state (also matches the skill's "no loops", `SKILL.md:97`). Verify in a browser.
3. **White on saffron is 2.25:1 in light mode.** Reward circles (`LessonSession.tsx:283`, `FlashcardSession.tsx:324`, `speak/page.tsx:50`, `bookmarks/page.tsx:49`, `sounds/page.tsx:132`, `practice/page.tsx:85`), done lesson nodes (`lessons/page.tsx:13`), checklist checks (`app/page.tsx:79`) and mission mastered (`MissionSession.tsx:80`). *(proposed)* Use `saffron-ink` icons on `saffron-soft`, or a dark `on-saffron` token.
4. **Tab labels are 10px.** The Hallmark fix set 11px; e9c9ef8 reduced it to `text-[10px]` (`AppNav.tsx:166`), below the 11px minimum. *(proposed)* Return to 11px.
5. **Focus ring below 3:1.** At 70% sky the ring measures about 2.95:1 on cards and 2.76:1 on the light canvas (`globals.css:146`). The skill describes it as "3px sky outline" (`SKILL.md:110`). *(proposed)* Use solid `sky` (4.80:1 on white).
6. **Typing alternative is promised but partial.** Overview: "a typing alternative for every speaking task" (`00-overview.md:38`). Only missions have one; speak rounds, scenes and SAMFA speaking offer Skip or self-marking. *(proposed)* Add "Type it instead" to speak rounds and scenes, scored with the mission checker; or correct the overview.
7. **SAMFA listening has no non-audio route.** *(proposed)* An "I can't use audio" option that skips the part without scoring it, and an untimed, unlimited-play practice mode outside the mock.
8. **Dialog focus return.** Closing by X or backdrop unmounts the `<dialog>` without `close()` (`SayItButton.tsx:23`, `YouglishPlayer.tsx:109`), so focus may fall to `<body>`. *(proposed)* Call `close()` and refocus the opener. Verify with a keyboard.
9. **No automated accessibility tests.** The two audits were one-offs; CI runs only unit tests. *(proposed)* Run axe (for example through Playwright) on the main routes in light and dark on every pull request.
10. **SAMFA timers cannot be extended.** Reading and writing are advisory, but the speaking limit (`samfa/Practice.tsx:371`) and two-play listening limit are fixed. *(proposed)* "Untimed practice" toggle for practice (not the mock), useful for learners with processing or motor needs.

**P2**

11. **`btn-sm` is 36px** and used 69 times; SAMFA rubric marks are 40px (`samfa/Practice.tsx:177`). *(proposed)* Raise `btn-sm` to 40px minimum and keep it off primary actions.
12. **No skip link.** Landmarks satisfy WCAG 2.4.1, but desktop keyboard users tab through the full sidebar. *(proposed)* "Skip to content" link before `AppNav`.
13. **Segmented is a radiogroup without arrow keys.** Each option is a tab stop (`ui.tsx:164-180`), unlike the ARIA radio pattern. *(proposed)* Roving tabindex with arrow keys, or drop the radio roles and use `aria-pressed` buttons.
14. **Edges and placeholders.** `field-edge` is 2.92:1 against the light canvas where inputs sit on the page (for example `words/page.tsx:205`); placeholders use `faint` (2.57:1). *(proposed)* Darken light `field-edge` slightly; never put instructions only in placeholders.
15. **Hidden information in alphabet tiles.** The traced check and the "Unique to Persian" dot (`alphabet/page.tsx:76-81`) are not in the tile's `aria-label`. *(proposed)* Append ", traced" and ", unique to Persian".
16. **Persian keyboard semantics.** The container has `aria-label` but no role (`PersianKeyboard.tsx:20`); keys are `tabIndex={-1}`. *(proposed)* `role="group"`; keep keys out of the tab order.
17. **Smooth scrolling and backdrop blur ignore preferences.** `scrollIntoView({ behavior: "smooth" })` in three places (`scene/ScenePlayer.tsx:80`, `alphabet/page.tsx:65`, `tutor/page.tsx:102`) and the dialog backdrop blur (`globals.css:606-609`) are not covered by the media queries. *(proposed)* Use `auto` under reduced motion; drop the blur under reduced transparency.
18. **Dyslexia supports.** *(proposed)* In-app text size, a plain-dots Persian option (DOTS 0 everywhere), and line focus for reading passages.
