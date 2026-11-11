# 03 · Typography

The fonts, weights, sizes, tracking and leading Farsi Pen uses for English and Persian text, as found in the code.

## 1. Principles

- **System font for Latin, Yekan Bakh for Persian.** English text uses the platform font (SF on Apple devices), so the app feels native. Persian always uses Yekan Bakh, set by `lang="fa"` (`src/app/globals.css:85-88`, `:155-157`).
- **Hierarchy from weight and size, not colour or case.** Titles 700, headlines 600, emphasis 500, body 400 (`globals.css:90-93`). Prefer the lighter step when in doubt (`.claude/skills/farsi-pen-design-system/SKILL.md:53`).
- **Tracking depends on size.** Large headings are tracked tighter; body text is not tracked; the small `eyebrow` is tracked wider (`globals.css:121-127`, `:525`).
- **Persian is never letter-spaced or uppercased.** Letter-spacing breaks Persian letter joining; uppercase does not exist in the script (`globals.css:158-160`).
- **Persian gets more air.** Persian reading text uses loose leading (2 to 2.3) so dots and diacritics never collide.
- **Sentence case everywhere.** The only uppercase text is the `eyebrow` section label (`SKILL.md:54`, `:122`).

## 2. Specification

### 2.1 Font stacks

| Token | Stack | Used for | Source |
|---|---|---|---|
| `--font-sans` | `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI Variable Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, system-ui, sans-serif` | `body` and all Latin text | `globals.css:86`, `:134` |
| `--font-display` | Same, with `"SF Pro Display"` and `"Segoe UI Variable Display"` | `h1`, `h2`, `h3` | `globals.css:87`, `:118` |
| `--font-fa` | `"Yekan Bakh", Tahoma, sans-serif` | Any element with `lang="fa"` | `globals.css:88`, `:156` |
| (Tailwind default) `font-mono` | Tailwind's mono stack | Sync code only | `SyncCard.tsx:109`, `:150` |

- `font-optical-sizing: auto` is on `body`, so SF and Segoe UI Variable pick their text or display cut by size (`globals.css:137`).
- Text is antialiased (`-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`) and `-webkit-text-size-adjust: 100%` (`globals.css:103-107`; `layout.tsx:58`).

### 2.2 Yekan Bakh

| Property | Value | Source |
|---|---|---|
| File | `src/fonts/YekanBakhFaNum-VF.woff` (one variable file) | `globals.css:7` |
| Variant | **FaNum**: digits render as Persian digits (۰–۹) | `globals.css:3` |
| Weight axis | `wght` 100–1000 (`font-weight: 100 1000`) | `globals.css:3`, `:8` |
| DOTS axis | 0–1. `1` (dotted style) for running text, `0` (plain) for headings | `globals.css:3-4`, `:157`, `:162-165` |
| Loading | `font-display: swap` | `globals.css:9` |
| Applied by | `[lang="fa"]` selector; `<Fa>` renders `<span lang="fa" dir="rtl">` | `globals.css:155`; `src/components/ui.tsx:25-31` |

DOTS rules: every `[lang="fa"]` element gets `"DOTS" 1`. Persian inside an `h1`–`h3`, or an `h1`–`h3` that is itself `lang="fa"`, gets `"DOTS" 0` (`globals.css:162-165`).

### 2.3 Weight remap

Tailwind's weight names are shifted one step lighter in `@theme` (`globals.css:90-93`). Tailwind defaults are in `node_modules/tailwindcss/theme.css:374-382`.

| Class | Tailwind default | Farsi Pen | Role | Uses in `src/` |
|---|---|---|---|---|
| (none) | 400 | 400 | Body text (`body { font-weight: 400 }`, `globals.css:135`) | — |
| `font-medium` | 500 | 500 (not remapped) | Same as `font-semibold` | 3 |
| `font-semibold` | 600 | **500** | Labels, light emphasis, secondary lines | 268 |
| `font-bold` | 700 | **600** | Headlines, emphasised Persian, list-row labels | 210 |
| `font-extrabold` | 800 | **700** | Titles (every `h1`/`h2`/`h3` with a weight class) | 246 |

Weights set directly in utilities: `btn` 600 (`globals.css:276`), `chip` 600 (`:469`), `select` 500 (`:508`), `eyebrow` 500 (`:524`), `input` 400 (`:479`).

### 2.4 Type scale (Tailwind 4 defaults, not overridden)

