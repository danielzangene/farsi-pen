# 04 · Layout, spacing and elevation

How Farsi Pen places content on the screen: breakpoints, column widths, spacing, corner radii, depth, safe areas and stacking order.

## 1. Principles

- **Phone first, one column.** Every screen is designed at 375px and then widened. Only one breakpoint changes the app's structure: `lg` (1024px), where the floating tab bar becomes a solid sidebar.
- **Content sets the width.** Each page type has its own reading width (`max-w-xl` to `max-w-3xl`) inside a `max-w-5xl` shell. Lines of text stay short; nothing stretches edge to edge on a desktop.
- **Grouped surfaces on a soft canvas.** Depth comes from a few fixed levels (canvas, card, material, glass, sheet, dialog). Shadows are faint, never decorative and never a hard "lip".
- **Floating chrome never hides content.** The tab bar and bottom action bars float over content, so pages reserve space for them with fixed offsets that include the safe area.
- **Consistent rhythm.** A 4px grid, with most spacing taken from a short list of steps (8, 12, 16, 20, 24px).

## 2. Specification

### 2.1 Breakpoints

Tailwind 4 defaults are used unchanged (`node_modules/tailwindcss/theme.css:327-331`). No custom breakpoints are defined in `src/app/globals.css`.

| Prefix | Min width | Uses in `src/**/*.tsx` | What it does in practice |
|---|---|---|---|
| (none) | 0 | — | Phone layout: single column, full-width buttons, floating tab bar |
| `sm:` | 640px (40rem) | 182 | Small refinements: `sm:grid-cols-2/3/4`, `sm:p-6`/`sm:p-8`, `sm:w-auto` on buttons, `sm:flex-row(-reverse)` for button pairs, `sm:pt-10/12` on result screens, `sm:text-4xl` headings |
| `md:` | 768px (48rem) | 8 | Landing page only (`src/app/page.tsx:152,157,221,233`) plus one stray use in `src/components/GrammarLesson.tsx:134` |
| `lg:` | 1024px (64rem) | 23 | Structural switch: sidebar on, tab bar off, top bar becomes static (`src/components/AppNav.tsx:97,117,118,128`, `src/app/app/layout.tsx:10,14`) |
| `xl:`, `2xl:` | 1280 / 1536px | 0 | Not used |

The `lg` switch in detail:

| Element | Below `lg` | At `lg` and up | Source |
|---|---|---|---|
| Sidebar | `hidden` | `lg:flex`, fixed, `w-64` | `src/components/AppNav.tsx:97` |
| App shell | no offset | `lg:pl-64` | `src/app/app/layout.tsx:10` |
| Top bar | sticky, `material-canvas`, `h-14`, hairline `border-b` | `lg:static lg:border-0 lg:h-auto lg:pt-5 lg:justify-end` (stat chips only) | `src/components/AppNav.tsx:117-118` |
| Tab bar | floating glass capsule | `lg:hidden` | `src/components/AppNav.tsx:128` |
| Page bottom padding | `pb-[calc(7.5rem+env(safe-area-inset-bottom))]` | `lg:pb-12` | `src/app/app/layout.tsx:14` |
| Sticky action bars | `bottom-[calc(5.25rem+env(safe-area-inset-bottom))]` | `lg:bottom-4` | `src/components/LessonSession.tsx:86`, `src/app/app/tutor/page.tsx:299` |
| Alphabet detail card | in flow | `lg:sticky lg:top-20` | `src/app/app/alphabet/page.tsx:123` |

### 2.2 Page shell and content widths

The app shell is `main.mx-auto.w-full.max-w-5xl.px-4.pt-6` (`src/app/app/layout.tsx:14`). Pages then centre a narrower column with `mx-auto max-w-*`.

