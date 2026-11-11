# 05 · Materials and motion

The translucent layers that float over content, and every animation and transition the app uses: what moves, when, for how long and on which curve.

## 1. Principles

- **Materials show hierarchy, not decoration.** Floating chrome (top bar, session header, bottom bars, tab bar) is translucent so content stays visible underneath. Structural regions (sidebar) are solid. Nothing translucent sits on something else translucent.
- **Legibility beats effect.** `glass` is mostly opaque (62% / 66%). When transparency is reduced, or blur is not supported, every material falls back to the solid card colour.
- **Respond on pointer-down.** Buttons and tiles scale down within 60ms of the press, not on release.
- **Settle, never bounce.** UI motion uses a critically damped curve (`--ease-spring`), sheets use the iOS sheet curve (`--ease-sheet`). No overshoot on things that simply appear.
- **Nothing loops for decoration.** Motion explains a change of state; it never runs on its own to attract attention.
- **Reduced motion means instant.** With `prefers-reduced-motion: reduce`, transitions and animations collapse to near zero.

## 2. Specification

### 2.1 Materials

| Utility | Background | Backdrop filter | Edge / shadow | Used on | Source |
|---|---|---|---|---|---|
| `material` | `color-mix(card 72%, transparent)` | `blur(20px) saturate(180%)` | none (callers add `border-t border-line`) | FeedbackSheet idle bar, flashcard, scene, reading and placement bottom bars, tutor composer | `src/app/globals.css:437-441`; `src/components/ui.tsx:265`, `src/components/FlashcardSession.tsx:271`, `src/components/scene/ScenePlayer.tsx:248`, `src/components/reading/ReadingLessonView.tsx:79`, `src/app/app/placement/page.tsx:152`, `src/app/app/tutor/page.tsx:299` |
| `material-canvas` | `color-mix(canvas 78%, transparent)` | `blur(20px) saturate(180%)` | none (callers add `border-b border-line` on the top bar) | Mobile top bar (`max-lg:` only), SessionHeader, RecallRound header | `src/app/globals.css:442-446`; `src/components/AppNav.tsx:117`, `src/components/ui.tsx:213`, `src/components/RecallRound.tsx:254` |
| `glass` | `color-mix(card var(--glass-opacity), transparent)` | `blur(24px) saturate(190%)` | 1px `--glass-edge`; `inset 0 1px 0 --glass-highlight`; `0 8px 28px rgb(0 0 0/--glass-shadow)`; `0 1px 4px` at half that | Phone tab bar, lesson preview action bar | `src/app/globals.css:451-460`; `src/components/AppNav.tsx:128`, `src/components/LessonSession.tsx:86` |

Glass variables (`src/app/globals.css:40-44`, dark `193-197` and `231-235`):

| Variable | Light | Dark | Role |
|---|---|---|---|
| `--glass-opacity` | 62% | 66% | How much card colour is in the fill |
| `--glass-edge` | `rgb(255 255 255/0.6)` | `rgb(255 255 255/0.1)` | 1px border |
| `--glass-highlight` | `rgb(255 255 255/0.75)` | `rgb(255 255 255/0.12)` | Bright top edge (inset shadow) |
| `--glass-shadow` | 0.12 | 0.5 | Alpha of the drop shadow |
| `--glass-pill` | `rgb(0 0 0/0.06)` | `rgb(255 255 255/0.1)` | Fill of the tab bar's sliding pill |

The tab pill is not a separate material: it is a `--glass-pill` fill with `rounded-[1.5rem]` and an inset `--glass-highlight` top edge, sitting under the tab links (`src/components/AppNav.tsx:132-139`).

### 2.2 Solid fallbacks