Size and line-height come from `node_modules/tailwindcss/theme.css:347-366` (Tailwind 4.3.3). "Uses" counts every occurrence of the class in `src/`, including inside responsive variants such as `sm:text-4xl`.

| Class | Size | Line height | Uses |
|---|---|---|---|
| `text-xs` | 12px | 16px (1.333) | 45 |
| `text-sm` | 14px | 20px (1.429) | 283 |
| `text-base` | 16px | 24px (1.5) | 22 (+ base default) |
| `text-lg` | 18px | 28px (1.556) | 71 |
| `text-xl` | 20px | 28px (1.4) | 67 |
| `text-2xl` | 24px | 32px (1.333) | 60 |
| `text-3xl` | 30px | 36px (1.2) | 41 |
| `text-4xl` | 36px | 40px (1.111) | 19 |
| `text-5xl` | 48px | 48px (1) | 10 |
| `text-6xl` | 60px | 60px (1) | 3 |

Arbitrary sizes in use: `text-[15px]` ×3 (sidebar links, `AppNav.tsx:157`), `text-[13px]` ×1 (`Segmented`, `ui.tsx:164`), `text-[11px]` ×3, `text-[10px]` ×1 (tab bar labels, `AppNav.tsx:169`), `text-[2.75rem]` ×1 (landing hero, `src/app/page.tsx:157`).

Fixed sizes inside utilities: `btn` 16px, `btn-sm` 14px, `btn-lg` 17px, `input` 17px, `select` 16px, `chip` 12px, `eyebrow` 13px (`globals.css:275`, `:359`, `:365`, `:478`, `:507`, `:468`, `:523`). `select` stays at 16px or more so iOS does not zoom the page (`globals.css:506`).

### 2.5 Type roles as used

Counts come from the class string on the same line as the opening tag (`<h1`, `<h2`, `<p`, `<Fa`), so multi-line class lists are missed.

| Role | Most common | Count | Other sizes seen | Weight | Example |
|---|---|---|---|---|---|
| Page title (`h1`) | `text-3xl` (30/36) | 19 of 36 | `2xl` ×9, `4xl` ×7, `[2.75rem]`→`md:text-6xl` ×1 (landing) | `font-extrabold` (700) | `PageHeader`, `ui.tsx:188` |
| Section title (`h2`) | `text-xl` (20/28) | 25 of 57 | `2xl` ×16, `lg` ×11, `3xl` ×3, `4xl` ×1, `sm` ×1; some `h2` are `eyebrow` | `font-extrabold` (700) | `HomeSections.tsx:29` |
| Body | `text-base` (16/24, the default) | 149 `<p>` with no size class | — | 400 | — |
| Secondary body | `text-sm font-semibold text-muted` (14/20, 500) | 116 | — | 500 | `PageHeader` subtitle `ui.tsx:189` uses base size |
| Label / list-row emphasis | `text-sm font-bold` (14/20, 600) | 58 (29 with `text-muted`) | `text-[15px] font-semibold` in sidebar | 600 | `src/app/app/page.tsx:75` |
| Caption | `text-xs font-semibold text-muted` (12/16, 500) | 19 | `chip` 12px 600; tab bar 10px 500 | 500 | `StatCard` label `ui.tsx:298` |
| Eyebrow (section label) | `eyebrow` (13px, 500, uppercase) | ~55 class uses in 28 files | — | 500 | `settings/page.tsx:77` |
| Card / sheet title | `text-xl font-extrabold` | 35 | `text-lg font-extrabold` ×30 | 700 | `FeedbackSheet` `ui.tsx:277` |
| Stat value | `text-2xl font-bold tracking-tight` | — | Top-bar chips `text-base font-extrabold` | 600–700 | `StatCard` `ui.tsx:299`; `AppNav.tsx:73` |
| Persian display (`<Fa>`) | `text-xl` and `text-lg` (20 each) | 79 sized `<Fa>` | `2xl` ×12, `base` ×8, `sm` ×6, `5xl` ×6, `3xl` ×4, `4xl` ×3 | `font-bold` (600) on 70 | `FaWord` `ui.tsx:52-58` |

`FaWord` sizes (`ui.tsx:52-53`): `md` = `text-xl`, `lg` = `text-3xl`, `xl` = `text-4xl sm:text-5xl`; the secondary line is `text-sm` (md) or `text-base`.

### 2.6 Tracking

