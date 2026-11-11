# 12 · Design token reference

Every CSS custom property, utility class and global rule in `src/app/globals.css`, with light and dark values and a proposed Figma variable name for each.

## 1. Principles

- **One source.** All tokens live in `src/app/globals.css`. Tailwind 4 turns the `@theme` block into CSS variables on `:root` and into utility classes (`bg-firuze`, `font-fa`, `ease-spring`). Components use those classes, never raw hex.
- **Themes swap values, not names.** Dark mode redefines the same variables under `:root[data-theme="dark"]` and, for Auto, under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` (`globals.css:181-256`). Figma should do the same: one variable, two modes.
- **Derived tokens stay derived.** `-soft` tints are `color-mix()` of their base, so only bases change per theme. In Figma, store the resolved RGBA per mode and note the rule.
- **Names describe the role, not the hue value.** The proposed Figma scheme is `group/subgroup/name/variant`, lower case, hyphenated, matching the CSS name wherever one exists.
- **Tokens before one-offs.** Values that appear only as arbitrary classes in components (`rounded-[1.75rem]`, `bottom-[calc(5.25rem+…)]`) are listed so they can be promoted; they are marked *(proposed)* where no CSS variable exists yet.

## 2. Specification

### 2.1 Proposed Figma structure *(proposed)*

| Collection | Modes | Holds |
|---|---|---|
| `fp/theme` | `Light`, `Dark` | Every `color/*` and `glass/*` variable |
| `fp/scale` | one mode | `font/*`, `radius/*`, `shadow/*` parts, `motion/*`, `layout/*`, `size/*` |

Figma has no "Auto" mode: Auto is a runtime choice between the two modes. Letter-spacing in em converts to Figma percent (−0.022em = −2.2%).

### 2.2 Colour: neutrals and text

| CSS variable | Light | Dark | Purpose | Figma variable (proposed) | Source |
|---|---|---|---|---|---|
| `--color-canvas` | `#f2f2f7` | `#000000` | Page background | `color/neutral/canvas` | `globals.css:27`, `:183` |
| `--color-card` | `#ffffff` | `#1c1c1e` | Raised surface | `color/neutral/card` | `:28`, `:184` |
| `--color-raised` | `#ffffff` | `#636366` | Selected segment | `color/neutral/raised` | `:38`, `:192` |
| `--color-paper` | `rgba(118,118,128,0.12)` | `rgba(118,118,128,0.24)` | Translucent fill | `color/neutral/paper` | `:29`, `:185` |
| `--color-line` | `rgba(60,60,67,0.16)` | `rgba(84,84,88,0.65)` | Hairline separator | `color/neutral/line` | `:30`, `:186` |
| `--color-line-strong` | `rgba(60,60,67,0.29)` | `rgba(120,120,128,0.6)` | Strong separator | `color/neutral/line-strong` | `:31`, `:187` |
| `--color-field-edge` | `#8e8e93` | `#7c7c80` | Input / select border | `color/neutral/field-edge` | `:35`, `:190` |
| `--color-ink` | `#1d1d1f` | `#f5f5f7` | Primary text | `color/text/ink` | `:36`, `:191` |
| `--color-muted` | `#5e5e63` | `#a1a1a6` | Secondary text | `color/text/muted` | `:33`, `:189` |
| `--color-faint` | `#a1a1a6` | `#636366` | Decorative text and icons | `color/text/faint` | `:32`, `:188` |
| `--color-on-accent` | `#ffffff` | `#000000` | Text on solid accent fill | `color/text/on-accent` | `:83`, `:216` |

Under `prefers-contrast: more`, `--color-line` becomes `var(--color-field-edge)` (`globals.css:548-551`). Figma: model as a third mode only if needed *(proposed)*.

### 2.3 Colour: accents

`-soft` is `color-mix(in srgb, base N%, transparent)`; the resolved value is the base RGB at alpha N.

| CSS variable | Light | Dark | Purpose | Figma variable (proposed) | Source |
|---|---|---|---|---|---|
| `--color-firuze` | `#0a8276` | `#33d1c2` | Primary fill | `color/accent/firuze/base` | `:47`, `:198` |
| `--color-firuze-soft` | `rgba(10,130,118,0.14)` | `rgba(51,209,194,0.14)` | Tint (14%) | `color/accent/firuze/soft` | `:49` |
| `--color-firuze-ink` | `#066a60` | `#6ae6da` | Text on tint / card | `color/accent/firuze/ink` | `:50`, `:200` |
| `--color-firuze-shadow` | `#076a61` | `#22a99c` | Pressed shade | `color/accent/firuze/shadow` | `:48`, `:199` |
| `--color-pista` | `#1f7f37` | `#30d158` | Success fill | `color/accent/pista/base` | `:53`, `:201` |
| `--color-pista-soft` | `rgba(31,127,55,0.14)` | `rgba(48,209,88,0.14)` | Tint (14%) | `color/accent/pista/soft` | `:55` |
| `--color-pista-ink` | `#1d7232` | `#6fe28c` | Text on tint / card | `color/accent/pista/ink` | `:56`, `:203` |
| `--color-pista-shadow` | `#18652c` | `#22a845` | Pressed shade | `color/accent/pista/shadow` | `:54`, `:202` |
| `--color-anar` | `#d93a30` | `#ff453a` | Error / danger fill | `color/accent/anar/base` | `:59`, `:204` |
| `--color-anar-soft` | `rgba(217,58,48,0.13)` | `rgba(255,69,58,0.13)` | Tint (13%) | `color/accent/anar/soft` | `:61` |
| `--color-anar-ink` | `#c0281f` | `#ff8a82` | Text on tint / card | `color/accent/anar/ink` | `:62`, `:206` |
| `--color-anar-shadow` | `#b02a22` | `#d6342b` | Pressed shade | `color/accent/anar/shadow` | `:60`, `:205` |
| `--color-saffron` | `#f09a0a` | `#ffb340` | Reward fill | `color/accent/saffron/base` | `:65`, `:207` |
| `--color-saffron-soft` | `rgba(240,154,10,0.18)` | `rgba(255,179,64,0.18)` | Tint (18%) | `color/accent/saffron/soft` | `:67` |
| `--color-saffron-ink` | `#8f5300` | `#ffcf7a` | Text on tint / card | `color/accent/saffron/ink` | `:68`, `:209` |
| `--color-saffron-shadow` | `#c97c00` | `#d99420` | Star stroke, done ring | `color/accent/saffron/shadow` | `:66`, `:208` |
| `--color-sky` | `#006ee6` | `#0a84ff` | Selection / info fill | `color/accent/sky/base` | `:71`, `:210` |
| `--color-sky-soft` | `rgba(0,110,230,0.13)` | `rgba(10,132,255,0.13)` | Tint (13%) | `color/accent/sky/soft` | `:73` |
| `--color-sky-ink` | `#0059b8` | `#6cb4ff` | Text on tint / card | `color/accent/sky/ink` | `:74`, `:212` |
| `--color-sky-shadow` | `#0059b8` | `#0071e3` | Pressed shade | `color/accent/sky/shadow` | `:72`, `:211` |
| `--color-plum` | `#9b51e0` | `#bf5af2` | Grammar fill | `color/accent/plum/base` | `:77`, `:213` |
| `--color-plum-soft` | `rgba(155,81,224,0.14)` | `rgba(191,90,242,0.14)` | Tint (14%) | `color/accent/plum/soft` | `:79` |
| `--color-plum-ink` | `#7a35bf` | `#dc9cf9` | Text on tint / card | `color/accent/plum/ink` | `:80`, `:215` |
| `--color-plum-shadow` | `#7a35bf` | `#9d3fd0` | Pressed shade | `color/accent/plum/shadow` | `:78`, `:214` |

### 2.4 Colour: derived mixes (no CSS variable yet)

| Value | Light | Dark | Purpose | Figma variable (proposed) | Source |
|---|---|---|---|---|---|
| sky 70% → transparent | `rgba(0,110,230,0.7)` | `rgba(10,132,255,0.7)` | Focus outline | `color/state/focus-ring` | `globals.css:146` |
| sky 22% → transparent | `rgba(0,110,230,0.22)` | `rgba(10,132,255,0.22)` | Input focus halo | `color/state/focus-halo` | `:486`, `:517` |
| firuze 20% → transparent | `rgba(10,130,118,0.2)` | `rgba(51,209,194,0.2)` | `btn-secondary` hover | `color/accent/firuze/soft-hover` | `:334` |
| card 94% + ink 6% | `#f1f1f2` | `#29292b` | `tile` hover | `color/state/tile-hover` | `:401` |
| ink 4% → transparent | `rgba(29,29,31,0.04)` | `rgba(245,245,247,0.04)` | `card` hairline ring | `color/neutral/card-ring` | `:382` |
| tone 14% over card | e.g. pista `#e0ede3`, anar `#fae3e2` | pista `#1f3526`, anar `#3c2222` | Answered feedback sheet | `color/accent/{tone}/sheet` | `ui.tsx:267` |
| black 40% | `rgba(0,0,0,0.4)` | same | Dialog backdrop dim | `color/overlay/scrim` | `backdrop:bg-black/40` (3 dialogs) |

### 2.5 Glass and material

| Token / utility | Light | Dark | Purpose | Figma variable (proposed) | Source |
|---|---|---|---|---|---|
| `--glass-opacity` | `62%` | `66%` | Card share in `glass` | `glass/opacity` (number) | `:40`, `:193` |
| `--glass-edge` | `rgba(255,255,255,0.6)` | `rgba(255,255,255,0.1)` | Glass border | `color/glass/edge` | `:41`, `:194` |
| `--glass-highlight` | `rgba(255,255,255,0.75)` | `rgba(255,255,255,0.12)` | Inset top highlight | `color/glass/highlight` | `:42`, `:195` |
| `--glass-shadow` | `0.12` | `0.5` | Shadow alpha (number) | `glass/shadow-alpha` | `:43`, `:196` |
| `--glass-pill` | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.1)` | Current-tab pill | `color/glass/pill` | `:44`, `:197` |
| `glass` | card at `--glass-opacity`, `blur(24px) saturate(190%)`, 1px edge, inset highlight, two shadows | same | Floating controls (tab bar, lesson bar) | `material/glass` (effect style) | `:451-460` |
| `material` | card 72%, `blur(20px) saturate(180%)` | same | Bars and sheets | `material/regular` | `:437-441` |
| `material-canvas` | canvas 78%, `blur(20px) saturate(180%)` | same | Top bar, session header | `material/canvas` | `:442-446` |
| `dialog::backdrop` | `blur(4px)` | same | Behind modals | `material/backdrop-blur` = 4 | `:606-609` |

Fallbacks: `prefers-reduced-transparency: reduce` and no `backdrop-filter` support both make `glass`, `material` and `material-canvas` solid `card` (`globals.css:531-547`).

### 2.6 Typography

| Token | Value | Purpose | Figma variable (proposed) | Source |
|---|---|---|---|---|
| `--font-sans` | `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI Variable Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, system-ui, sans-serif` | Latin text | `font/family/sans` = "SF Pro Text" | `:86` |
| `--font-display` | Same with "SF Pro Display", "Segoe UI Variable Display" | `h1`–`h3` | `font/family/display` = "SF Pro Display" | `:87` |
| `--font-fa` | `"Yekan Bakh", Tahoma, sans-serif` | Persian | `font/family/fa` = "Yekan Bakh" | `:88` |
| `font-weight` (body) | `400` | Body | `font/weight/body` | `:135` |
| `--font-weight-semibold` | `500` | Labels (`font-semibold`) | `font/weight/label` | `:91` |
| `--font-weight-bold` | `600` | Headlines (`font-bold`) | `font/weight/headline` | `:92` |
| `--font-weight-extrabold` | `700` | Titles (`font-extrabold`) | `font/weight/title` | `:93` |
| DOTS axis, text | `1` | Persian running text | `font/fa/dots-text` | `:157` |
| DOTS axis, headings | `0` | Persian in `h1`–`h3` | `font/fa/dots-heading` | `:164` |
| `h1` tracking | `-0.022em` | Page titles | `font/tracking/title-1` = −2.2% | `:122` |
| `h2` tracking | `-0.012em` | Section titles | `font/tracking/title-2` = −1.2% | `:126` |
| `btn` tracking | `-0.01em` | Button labels | `font/tracking/button` = −1% | `:277` |
| `eyebrow` tracking | `0.02em` | Section labels | `font/tracking/eyebrow` = 2% | `:525` |
| `[lang="fa"]` tracking | `0` | Persian (forced) | `font/tracking/fa` = 0 | `:159` |
| Body leading | `1.5` | Body | `font/leading/body` | `:136` |
| Heading leading | `1.2` (`h1` `1.12`) | `h1`–`h3` | `font/leading/heading`, `font/leading/title-1` | `:119`, `:123` |
| Persian reading leading | `2` / `2.2` / `2.3` (component classes) | Reading blocks | `font/leading/fa-reading` *(proposed: 2.2)* | `ReadingLessonView.tsx:186`; `samfa/Practice.tsx:143` |

Type sizes are Tailwind 4 defaults (not overridden): `xs` 12/16, `sm` 14/20, `base` 16/24, `lg` 18/28, `xl` 20/28, `2xl` 24/32, `3xl` 30/36, `4xl` 36/40, `5xl` 48/48, `6xl` 60/60 (`node_modules/tailwindcss/theme.css:347-366`). Proposed Figma names: `font/size/xs` … `font/size/6xl`, `font/line-height/xs` … Sizes fixed inside utilities: `btn` 16, `btn-sm` 14, `btn-lg` 17, `input` 17, `select` 16, `chip` 12, `eyebrow` 13 → `font/size/button`, `font/size/button-sm`, `font/size/button-lg`, `font/size/field`, `font/size/chip`, `font/size/eyebrow`. See 03 · Typography for usage.

### 2.7 Radius

| Token / where | Value | Purpose | Figma variable (proposed) | Source |
|---|---|---|---|---|
| `--radius-card` | `1.25rem` (20px) | `card` corners | `radius/card` | `globals.css:99`, `:379` |
| `btn` | `0.875rem` (14px) | Default button | `radius/button` | `:271` |
| `btn-sm` | `0.625rem` (10px) | Small button; segment | `radius/button-sm` | `:358`; `ui.tsx:173` |
| `btn-lg` | `1rem` (16px) | Large button | `radius/button-lg` | `:364` |
| `tile` | `1rem` (16px) | Tappable rows | `radius/tile` | `:390` |
| `input`, `select` | `0.75rem` (12px) | Fields; also `rounded-xl` | `radius/field` | `:474`, `:498` |
| `btn-icon`, `chip` | `9999px` | Round / pill | `radius/full` | `:372`, `:466` |
| `rounded-[1.75rem]` | 28px | Tab bar, dialogs, sheet top, tutor composer | `radius/sheet` *(proposed token)* | `AppNav.tsx:128`; `ui.tsx:265` |
| `rounded-[1.5rem]` | 24px | Tab pill, lesson action bar | `radius/bar` *(proposed token)* | `AppNav.tsx:138`, `LessonSession.tsx:86` |
| Tailwind `rounded-2xl` / `rounded-xl` | 16px / 12px | Most other surfaces (69 / 34 uses) | `radius/lg`, `radius/md` | `theme.css:401-402` |

### 2.8 Shadow and elevation

| Name | Value | Purpose | Figma variable (proposed) | Source |
|---|---|---|---|---|
| Card | `0 0 0 1px ink 4%`, `0 1px 2px rgb(0 0 0/.04)`, `0 4px 16px rgb(0 0 0/.03)` | `card` | `shadow/card` (effect style) | `globals.css:381-384` |
| Card, more contrast | `0 0 0 1px field-edge` | `prefers-contrast: more` | `shadow/card-contrast` | `:552-554` |
| Glass | `inset 0 1px 0 glass-highlight`, `0 8px 28px rgb(0 0 0/glass-shadow)`, `0 1px 4px rgb(0 0 0/glass-shadow÷2)` | `glass` | `shadow/glass` | `:456-459` |
| Raised segment | `0 1px 3px rgb(0 0 0/.12)`, `0 0 0 .5px rgb(0 0 0/.04)` | Selected segment | `shadow/raised` | `ui.tsx:174` |
| Sheet | `0 -12px 40px rgb(0 0 0/.14)` | Answered feedback sheet | `shadow/sheet` | `ui.tsx:265` |
| State ring | `inset 0 0 0 1px {state colour}` | `tile` selected / correct / wrong / current | `shadow/state-ring` | `:413`, `:419`, `:425`, `:431` |
| Focus outline | `3px solid` focus-ring, offset `2px` | Keyboard focus | `stroke/focus` | `:145-148` |
| Focus halo | `0 0 0 4px` focus-halo | `input`, `select` focus | `shadow/focus-halo` | `:486`, `:517` |

Z-index in use: `z-[1]` tab items, `z-10`, `z-20` sticky bars, `z-30` nav and session header, `z-40` fixed bottom sheets → `layer/content` 0, `layer/sticky` 20, `layer/nav` 30, `layer/sheet` 40 *(proposed)*.

### 2.9 Motion

| Token / where | Value | Purpose | Figma variable (proposed) | Source |
|---|---|---|---|---|
| `--ease-spring` | `cubic-bezier(0.22, 1, 0.36, 1)` | Critically damped UI motion | `motion/easing/spring` | `globals.css:96` |
| `--ease-sheet` | `cubic-bezier(0.32, 0.72, 0, 1)` | Sheet entrance | `motion/easing/sheet` | `:97` |
| Press | `60ms` | `:active` on `btn`, `tile` | `motion/duration/press` | `:296`, `:406` |
| Button | `160ms` | Transform, colour, filter | `motion/duration/fast` | `:283-286` |
| Tile | `180ms` transform; `100ms` colours | Tile press and state | `motion/duration/tile` | `:394-398` |
| Field focus | `160ms` | `input`, `select` | `motion/duration/fast` | `:481-483` |
| Theme change | `300ms ease` | Body background | `motion/duration/theme` | `:139` |
| `animate-pop` | `pop-in 280ms spring`: scale 0.96→1, opacity 0→1 | Appear | `motion/duration/pop` | `:559-568`, `:591-593` |
| `animate-slide-up` | `slide-up 420ms sheet`: translateY 100%→0 | Sheets | `motion/duration/sheet` | `:569-576`, `:594-596` |
| `animate-shake` | `shake 320ms ease-in-out`: ±5px | Wrong answer | `motion/duration/shake` | `:577-590`, `:597-599` |
| `animate-bob` | `transform: translateX(-50%)` (no animation) | Centres the path bubble | — (legacy) | `:600-603` |
| Press scale | `btn` 0.97, `tile` 0.98 | Press feedback | `motion/scale/button`, `motion/scale/tile` | `:294`, `:405` |
| Press / hover brightness | active 0.94, hover 1.06 | Button filter | `motion/brightness/press`, `/hover` | `:290`, `:295` |
| Reduced motion | all durations `0.01ms` | `prefers-reduced-motion` | — | `:166-173` |

### 2.10 Layout offsets and sizes (component classes; no CSS variables yet)

| Value | Purpose | Figma variable (proposed) | Source |
|---|---|---|---|
| `max(0.75rem, safe-area-bottom)` | Tab bar distance from bottom | `layout/tabbar/bottom` = 12 | `AppNav.tsx:128` |
| `inset-x-3` (12px), `max-w-md` (448px), `p-1` | Tab bar side inset, width, padding | `layout/tabbar/inset` = 12 | `AppNav.tsx:128` |
| `calc(7.5rem + safe-area-bottom)` (120px) | Page bottom padding under the tab bar | `layout/content/bottom-clearance` = 120 | `src/app/app/layout.tsx:14` |
| `calc(5.25rem + safe-area-bottom)` (84px); `lg:bottom-4` | Sticky bars above the tab bar | `layout/sticky/above-tabbar` = 84 | `LessonSession.tsx:86`; `tutor/page.tsx:299` |
| `max-w-5xl` (1024px), `px-4` (16px), `pt-6` (24px) | App content column | `layout/content/max-width`, `layout/gutter` = 16 | `src/app/app/layout.tsx:14` |
| `w-64` (256px), `lg:pl-64` | Desktop sidebar | `layout/sidebar/width` = 256 | `AppNav.tsx:97`; `layout.tsx:10` |
| `h-14` (56px) | Mobile top bar | `layout/topbar/height` = 56 | `AppNav.tsx:118` |
| `max-w-3xl` (768px) | Session header and feedback sheet content | `layout/session/max-width` = 768 | `ui.tsx:215`, `:269` |
| `h-40` (160px) | Spacer above fixed feedback sheet | `layout/sheet/spacer` = 160 | `ui.tsx:260` |
| `min-height 2.875rem` (46px) | `btn`, `select` height | `size/control/md` = 46 | `globals.css:269`, `:495` |
| `2.25rem` (36px) | `btn-sm` height | `size/control/sm` = 36 | `:356` |
| `3.25rem` (52px) | `btn-lg` height | `size/control/lg` = 52 | `:362` |
| `2.75rem` (44px) | `btn-icon` size | `size/control/icon` = 44 | `:369-370` |
| `h-2.5` (10px) / `h-1.5` (6px) | `ProgressBar` md / sm | `size/progress/md`, `/sm` | `ui.tsx:43` |
| `18px` | `.tile-bg` dot grid | — | `globals.css:614` |

### 2.11 Utility classes

| Class | What it sets | Variants / states | Source |
|---|---|---|---|
| `btn` | Base button: flex, 46px min-height, 0 20px padding, 14px radius, 16px/600, `--btn-bg` firuze, `--btn-fg` on-accent | Hover brightness 1.06 (hover devices only); active scale 0.97; disabled paper/muted | `globals.css:261-306` |
| `btn-primary` | `btn` (firuze) | — | `:307-309` |
| `btn-success` / `btn-danger` / `btn-sky` / `btn-plum` | `btn` with `--btn-bg` pista / anar / sky / plum | — | `:310-325` |
| `btn-secondary` | firuze-soft fill, firuze-ink label | Hover: firuze 20% | `:327-337` |
| `btn-ghost` | Transparent, muted label | Hover: paper fill, ink label; disabled faint | `:339-354` |
| `btn-sm` / `btn-lg` / `btn-icon` | Size modifiers (see 2.10) | — | `:355-374` |
| `card` | Card fill, `--radius-card`, card shadow | More contrast: field-edge ring | `:378-385`, `:552-554` |
| `tile` | Card fill, 1px line border, 16px radius | `data-state` selected / correct / wrong / current; hover (no state); active scale 0.98 | `:388-433` |
| `material` / `material-canvas` | Translucent blurred surface | Solid with reduced transparency | `:437-446` |
| `glass` | Light liquid glass | Solid with reduced transparency | `:451-460` |
| `chip` | Pill, 2px 10px padding, 12px/600 | — | `:462-470` |
| `input` | Full-width field, field-edge border, 12px radius, 17px | Focus sky border + halo; placeholder faint | `:472-491` |
| `select` | Native select with chevron (`#8e8e93` SVG), 16px/500 | Focus sky border + halo | `:494-519` |
| `eyebrow` | 13px/500, +0.02em, uppercase | — | `:522-527` |
| `animate-pop` / `animate-slide-up` / `animate-shake` / `animate-bob` | See 2.9 | — | `:591-603` |
| `.tile-bg` (plain class) | Firuze dot pattern | — | `:612-615` |

Generated from `@theme` by Tailwind: `bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*`, `ring-*`, `outline-*`, `from-*`/`to-*` for every `--color-*`; `font-sans`, `font-display`, `font-fa`; `font-semibold`/`bold`/`extrabold` (remapped); `ease-spring`, `ease-sheet`; `rounded-card`. `--glass-*` is outside Tailwind's namespaces, so it has no utilities; use `bg-[var(--glass-pill)]`.

### 2.12 Global rules and variants

There are no `@custom-variant` declarations in `globals.css`. State is expressed with attributes and media queries:

| Selector / query | Effect | Source |
|---|---|---|
| `:root[data-theme="dark"]` | Dark token values | `globals.css:181-217` |
| `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` | Dark values for Auto | `:218-256` |
| `html[data-input="pointer"] :focus-visible` | Hides focus ring for pointer users | `:152-154`; `layout.tsx:10` |
| `[lang="fa"]`, `:is(h1,h2,h3) [lang="fa"]` | Persian font, DOTS, no tracking or uppercase | `:155-165` |
| `tile[data-state=…]` | Selected / correct / wrong / current | `:411-432` |
| `body[data-focus] .app-nav` | Hides app chrome in sessions | `:618-620`; `ui.tsx:200-208` |
| `[body[data-focus]_&]:` (arbitrary variant in components) | Removes sidebar offset and tab-bar padding in sessions | `src/app/app/layout.tsx:10`, `:14` |
| `@media (hover: hover)` | Hover only on real pointers | `:288`, `:331`, `:343`, `:399` |
| `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast: more` | Instant motion; solid materials; stronger edges | `:166-173`, `:531-539`, `:548-555` |
| `@supports not (backdrop-filter)` | Solid materials | `:541-547` |
| `html`, `html, body`, `h1–h3`, `p`, `body`, `button, a` | Smoothing, `overflow-x: clip`, balance/pretty wrap, body font and colour, no tap highlight | `:103-144` |

## 3. Usage: do and don't

| Do | Don't |
|---|---|
| Reference tokens by name (`bg-card`, `text-muted`, `var(--ease-spring)`) | Copy a hex value into a component or a Figma fill |
| Bind Figma fills to `color/*` variables with Light and Dark modes | Make separate light and dark Figma styles with different names |
| Store `-soft` in Figma as the base RGB with alpha 0.13–0.18 | Store `-soft` as an opaque hex; it would be wrong on the canvas |
| Add a new value to `globals.css` first, then to Figma with the matching name | Add Figma-only tokens the code doesn't have |
| Promote a repeated arbitrary value (28px radius, 84px offset) to a token *(proposed)* | Repeat `rounded-[1.75rem]` and `calc(5.25rem+…)` by hand |
| Use `font-bold` knowing it means 600 | Map Figma "Bold" (700) to `font-bold` |

## 4. Accessibility notes

- Contrast ratios for every colour pair are in 02 · Colour, section 2.6.
- Tokens that exist for accessibility must survive in Figma: `field-edge` (3:1 input edges), `muted` for disabled labels, the focus ring and halo, and the `prefers-contrast` and `prefers-reduced-transparency` fallbacks.
- `size/control/icon` (44px) is the minimum hit target. `btn-sm` (36px) is below it (see Gaps).
- Motion tokens all collapse to 0.01ms under `prefers-reduced-motion` (`globals.css:166-173`).

## 5. Code reference

- `src/app/globals.css` — every token and utility in this document.
- `src/app/layout.tsx` — theme script, `theme-color`, `data-theme` default.
- `src/app/app/layout.tsx` — content column and bottom clearance.
- `src/components/ui.tsx` — `TONE`, `ProgressBar`, `Segmented`, `FeedbackSheet` (mixes and shadows used in code).
- `src/components/AppNav.tsx` — tab bar and sidebar offsets, glass pill.
- `node_modules/tailwindcss/theme.css` — Tailwind defaults the system relies on (type scale, radii, tracking, leading).

## 6. Gaps and recommendations

> Priorities in this section are this designer's view. The agreed, deduplicated priority for each issue is in *13 · Governance and roadmap*, §3.

**P1**
- **Layout offsets are not tokens.** Tab-bar clearance (120px), sticky offset (84px) and the 28px / 24px radii are repeated as arbitrary classes. `GrammarLesson.tsx:134` uses a third, different offset (`calc(4rem + safe-area)`). *(proposed)* Add `--tabbar-clearance`, `--sticky-above-tabbar`, `--radius-sheet`, `--radius-bar` to `@theme`.
- **`prefers-contrast: more` loses to the dark theme selectors** (specificity 0,1,0 vs 0,2,0), so `--color-line` is not strengthened in dark mode, the default (`globals.css:549-550`).
- **`btn-sm` is 36px tall**, under the 44px target the skill asks for (`globals.css:356`; `SKILL.md:108`). It is used 69 times. *(proposed)* Raise to 44px or add hit-area padding.
- **Shadows and motion durations are not variables.** Card, glass, sheet and raised shadows and the 60/160/180/280/320/420ms durations are literals. *(proposed)* Add `--shadow-*` and `--duration-*` tokens so Figma and code share names.

**P2**
- **No `@custom-variant`.** Focus mode uses an arbitrary variant `[body[data-focus]_&]:` (`src/app/app/layout.tsx:10`, `:14`). *(proposed)* `@custom-variant focus-mode (body[data-focus] &);`.
- **Unused tokens and utilities:** `rounded-card`, `ease-spring` / `ease-sheet` utilities (code writes `ease-[var(--ease-spring)]`), `font-display`, `font-fa`, `.tile-bg`.
- **`animate-bob` is misnamed.** It only applies `translateX(-50%)`; on the poetry page it shifts an icon sideways (`src/app/app/poetry/page.tsx:65`). *(proposed)* Replace with `-translate-x-1/2` and delete.
- **`select` chevron is a hard-coded `#8e8e93`** in an SVG data URI, so it does not follow dark `field-edge` (`#7c7c80`) (`globals.css:501`).
- **Dark values are written twice** (`globals.css:181-217`, `:218-256`).
- **Duplicate values under different names** in light mode: `sky-shadow` = `sky-ink`, `plum-shadow` = `plum-ink`. Keep as aliases in Figma.