| Condition | Effect | Source |
|---|---|---|
| `@media (prefers-reduced-transparency: reduce)` | `.glass`, `.material`, `.material-canvas` get `background: var(--color-card)` and no backdrop filter | `src/app/globals.css:531-539` |
| `@supports not (backdrop-filter: blur(1px))` (and not the `-webkit-` form) | Same three utilities get `background: var(--color-card)` | `src/app/globals.css:541-547` |
| `@media (prefers-contrast: more)` | `--color-line` becomes `--color-field-edge`, so material hairlines and tile borders get stronger | `src/app/globals.css:548-551` |

Glass keeps its border and shadow in both fallbacks, so it still reads as a raised layer.

### 2.3 Dialogs and backdrop

| Part | Spec | Source |
|---|---|---|
| Element | Native `<dialog>` opened with `showModal()` (top layer, focus trapped, Esc closes) | `src/components/SayItButton.tsx:52,97`, `src/components/YouglishPlayer.tsx:118,126`, `src/app/app/sounds/page.tsx:278,282` |
| Surface | `card m-auto !rounded-[1.75rem] p-0 overflow-y-auto` | same lines |
| Size | `w-[min(32rem,calc(100vw-2rem))]` (video: `min(48rem,…)`), `max-h-[calc(100dvh-2rem)]` | same lines |
| Entrance | `animate-pop` (scale 0.96 → 1, opacity 0 → 1, 280ms `--ease-spring`) | same lines |
| Backdrop dim | `backdrop:bg-black/40` on each dialog | same lines |
| Backdrop blur | Global `dialog::backdrop { backdrop-filter: blur(4px) }` | `src/app/globals.css:606-609` |
| Exit | None: the dialog disappears instantly on close | — |

### 2.4 Bottom sheets and the grabber

| Part | Spec | Source |
|---|---|---|
| FeedbackSheet, idle | Fixed bar: `material border-t border-line`, `z-40`, padded into the safe area; holds the main action | `src/components/ui.tsx:261-266` |
| FeedbackSheet, answered | Same position; becomes `rounded-t-[1.75rem]` with `shadow-[0_-12px_40px_rgb(0_0_0/0.14)]`, background `color-mix(in srgb, var(--color-pista or anar) 14%, var(--color-card))` (opaque), and enters with `animate-slide-up` | `src/components/ui.tsx:265-267` |
| Result icon | 44px circle (`size-11 bg-card`) with a 32px `CheckCircle2` / `XCircle`, enters with `animate-pop` | `src/components/ui.tsx:273-274` |
| Grabber | **Not implemented anywhere in `src`.** The sheet is not draggable. | grep for "grabber" returns nothing |

### 2.5 Easing variables

| Token | Value | Use | Source |
|---|---|---|---|
| `--ease-spring` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default UI curve: press scale, pop-in, tab pill, progress fill | `src/app/globals.css:96` |
| `--ease-sheet` | `cubic-bezier(0.32, 0.72, 0, 1)` | Sheets sliding up | `src/app/globals.css:97` |
| `ease` (CSS keyword) | — | Colour, filter, border and shadow changes; theme background | `src/app/globals.css:139,285-286,396-398,482-483` |
| `ease-in-out` | — | Wrong-answer shake | `src/app/globals.css:598` |
| Tailwind default | `cubic-bezier(0.4, 0, 0.2, 1)`, 150ms | Any `transition-*` class without `duration-`/`ease-` | `node_modules/tailwindcss/theme.css:492-493` |

### 2.6 Keyframe animations