| Page type | Width | Pixels | Examples |
|---|---|---|---|
| Shell (all app pages, landing sections) | `max-w-5xl` | 1024 | `src/app/app/layout.tsx:14`, `src/components/AppNav.tsx:118`, `src/app/page.tsx:143,152,194,220` |
| Home and hub lists | `max-w-2xl` | 672 | Home `src/app/app/page.tsx:18`, Path `src/app/app/path/page.tsx:44`, Lessons `src/app/app/lessons/page.tsx:24`, Exams `src/app/app/exams/page.tsx:17`, Words `src/app/app/words/page.tsx:87`, Grammar, Missions, Poetry, Tutor |
| Sessions (lesson, practice, scenes, missions, exams) | `max-w-3xl` | 768 | `src/components/LessonSession.tsx:49`, `src/components/mission/MissionSession.tsx:50`, `src/components/GrammarLesson.tsx:231`, `src/app/app/practice/page.tsx:32`; the SessionHeader and FeedbackSheet inner rows also use `max-w-3xl` (`src/components/ui.tsx:215,269`) |
| Reading and dashboards | `max-w-3xl` | 768 | Reading `src/app/app/reading/page.tsx:14`, `src/app/app/reading/[id]/page.tsx:21`, Progress `src/app/app/progress/page.tsx:18`, Scenes `src/app/app/scenes/page.tsx:20` |
| Settings, privacy, intros and result screens | `max-w-xl` | 576 | Settings `src/app/app/settings/page.tsx:22`, Privacy `src/app/app/privacy/page.tsx:56`, session intros/results such as `src/app/app/speak/page.tsx:49`, `src/components/FlashcardSession.tsx:322` |
| Button stacks on result screens | `max-w-md` | 448 | `mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row-reverse` (for example `src/app/app/practice/page.tsx:96`) |
| Short helper text | `max-w-sm` | 384 | `mt-2 max-w-sm font-semibold text-muted` (for example `src/components/LessonSession.tsx:136`) |
| Chat bubbles | `max-w-[85%]` | — | `src/app/app/tutor/page.tsx:247,256,264`, `src/components/mission/InfoSteps.tsx:46` |
| Tab bar | `max-w-md` | 448 | `src/components/AppNav.tsx:128` |
| Dialogs | `w-[min(32rem,calc(100vw-2rem))]`, video dialog `min(48rem,…)` | 512 / 768 | `src/components/SayItButton.tsx:101`, `src/app/app/sounds/page.tsx:286`, `src/components/YouglishPlayer.tsx:130` |

Usage counts across `src`: `max-w-3xl` 26, `max-w-xl` 24, `max-w-2xl` 17, `max-w-md` 16, `max-w-sm` 10, `max-w-5xl` 6.

### 2.3 Spacing rhythm

Measured by grepping class names in `src/**/*.tsx`. Tailwind's spacing unit is 4px (`1` = 0.25rem).

| Family | Most used (count) | Reading |
|---|---|---|
| `gap-*` | `gap-3` 132, `gap-2` 109, `gap-1` 51, `gap-4` 28, `gap-1.5` 17, `gap-6` 5 | 12px between items in a row or list; 8px inside controls; 4px between an icon and a short label |
| `space-y-*` | `space-y-3` 24, `space-y-6` 17, `space-y-4` 15, `space-y-2` 15, `space-y-5` 12, `space-y-8` 5 | 24px between page sections; 12px between list items |
| `p-*` | `p-5` 68, `p-4` 66, `p-3` 26, `p-6` 22, `p-8` 8 | 20px inside cards, 16px inside tiles |
| `px-*` / `py-*` | `px-4` 34, `px-3` 12; `py-3` 12, `py-1` 12, `py-4` 11 | 16px horizontal gutter everywhere |
| `mt-*` | `mt-2` 90, `mt-1` 83, `mt-4` 72, `mt-3` 60, `mt-6` 48, `mt-5` 40, `mt-8` 27 | 4–8px title-to-subtitle, 16–24px block-to-block, 32px before result-screen buttons |
| `mb-*` | `mb-3` 20, `mb-6` 17 | `mb-6` under `PageHeader` (`src/components/ui.tsx:186`) and `SessionHeader` (`src/components/ui.tsx:213`) |

Container padding in practice:

| Container | Padding | Source |
|---|---|---|
| `card` | `p-5` (46 uses), `p-4` (20), responsive `sm:p-6` (11) or `sm:p-8` (5); `p-0` for dialogs | grep of `"card …"` class strings |
| `tile` | `p-4` (22), `p-3` (9), rows `px-4 py-3` | grep of `"tile …"` class strings |
| `StatCard` | `px-3 py-3.5` | `src/components/ui.tsx:297` |
| Page gutter | `px-4` (16px) | `src/app/app/layout.tsx:14` |
| Sticky bars that bleed to the edge | `-mx-4 px-4` | `src/components/ui.tsx:213` |
| Bottom action bar row | `px-4 py-5 sm:py-7` (FeedbackSheet), `px-4 py-4` (other bars) | `src/components/ui.tsx:269`, `src/components/FlashcardSession.tsx:272` |
| Sidebar | `px-3 py-6`, groups `gap-6`, links `gap-1.5` | `src/components/AppNav.tsx:97,101` |