| Where | Value | Source |
|---|---|---|
| `h1` | −0.022em | `globals.css:122` |
| `h2` | −0.012em | `globals.css:126` |
| `h3`, body | 0 | — |
| `btn` | −0.01em; `btn-icon` 0 | `globals.css:277`, `:373` |
| `eyebrow` | +0.02em | `globals.css:525` |
| `tracking-tight` | −0.025em (Tailwind default) | 9 uses: 5 `h1`, landing `h2`, logo, `StatCard` value |
| `tracking-wide` | +0.025em | Sync code, `SyncCard.tsx:109` |
| `[lang="fa"]` | 0 (forced) | `globals.css:159` |

### 2.7 Leading

| Where | Value | Source |
|---|---|---|
| `body` | 1.5 | `globals.css:136` |
| `h1`–`h3` | 1.2; `h1` 1.12 | `globals.css:119`, `:123` |
| `btn` | 1.2 | `globals.css:278` |
| Persian display words | `leading-relaxed` (1.625) ×19 | `FaWord` `ui.tsx:54`, `:58` |
| Persian reading lines | `leading-loose` (2) ×9 | `Poetry.tsx:25`, `review/page.tsx:178`, `tutor/page.tsx:266` |
| Persian reading blocks | `leading-[2.2]`, `leading-[2.3]` | `samfa/Practice.tsx:143`; `reading/ReadingLessonView.tsx:186` |
| Large titles | `leading-tight` (1.25) ×10; `leading-[1.05]` landing hero | `path/page.tsx:55`; `src/app/page.tsx:157` |
| Letter forms | `leading-[1.6]` | `alphabet/page.tsx:151` |

Line-wrapping: `h1`–`h3` use `text-wrap: balance`; `p` uses `text-wrap: pretty` (`globals.css:117`, `:129`).

### 2.8 Eyebrow

- Definition: 13px (`0.8125rem`), weight 500, `letter-spacing: 0.02em`, `text-transform: uppercase` (`globals.css:522-527`).
- Colour is added separately: mostly `text-muted`; also `text-firuze-ink`, `text-sky-ink`, `text-plum-ink`, `text-anar-ink`.
- Intended for grouped-list section headers (`SKILL.md:54`). In practice it also labels mission steps, info panels and the path `Bubble` ("Start" / "Continue", `ui.tsx:312`, `lessons/page.tsx:64`).

### 2.9 Numerals

- Persian digits come from the FaNum font, not from number formatting: any digit inside `lang="fa"` renders as ۰–۹ (`globals.css:3`; `SKILL.md:104`).
- English UI uses Latin digits from the system font.
- Progress counters use `tabular-nums` so they don't jitter: `text-sm font-extrabold tabular-nums text-muted` (`LessonSession.tsx:29`, `ChoiceRound.tsx:104`, `RecallRound.tsx:122`, `GrammarLesson.tsx:236`).

### 2.10 Transliteration

| Setting | Leading line | Second line | Source |
|---|---|---|---|
| `script: "latin"` (default, `store.ts:179`) | Transliteration, display size, `font-extrabold` | Persian, `text-2xl` (`text-lg` for md), `text-muted` | `ui.tsx:62-66` |
| `script: "farsi"` | Persian, display size, `font-bold leading-relaxed` | Transliteration, `text-sm`/`text-base`, `font-semibold text-muted` | `ui.tsx:55-61` |
| `scriptOnly: true` | Persian only | — | `ui.tsx:54` |

Elsewhere the transliteration line is `text-sm font-semibold text-muted` (`WordCard.tsx:22`, `LessonSession.tsx:226`, `Poetry.tsx:28`, `scene/ScenePlayer.tsx:229`). It is never italic; italic is used only for scene settings (`ScenePlayer.tsx:196`, `scenes/page.tsx:30`, `HomeSections.tsx:129`).

## 3. Usage: do and don't

| Do | Don't |
|---|---|
| Wrap Persian in `<Fa>` (or `lang="fa"`) | Set `font-family` by hand or rely on the system font for Persian |
| Use `font-extrabold` for titles, `font-bold` for headlines, `font-semibold` for labels | Assume Tailwind's numbers: `font-bold` is 600 here, not 700 |
| Make page titles `text-3xl font-extrabold tracking-tight` (or use `PageHeader`) | Invent a new page-title size per screen |
| Use `eyebrow` for a section label | Add `uppercase` or wide tracking anywhere else |
| Write buttons and labels in sentence case ("Add to my cards") | Title-case labels ("Daily Practice") |
| Use `leading-loose` or `leading-[2.2]` for Persian reading blocks | Use `leading-tight` on Persian running text |
| Show transliteration as `text-muted` under the main line | Italicise transliteration |
| Use `tabular-nums` for counters that change | Let counters reflow as digits change width |
| Keep inputs and selects at 16px or larger | Shrink `select` or `input` below 16px (iOS zooms) |