| Utility | Keyframes | Duration | Easing | Fill | Source |
|---|---|---|---|---|---|
| `animate-pop` | `pop-in`: scale 0.96 → 1, opacity 0 → 1 | 280ms | `--ease-spring` | `both` | `src/app/globals.css:559-568,591-593` |
| `animate-slide-up` | `slide-up`: translateY 100% → 0 | 420ms | `--ease-sheet` | `both` | `src/app/globals.css:569-576,594-596` |
| `animate-shake` | `shake`: 0 → −5px → 5px → −5px → 5px → 0 (20/40/60/80%) | 320ms | `ease-in-out` | none | `src/app/globals.css:577-590,597-599` |
| `animate-bob` | No animation. Only `transform: translateX(-50%)` (kept to centre the old bobbing bubble) | — | — | — | `src/app/globals.css:600-603` |
| `animate-spin` (Tailwind) | rotate 360°, infinite | 1s | linear | — | `node_modules/tailwindcss/theme.css:438` |
| `animate-pulse` (Tailwind) | opacity 1 → 0.5 → 1, infinite | 2s | `cubic-bezier(0.4,0,0.6,1)` | — | `node_modules/tailwindcss/theme.css:440,457-461` |
| `animate-ping` (Tailwind) | scale → 2, opacity → 0, infinite | 1s | `cubic-bezier(0,0,0.2,1)` | — | `node_modules/tailwindcss/theme.css:439,449-455` |

Where they are used:

- `animate-pop` (27 uses): result medallions (`size-24` circles), StatCards (`src/components/ui.tsx:297`), XP chips, dialogs, revealed answers (`src/components/FlashcardSession.tsx:186`), scene lines (`src/components/scene/ScenePlayer.tsx:203,214`), hints (`src/components/GrammarLesson.tsx:308`), the ReportButton panel (`src/components/ReportButton.tsx:99`).
- `animate-slide-up`: only the answered FeedbackSheet (`src/components/ui.tsx:265`).
- `animate-shake`: wrong answers on tiles and inputs (`src/components/ChoiceRound.tsx:147`, `src/components/RecallRound.tsx:165`, `src/components/GrammarLesson.tsx:268,290`, `src/components/mission/AnswerInput.tsx:77`).
- `animate-spin`: `Loader2` / `RefreshCw` loading icons (14 uses, for example `src/components/SyncCard.tsx:165`).
- `animate-pulse`: audio button while playing (`src/components/ui.tsx:102,118`), playback buttons (`src/components/PronunciationFeedback.tsx:165-173`), the contact point on every mouth diagram (`src/components/MouthDiagram.tsx:99`).
- `animate-ping`: a ring behind the mic while listening (`src/components/scene/ScenePlayer.tsx:304`, `src/components/SayItButton.tsx:122`, `src/components/SpeakRound.tsx:174`).

### 2.7 Press feedback

| Element | Pressed state | Press-in | Release | Source |
|---|---|---|---|---|
| `btn` and every variant | `scale(0.97)` + `brightness(0.94)` | 60ms | 160ms (transform on `--ease-spring`, filter `ease`) | `src/app/globals.css:283-297` |
| `btn` hover (real pointers only, `@media (hover: hover)`) | `brightness(1.06)`; `btn-secondary` and `btn-ghost` change fill instead | 160ms | 160ms | `src/app/globals.css:288-292,331-353` |
| `tile` (only when it is an `a` or `button`) | `scale(0.98)` | 60ms | 180ms `--ease-spring` | `src/app/globals.css:394-407` |
| Tab link | `scale(0.95)` | 200ms (Tailwind default curve) | 200ms | `src/components/AppNav.tsx:169` |
| Sidebar link | `scale(0.98)` | instant (`transition-colors` does not include transform) | instant | `src/components/AppNav.tsx:157` |
| Feedback rating faces | `scale(0.9)` | 150ms default | 150ms | `src/components/FeedbackCard.tsx:62` |
| Persian keyboard key | `translate-y-[3px]` + `shadow-none` | 75ms | 75ms | `src/components/PersianKeyboard.tsx:16` |
| Lesson path node | `translate-y-1.5` + `shadow-none`, hover `brightness-105` | 100ms | 100ms | `src/app/app/lessons/page.tsx:71-72` |
| Pronunciation syllable chip | `translate-y-0.5` | 150ms default | 150ms | `src/components/PronunciationFeedback.tsx:145` |

`-webkit-tap-highlight-color: transparent` removes the grey tap flash on buttons and links (`src/app/globals.css:141-144`); `touch-action: manipulation` on `btn` and `tile` removes the double-tap zoom delay.