Recommended scale *(proposed)*: use only 4, 8, 12, 16, 20, 24, 32, 40px (`1, 2, 3, 4, 5, 6, 8, 10`) for layout. Half steps (`1.5`, `2.5`, `3.5`) stay allowed inside small controls (chips, badges, icon-label pairs), not between blocks.

| Role *(proposed)* | Value |
|---|---|
| Icon to label | `gap-1.5` / `gap-2` |
| Items in a list or row | `gap-3` / `space-y-3` |
| Card padding | `p-5`, `sm:p-6` (hero cards `p-6 sm:p-8`) |
| Tile padding | `p-4` (compact `p-3`) |
| Between page sections | `space-y-6` |
| Under a page or session header | `mb-6` |
| Before a result screen's buttons | `mt-8` |

### 2.4 Corner radii

| Element | Radius | Class / token | Source |
|---|---|---|---|
| Card | 20px | `--radius-card: 1.25rem` | `src/app/globals.css:99,379` |
| Tile | 16px | `border-radius: 1rem` | `src/app/globals.css:390` |
| Insets, banners, badges, toasts | 16px | `rounded-2xl` (69 uses, most common radius) | e.g. `src/app/app/lessons/page.tsx:28` |
| Sheet top corners, dialogs, tab bar, tutor composer | 28px | `rounded-t-[1.75rem]`, `!rounded-[1.75rem]`, `rounded-[1.75rem]` | `src/components/ui.tsx:265`, `src/components/SayItButton.tsx:101`, `src/components/AppNav.tsx:128`, `src/app/app/tutor/page.tsx:299` |
| Tab pill, tab hit area, lesson action bar | 24px | `rounded-[1.5rem]` | `src/components/AppNav.tsx:138,169`, `src/components/LessonSession.tsx:86` |
| Button (default) | 14px | `0.875rem` | `src/app/globals.css:271` |
| Button `btn-sm` / `btn-lg` | 10px / 16px | `0.625rem` / `1rem` | `src/app/globals.css:358,364` |
| Icon button, chip, avatars, progress bar | full | `9999px` / `rounded-full` | `src/app/globals.css:372,466`, `src/components/ui.tsx:43` |
| Input, select | 12px | `0.75rem` | `src/app/globals.css:474,498` |
| Segmented track / segment | 12px / 10px | `rounded-xl` / `rounded-[0.625rem]` | `src/components/ui.tsx:164,173` |
| Sidebar link, logo mark, stat chips | 12px | `rounded-xl` | `src/components/AppNav.tsx:51,73,157` |
| Path "next" section | 20px | `rounded-[1.25rem]` (card radius as an arbitrary value) | `src/app/app/path/page.tsx:48` |

Rule of thumb: the outer radius grows with the surface (12 → 14 → 16 → 20 → 28px). A nested shape uses a smaller radius than its container (tab bar 28px, pill 24px).

### 2.5 Elevation levels