## 4. Accessibility notes

- Body is 16px with 1.5 leading; the most common secondary text is 14px at weight 500 in `muted` (6.45:1 light, 6.61:1 dark on card; see 02 · Colour).
- Sizes are in `rem`, so they follow the browser's text-size setting; `-webkit-text-size-adjust: 100%` stops iOS from inflating text on rotate (`globals.css:104`).
- Persian always carries `lang="fa"` and `dir="rtl"` through `<Fa>`, so screen readers switch voice and the bidi algorithm lays it out correctly.
- The smallest text is the 10px tab bar label (`AppNav.tsx:169`); it sits under a 24px icon and the link has an accessible name from the label.
- `text-on-accent` should be at least 15px semibold on fills (`SKILL.md:112`).

## 5. Code reference

- Fonts and axes: `src/app/globals.css:3-10`, `:85-88`, `:155-165`.
- Weights: `globals.css:90-93`.
- Base heading, body and paragraph rules: `globals.css:113-140`.
- Utilities with type: `btn` `:261-306`, `btn-sm`/`btn-lg` `:355-366`, `chip` `:462-470`, `input` `:472-491`, `select` `:494-519`, `eyebrow` `:522-527`.
- Primitives: `Fa`, `FaWord`, `PageHeader`, `StatCard`, `Segmented` in `src/components/ui.tsx`.
- Tailwind scale: `node_modules/tailwindcss/theme.css:347-395`.

## 6. Gaps and recommendations

> Priorities in this section are this designer's view. The agreed, deduplicated priority for each issue is in *13 · Governance and roadmap*, §3.

**P1**
- **`h1` leading 1.12 never applies.** Tailwind's `text-*` utilities set their own line-height, and utilities override `@layer base`. Every `h1` has a size class, so a `text-3xl` title gets 1.2 and `text-2xl` gets 1.333 (`globals.css:123`; `theme.css:358-360`). *(proposed)* Add `leading-tight` to `PageHeader` or define title text styles that bundle size, leading and tracking.
- **Two `h1` tracking values.** The base rule says −0.022em (`globals.css:122`); `PageHeader` and four other titles add `tracking-tight` (−0.025em). Others have no class and get −0.022em. *(proposed)* Pick one and remove the other.
- **No named type styles.** Roles are rebuilt from raw classes each time (36 sized `h1` across 5 sizes, 57 `h2` across 6 sizes). *(proposed)* Add `@utility` text styles: `title-1` (30/36, 700, −0.022em), `title-2` (20/28, 700), `body`, `subhead` (14/20, 500, muted), `caption` (12/16, 500), `fa-display`, `fa-reading`.

**P2**
- **Persian is letter-spaced on the landing page.** The decorative letter strip uses `tracking-[0.5em]` on a `lang="fa"` element (`src/app/page.tsx:185-188`). The utility beats the base reset. It is `aria-hidden` and the letters are separate, so joining is not broken, but it breaks the rule.
- **Eyebrow is used beyond section headers** (mission steps, info panels, path bubble). Either widen the rule in the skill or *(proposed)* use `text-xs font-semibold text-muted` for those.
- **Title case slips.** "Daily Practice" in the nav (`AppNav.tsx:31`).
- **Large Persian outside headings is dotted.** `FaWord` and lesson display words are not `h1`–`h3`, so they get `DOTS 1` even at 30–48px. Confirm this is intended, or *(proposed)* add a `fa-display` class with `DOTS 0`.
- **`font-medium` and `font-semibold` are both 500.** Three `font-medium` uses (`GrammarLesson.tsx:81`, `:113`; `MissionScreen.tsx:67`). *(proposed)* Replace with `font-semibold`.
- **`--font-display` utility is unused.** `font-display` and `font-fa` classes exist but nothing uses them; headings get the display stack from the base rule.
- **No `woff2`.** The only Yekan Bakh file is `.woff` (`globals.css:7`). *(proposed)* Ship a `woff2` first for size.
- **No-op classes.** `normal-case tracking-normal` on the flashcard rating sub-label cancels styles nothing sets (`FlashcardSession.tsx:286`).