### 2.8 Motion table

| Element | Trigger | Property | Duration | Easing | Source |
|---|---|---|---|---|---|
| Button | pointer down | transform scale 0.97, filter brightness 0.94 | 60ms | `--ease-spring` / `ease` | `src/app/globals.css:293-297` |
| Button | release | back to rest | 160ms | `--ease-spring` / `ease` | `src/app/globals.css:283-286` |
| Button | hover (pointer devices) | filter brightness 1.06 or fill colour | 160ms | `ease` | `src/app/globals.css:288-292` |
| Tile | pointer down / release | scale 0.98 | 60ms / 180ms | `--ease-spring` | `src/app/globals.css:395,404-407` |
| Tile | state change (selected, correct, wrong, current), hover | border, background, box-shadow | 100ms | `ease` | `src/app/globals.css:396-398` |
| Input, select | focus | border colour, 4px sky focus ring | 160ms | `ease` | `src/app/globals.css:481-487,511-518` |
| Segmented control | selection | background, colour, shadow | 200ms | Tailwind default | `src/components/ui.tsx:173` |
| Tab pill | route change | translateX by 100% per tab | 420ms | `--ease-spring` | `src/components/AppNav.tsx:135` |
| Tab link | press, active change | scale 0.95, colour | 200ms | Tailwind default | `src/components/AppNav.tsx:169` |
| Progress bar fill | value change | width | 500ms | `--ease-spring` | `src/components/ui.tsx:45` |
| Pronunciation score ring | score shown | stroke-dashoffset | 500ms | Tailwind default | `src/components/PronunciationFeedback.tsx:61` |
| Section chevron (Path / Sound path) | expand / collapse | rotate 180° | 300ms / 150ms | Tailwind default | `src/app/app/path/page.tsx:104`, `src/components/SoundPath.tsx:98` |
| Home content | hydration | opacity 0 → 1 | 150ms | Tailwind default | `src/app/app/page.tsx:18` |
| Hands-free Persian line | reveal | opacity | 150ms | Tailwind default | `src/components/HandsFree.tsx:286` |
| Result medallion, StatCard, chip, hint, dialog | mount | scale 0.96 → 1, opacity | 280ms | `--ease-spring` | `src/app/globals.css:591-593` |
| FeedbackSheet | answer checked | translateY 100% → 0 | 420ms | `--ease-sheet` | `src/app/globals.css:594-596`, `src/components/ui.tsx:265` |
| Wrong option / input | wrong answer | translateX ±5px, 4 swings | 320ms | `ease-in-out` | `src/app/globals.css:597-599` |
| Page background | theme change | background-color | 300ms | `ease` | `src/app/globals.css:138-139` |
| Loader icon | loading | rotate, infinite | 1s | linear | Tailwind `animate-spin` |
| Audio button | playing | opacity pulse, infinite | 2s | Tailwind pulse curve | `src/components/ui.tsx:102,118` |
| Mic ring | listening | scale + fade, infinite | 1s | Tailwind ping curve | `src/components/SpeakRound.tsx:174` |
| Mouth diagram contact point | always | opacity pulse, infinite | 2s | Tailwind pulse curve | `src/components/MouthDiagram.tsx:99` |
| Scene current line, tutor reply, alphabet detail | new item / tap | smooth scroll into view | browser | browser | `src/components/scene/ScenePlayer.tsx:80`, `src/app/app/tutor/page.tsx:102`, `src/app/app/alphabet/page.tsx:65` |

### 2.9 Theme colour transition

Theme changes set or remove `html[data-theme]` (`src/lib/store.ts:221-227`). Only `body` eases its `background-color` over 300ms (`src/app/globals.css:138-139`); cards, text and accents switch at once.

### 2.10 Reduced motion