| Level | Surface | Background | Edge and shadow | Source |
|---|---|---|---|---|
| 0 · Canvas | Page | `--color-canvas` (#f2f2f7 / #000000) | none | `src/app/globals.css:27,132,183` |
| 1 · Card | Grouped container | `--color-card` (#ffffff / #1c1c1e) | `0 0 0 1px` ink 4% ring, `0 1px 2px rgb(0 0 0/0.04)`, `0 4px 16px rgb(0 0 0/0.03)` | `src/app/globals.css:378-385` |
| 1 · Tile | Tappable row/option | `--color-card` | 1px `--color-line` border, no shadow; state rings via `inset 0 0 0 1px` | `src/app/globals.css:388-433` |
| 1 · Inset | Fills inside a card | `bg-paper` (grey 12% / 24%) | none | e.g. `src/components/reading/ReadingLessonView.tsx:186` |
| 2 · Material | Top bar, SessionHeader, bottom action bars | card 72% or canvas 78%, blur 20px, saturate 180% | hairline `border-t`/`border-b border-line`, no shadow | `src/app/globals.css:437-446` |
| 3 · Glass | Tab bar, lesson preview action bar | card at `--glass-opacity` (62% / 66%), blur 24px, saturate 190% | 1px `--glass-edge`, `inset 0 1px 0 --glass-highlight`, `0 8px 28px rgb(0 0 0/--glass-shadow)`, `0 1px 4px` at half | `src/app/globals.css:451-460` |
| 3 · Popover | ReportButton panel, Poetry and reading toasts | card or tinted | Tailwind `shadow-lg` (`0 10px 15px -3px`, `0 4px 6px -4px`, both 10% black) | `src/components/ReportButton.tsx:99`, `src/components/Poetry.tsx:161`, `src/components/reading/ReadingLessonView.tsx:254` |
| 4 · Sheet | Answered FeedbackSheet | `color-mix(tone 14%, card)` | `0 -12px 40px rgb(0 0 0/0.14)`, top corners 28px | `src/components/ui.tsx:265,267` |
| 5 · Dialog | `<dialog>` via `showModal()` (browser top layer) | `card` | card shadow; backdrop `bg-black/40` + `blur(4px)` | `src/components/SayItButton.tsx:101`, `src/app/globals.css:606-609` |

Other shadows in use: the selected segment `0 1px 3px rgb(0 0 0/0.12), 0 0 0 0.5px rgb(0 0 0/0.04)` (`src/components/ui.tsx:174`) and the tab pill `inset 0 1px 0 var(--glass-highlight)` (`src/components/AppNav.tsx:138`). `--glass-shadow` is 0.12 in light and 0.5 in dark (`src/app/globals.css:43,196`). With `prefers-contrast: more`, cards swap their shadow for a 1px `--color-field-edge` ring (`src/app/globals.css:552-554`).

### 2.6 Safe areas and the floating tab bar

| Value | Meaning | Source |
|---|---|---|
| `bottom-[max(0.75rem,env(safe-area-inset-bottom))]`, `inset-x-3`, `max-w-md`, `p-1` | Tab bar floats 12px above the bottom edge (or the safe area, if larger), 12px from the sides | `src/components/AppNav.tsx:128` |
| ≈ 65px | Tab bar height, computed from classes: `p-1` (8) + `pt-2` (8) + icon `h-6` (24) + `gap-0.5` (2) + 10px label at 1.5 leading (15) + `pb-1.5` (6) + the glass 1px border (`globals.css:455`); its top edge sits about 77px above the screen bottom | `src/components/AppNav.tsx:128,169,173` |
| `pb-[calc(7.5rem+env(safe-area-inset-bottom))]` | Page bottom padding (120px + safe area), so the last content clears the tab bar | `src/app/app/layout.tsx:14` |
| `bottom-[calc(5.25rem+env(safe-area-inset-bottom))]` | Sticky bars that sit just above the tab bar (84px + safe area; about 7px of air above the bar's top edge at ~77px) | `src/components/LessonSession.tsx:86`, `src/app/app/tutor/page.tsx:299` |
| `[body[data-focus]_&]:pb-6`, `[body[data-focus]_&]:pl-0` | Sessions hide the nav, so the clearance and sidebar offset drop away | `src/app/app/layout.tsx:10,14`, `src/app/globals.css:618-620` |
| `pb-[env(safe-area-inset-bottom)]` | Fixed bottom action bars pad themselves into the safe area | `src/components/ui.tsx:264`, `src/components/FlashcardSession.tsx:271`, `src/components/scene/ScenePlayer.tsx:248`, `src/components/reading/ReadingLessonView.tsx:79`, `src/app/app/placement/page.tsx:152` |
| `h-40` spacer | Lets session content scroll clear of the fixed FeedbackSheet (160px) | `src/components/ui.tsx:260` |

### 2.7 Desktop sidebar and top bars

| Element | Spec | Source |
|---|---|---|
| Sidebar | `fixed inset-y-0 left-0 w-64` (256px), solid `bg-card`, `border-r border-line`, `px-3 py-6`, `gap-6`; nav scrolls (`overflow-y-auto`) | `src/components/AppNav.tsx:97,101` |
| Sidebar link | `rounded-xl px-3 py-2 gap-3`, 15px semibold, icon box `size-8` with 22px icon; current = `bg-sky-soft text-sky-ink` | `src/components/AppNav.tsx:157-162` |
| Sidebar group label | `mx-3 mb-1 mt-4 text-xs font-semibold text-muted` ("Practice", "Course") | `src/components/AppNav.tsx:105,109` |
| Mobile top bar | sticky, `h-14` (56px) + 1px hairline, `material-canvas`; logo left, streak/XP chips right | `src/components/AppNav.tsx:117-123` |
| Desktop top bar | static, no border, `lg:pt-5`, chips aligned right | `src/components/AppNav.tsx:117-118` |
| SessionHeader | sticky `top-0`, `material-canvas`, `py-3` + 44px X button ≈ 68px, bleeds with `-mx-4 px-4` | `src/components/ui.tsx:213-228` |
| Landing header | `h-16` (64px), `border-b border-line`, not sticky | `src/app/page.tsx:142-143` |

### 2.8 Z-index layers

| Layer | Value | Who uses it | Source |
|---|---|---|---|
| Local stacking | `z-[1]` | Tab links above the sliding pill; path timeline dots above their connector line | `src/components/AppNav.tsx:169`, `src/components/SoundPath.tsx:121`, `src/app/app/path/page.tsx:119` |
| In-flow overlays | `z-10` | Progress chart tooltip; Poetry status toast (`sticky top-16`) | `src/app/app/progress/page.tsx:193`, `src/components/Poetry.tsx:161` |
| In-page sticky bars, popovers | `z-20` | Lesson preview action bar, grammar "Start exercises" bar, ReportButton panel | `src/components/LessonSession.tsx:86`, `src/components/GrammarLesson.tsx:134`, `src/components/ReportButton.tsx:99` |
| App chrome | `z-30` | Sidebar, top bar, tab bar, SessionHeader | `src/components/AppNav.tsx:97,117,128`, `src/components/ui.tsx:213`, `src/components/RecallRound.tsx:254` |
| Session bottom bars, toasts | `z-40` | FeedbackSheet, flashcard/scene/reading/placement bars, reading toast | `src/components/ui.tsx:264`, `src/components/reading/ReadingLessonView.tsx:79,253` |
| Top layer | (browser) | Modal `<dialog>` elements | `src/components/SayItButton.tsx:97`, `src/components/YouglishPlayer.tsx:126`, `src/app/app/sounds/page.tsx:282` |

### 2.9 Minimum widths

- Design target: 375px with no horizontal scroll (skill checklist item 6).
- Safety net down to 320px: `html, body { overflow-x: clip }` (`src/app/globals.css:109-112`). `clip`, not `hidden`, so sticky positioning keeps working.
- Width-capped overlays: `max-w-[calc(100vw-2rem)]` on the ReportButton panel (`src/components/ReportButton.tsx:99`); dialogs use `min(…, calc(100vw-2rem))`.
- The segmented control scrolls sideways inside itself rather than pushing the page (`max-w-full overflow-x-auto`, `src/components/ui.tsx:164`).
- At 320px the tab bar is 296px wide, so each of the five tabs is about 58px: still above the 44px minimum.

## 3. Usage: do and don't

| Do | Don't |
|---|---|
| Wrap a page in `mx-auto max-w-2xl` (hub) or `max-w-3xl` (session, reading) | Let a page fill the `max-w-5xl` shell edge to edge |
| Put sticky actions at `bottom-[calc(5.25rem+env(safe-area-inset-bottom))] lg:bottom-4` | Invent a new offset (`4rem`, `bottom-20`) or switch at `md:` while the tab bar is still on screen |
| Rely on the shell's `pb-[calc(7.5rem+…)]`; add the `h-40` spacer only under a fixed session bar | Add your own bottom padding guesses to clear the tab bar |
| Use `card` (20px) for groups and `tile` (16px) for tappable rows | Hand-write `rounded-[1.25rem]` or a new shadow; use the utility |
| Use `gap-3` between list items and `space-y-6` between sections | Mix `space-y-5`, `space-y-6` and `space-y-8` on sibling pages for the same job |
| Pick a z-index from the layer table | Add `z-50` or `z-[999]`; use `showModal()` for anything modal |
| Let floating chrome be `material` or `glass` and the sidebar solid `card` | Put a shadow on a material bar, or a translucent fill on the sidebar |

## 4. Accessibility notes

- No horizontal scrolling at 320px and above; text reflows at 200% zoom inside the column widths above.
- Fixed and sticky chrome must never cover focusable content: keep the bottom padding and spacer in place, and test with the keyboard that a focused element near the bottom scrolls into view above the tab bar.
- Every hit target is at least 44px: `btn` is 46px tall, `btn-icon` 44px, `btn-sm` 36px (use only where a 44px target surrounds it), segments `min-h-10` (40px), tab items about 55px tall.
- Respect the device safe areas on all fixed edges (see gap below about `viewport-fit`).
- `prefers-contrast: more` replaces translucent separators with `--color-field-edge` and gives cards a visible 1px ring (`src/app/globals.css:548-555`).
- Tab labels are 10px (`src/components/AppNav.tsx:169`); they are supplementary to the icons and `aria-current="page"` marks the active tab.

## 5. Code reference

- `src/app/globals.css` — `--radius-card`, `card`, `tile`, `btn*` radii and heights, `material`, `material-canvas`, `glass`, `dialog::backdrop`, `prefers-contrast` and overflow rules, `body[data-focus] .app-nav`.
- `src/app/app/layout.tsx` — app shell, sidebar offset, tab-bar clearance, focus-mode overrides.
- `src/components/AppNav.tsx` — sidebar, top bar, tab bar, tab pill.
- `src/components/ui.tsx` — `SessionHeader`, `FeedbackSheet`, `PageHeader`, `Segmented`, `StatCard`, `FocusMode`.
- `src/app/layout.tsx` — viewport and theme-colour metadata.

## 6. Gaps and recommendations

> Priorities in this section are this designer's view. The agreed, deduplicated priority for each issue is in *13 · Governance and roadmap*, §3.

**P0**
- None found that break layout on a 375px phone.

**P1**
- **Safe-area insets are probably always 0.** Every offset uses `env(safe-area-inset-bottom)`, but the viewport export sets only `width` and `initialScale`, not `viewportFit: "cover"` (`src/app/layout.tsx:42-49`). Without `viewport-fit=cover`, iOS reports zero insets, so the calc() offsets fall back to their fixed parts. *(proposed)* Add `viewportFit: "cover"` and test the tab bar, FeedbackSheet and top bar on a notched iPhone in Safari and as an installed app.
- **Grammar "Start exercises" bar uses the wrong offset.** It sits at `bottom-[calc(4rem_+_env(…))]` and drops to `md:bottom-0` (`src/components/GrammarLesson.tsx:134`). The tab bar's top edge is about 77px up and it stays visible until `lg`, so on phones the bar's padding overlaps it (the button clears it by about 3px) and is hidden behind it between 768 and 1023px. *(proposed)* Use the standard `bottom-[calc(5.25rem+env(safe-area-inset-bottom))] lg:bottom-4`. The bar's `from-card` gradient also sits on the canvas colour; use the glass action bar from `LessonSession.tsx:86` instead.
- **Two magic numbers carry the tab-bar geometry.** `7.5rem` and `5.25rem` are repeated in three files and depend on the computed ~65px bar height. *(proposed)* Define `--tabbar-clearance` and `--tabbar-offset` in `globals.css` and use them everywhere.

**P2**
- **No elevation tokens.** Popovers use Tailwind's default `shadow-lg`, the sheet uses an arbitrary `shadow-[0_-12px_40px_…]`, the segment another one. *(proposed)* Add `--shadow-popover` and `--shadow-sheet` tokens next to the card and glass shadows.
- **28px and 24px radii are arbitrary values.** `rounded-[1.75rem]` appears 5 times and `rounded-[1.5rem]` 3 times; `rounded-[1.25rem]` duplicates `--radius-card`. *(proposed)* Add `--radius-sheet: 1.75rem` and `--radius-bar: 1.5rem`, and use `rounded-card` for the path section.
- **Reading toast ignores the safe area.** It sits at `bottom-20` (80px) above a material bar that is about 78px plus the safe area (`src/components/reading/ReadingLessonView.tsx:253`), so the two can touch or overlap on notched phones.
- **Poetry toast offset is mobile-only.** `sticky top-16` clears the 57px mobile top bar, but on desktop the top bar is static, so the toast floats 64px from the top for no reason (`src/components/Poetry.tsx:161`).
- **Spacing drift.** Sibling pages use `space-y-5`, `space-y-6` and `space-y-8` for the same section rhythm (for example Review `space-y-5`, Scenes and Sounds `space-y-8`). *(proposed)* Adopt the scale in 2.3.
- **`md:` is almost unused in the app.** Keep layout changes on `sm` and `lg` only; `md` belongs to the landing page.
- **The skill names 375px as the minimum but the code defends 320px.** *(proposed)* State both in the skill: design at 375px, verify nothing breaks at 320px. The lessons zigzag (`w-40` items moved up to 66px sideways, `src/app/app/lessons/page.tsx:10,57`) is the tightest layout at 320px and should be checked there.