| Mechanism | Effect | Source |
|---|---|---|
| Global rule under `@media (prefers-reduced-motion: reduce)` | `animation-duration: 0.01ms !important; transition-duration: 0.01ms !important` on every element and pseudo-element | `src/app/globals.css:166-173` |
| `motion-reduce:transition-none` | Tab pill jumps instead of sliding | `src/components/AppNav.tsx:135` |
| JS smooth scrolling | Not covered: `scrollIntoView({ behavior: "smooth" })` ignores the CSS rule | see 2.8 |

### 2.11 The "no loops, no overshoot" rules

- `--ease-spring` has no overshoot: all control points stay within 0–1 on the progress axis.
- `pop-in` starts at 0.96, not below, and never goes past 1.
- The old looping "bob" was removed; `animate-bob` only centres (`src/app/globals.css:600-603`).
- Allowed exceptions in practice (not written down anywhere): loading spinners, the audio "playing" pulse and the mic "listening" ring. These show a live system state and stop when it ends. The mouth-diagram pulse is not a state and breaks the rule (see Gaps).

## 3. Usage: do and don't

| Do | Don't |
|---|---|
| Use `material` / `material-canvas` for bars that content scrolls under, with a hairline border | Use `bg-card/80` or a hand-written `backdrop-blur` |
| Use `glass` for floating controls that sit above other chrome-free content | Put `glass` or `material` inside another translucent layer |
| Open modals with `showModal()` and `animate-pop`, `!rounded-[1.75rem]`, `backdrop:bg-black/40` | Build a fixed-position overlay `div` for a modal |
| Use `animate-slide-up` only for things that come from the bottom edge | Slide a centred dialog, or pop a bottom sheet |
| Use `animate-shake` once, on the element that was wrong | Shake the whole screen or repeat the shake |
| Give press feedback with the `btn` / `tile` utilities (scale, 60ms) | Use `active:translate-y-*` or `active:shadow-none` to fake a pressed 3D key |
| Show live state with a loop only while the state lasts (loading, listening) | Loop anything decorative (pulsing hints, bouncing badges) |
| Add `motion-reduce:` for JS-driven or long transitions | Rely on duration alone for meaning (for example, a timed reveal with no other cue) |

## 4. Accessibility notes

- **Reduce transparency:** every material must become opaque. New translucent surfaces must be added to the fallback lists in `globals.css` 531-547.
- **Reduce motion:** all CSS motion collapses; JS scrolling and timed reveals must check `matchMedia("(prefers-reduced-motion: reduce)")` themselves.
- **No flashing:** nothing may flash more than three times a second; the 1s ping and 2s pulse are within limits at normal speed.
- **Focus:** dialogs trap focus natively; the answered FeedbackSheet moves focus to Continue (`autoFocus`, `src/components/ui.tsx:281`) and announces itself with `role="status"`.
- **Text over materials:** body text on `material`/`glass` must keep 4.5:1 against the worst-case content behind it; the 62–78% fills plus blur are chosen for that, and the solid fallbacks guarantee it.
- **State is never motion-only:** a shake always comes with the wrong colour, an icon and text in the FeedbackSheet.

## 5. Code reference

- `src/app/globals.css` — `--ease-spring`, `--ease-sheet`, `--glass-*`, `material`, `material-canvas`, `glass`, keyframes `pop-in`, `slide-up`, `shake`, utilities `animate-pop`, `animate-slide-up`, `animate-shake`, `animate-bob`, `dialog::backdrop`, reduced-motion / reduced-transparency / contrast rules, `btn` and `tile` press states.
- `src/components/ui.tsx` — `FeedbackSheet`, `SessionHeader`, `ProgressBar`, `Segmented`, `AudioButtons`.
- `src/components/AppNav.tsx` — tab bar glass, sliding pill.
- `src/components/SayItButton.tsx`, `src/components/YouglishPlayer.tsx`, `src/app/app/sounds/page.tsx` — the three modal dialogs.

## 6. Gaps and recommendations

**P1**
- **Reduced motion does not stop infinite loops.** The global rule shortens `animation-duration` to 0.01ms but leaves `animation-iteration-count: infinite`, so `animate-pulse`, `animate-ping` and `animate-spin` keep cycling at very high speed. This can show as flicker. *(proposed)* Add `animation-iteration-count: 1 !important` to the rule in `src/app/globals.css:166-173`, and give spinners a static alternative.
- **The skill promises a grabber that does not exist.** Skill §7 says bottom sheets "show a grabber"; no component draws one, and the only sheet (FeedbackSheet) is not draggable. *(proposed)* Either remove the line from the skill, or define a grabber (36×5px capsule, `bg-line-strong`, 6px from the top) and use it only on sheets that can be dragged.
- **The mouth-diagram pulse is a decorative loop.** `animate-pulse` runs forever on the contact point (`src/components/MouthDiagram.tsx:99`), against the "no looping animations" rule. *(proposed)* Use a static saffron halo, or pulse once with `animate-pop`.
- **Broken `animate-bob` on the poetry icon.** While the Divan is opening, `BookHeart` gets `animate-bob` (`src/app/app/poetry/page.tsx:65`), which now only applies `translateX(-50%)`, so the icon jumps half its width to the left. *(proposed)* Remove the class; the button's spinner text already shows progress.
- **Status loops are undocumented.** The skill bans loops, but spinners, the audio pulse and the mic ping are used in 20+ places. *(proposed)* Write the exception into the skill: "loops only for a live system state (loading, playing, listening), stopped when the state ends."

**P2**
- **Leftover 3D press effects.** Keyboard keys (`active:translate-y-[3px] active:shadow-none`, and a comment still describing a "2px border plus a 3px bottom edge", `src/components/PersianKeyboard.tsx:14-16`), lesson path nodes (`group-active:translate-y-1.5`, `src/app/app/lessons/page.tsx:72`) and syllable chips (`active:translate-y-0.5`, `src/components/PronunciationFeedback.tsx:145`) sink instead of scaling. *(proposed)* Use `active:scale-[0.97]` with the 60ms press timing.
- **Tab press uses 200ms, not 60ms.** `TAB` puts `transition-[color,transform] duration-200` on the press scale (`src/components/AppNav.tsx:169`), so the press feels late. *(proposed)* Add `active:duration-[60ms]`, like `btn` and `tile`.
- **Dialogs have no exit animation**, and the skill says "enter and exit along the same path". *(proposed)* Reverse `pop-in` on close (for example with `@starting-style` and `transition-behavior: allow-discrete`), collapsed under reduced motion.
- **Dialogs are solid, not "a material".** The comment above `dialog::backdrop` says dialogs "arrive as a material" (`src/app/globals.css:605`) but they use `card`. Solid is the right call for legibility; fix the comment.
- **Smooth scrolling ignores reduced motion** (`src/components/scene/ScenePlayer.tsx:80`, `src/app/app/tutor/page.tsx:102`, `src/app/app/alphabet/page.tsx:65`). *(proposed)* Use `behavior: "auto"` when the user prefers reduced motion.
- **Theme transition is partial.** Only `body` eases; cards and text snap, which can look like a flash on long pages. Either accept and document it, or use a View Transition cross-fade *(proposed)*.
- **`prefers-reduced-transparency` support is uneven across browsers.** Verify on Safari / iOS; if unsupported there, iOS users with Reduce Transparency still get blur *(proposed check)*.
- **Grammar sticky bar uses a gradient fade** (`bg-linear-to-t from-card`, `src/components/GrammarLesson.tsx:134`) instead of a material, on a canvas-coloured page. *(proposed)* Use the `glass` action bar from `src/components/LessonSession.tsx:86`.
- **No duration tokens.** 60, 160, 180, 280, 320, 420 and 500ms are literals in several files. *(proposed)* Add `--duration-press: 60ms`, `--duration-quick: 160ms`, `--duration-pop: 280ms`, `--duration-sheet: 420ms`.
