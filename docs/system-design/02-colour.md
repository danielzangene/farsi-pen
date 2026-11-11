# 02 · Colour

Every colour token in Farsi Pen, its light and dark value, what it means, and how much contrast it gives.

## 1. Principles

- **Brand hues with fixed jobs.** Six accents, each with one meaning: firuze (turquoise) is the primary action and current progress, saffron is reward, anar (pomegranate) is error, pista (pistachio) is success, sky is selection and info, plum is grammar (`.claude/skills/farsi-pen-design-system/SKILL.md:26`). Same job, same colour, on every screen.
- **Neutrals follow the iOS grouped palette.** A soft grey canvas with white cards in light mode; true black with raised grey cards in dark mode (`src/app/globals.css:27-28`, `:183-184`).
- **Fills and separators are translucent.** `paper`, `line` and `line-strong` are greys with alpha, so one value reads correctly on the canvas, on a card and in dark mode (`globals.css:20-23`, `:29-31`).
- **Only base colours change between themes.** Every `-soft` tint is mixed from its own base colour with `color-mix()`, so the dark theme redefines the base and the tint follows (`globals.css:21-23`, `:49`).
- **Text on colour is never the accent itself.** Text on a tint uses the `-ink` shade; text on a solid fill uses `on-accent` (white in light, black in dark) (`globals.css:82-83`, `:216`).
- **Colour is never the only signal.** Correct, wrong and selected states always pair colour with an icon and words (`SKILL.md:111`).

## 2. Specification

### 2.1 Neutrals

| Token (CSS variable) | Light | Dark | Role | Source |
|---|---|---|---|---|
| `--color-canvas` | `#f2f2f7` | `#000000` | Page background behind grouped cards; also `body` background | `globals.css:27`, `:183`, `:132` |
| `--color-card` | `#ffffff` | `#1c1c1e` | Raised surfaces: `card`, `tile`, `input`, `select`, sidebar; base of `material` and `glass` | `globals.css:28`, `:184` |
| `--color-raised` | `#ffffff` | `#636366` | The selected segment of a segmented control | `globals.css:38`, `:192`; `ui.tsx:174` |
| `--color-paper` | `rgb(118 118 128 / 0.12)` | `rgb(118 118 128 / 0.24)` | Translucent fill: insets, segmented track, progress track, disabled button, ghost-button hover | `globals.css:29`, `:185` |
| `--color-line` | `rgb(60 60 67 / 0.16)` | `rgb(84 84 88 / 0.65)` | Hairline borders and dividers; `tile` border | `globals.css:30`, `:186` |
| `--color-line-strong` | `rgb(60 60 67 / 0.29)` | `rgb(120 120 128 / 0.6)` | Stronger separator; empty-star strokes, unchecked circles | `globals.css:31`, `:187` |
| `--color-ink` | `#1d1d1f` | `#f5f5f7` | Primary text and icons | `globals.css:36`, `:191` |
| `--color-muted` | `#5e5e63` | `#a1a1a6` | Secondary text; disabled button labels | `globals.css:33`, `:189` |
| `--color-faint` | `#a1a1a6` | `#636366` | Decorative only: chevrons, lock icons, placeholders | `globals.css:32`, `:188` |
| `--color-field-edge` | `#8e8e93` | `#7c7c80` | Border of `input` and `select` (aimed at 3:1, WCAG 1.4.11) | `globals.css:34-35`, `:190` |

Composited values used in the contrast tables below: `paper` over card is `#efeff0` (light) and `#323236` (dark); over canvas it is `#e3e3e9` and `#1c1c1f`.

### 2.2 Accent families

Each accent has four tokens. The table lists light / dark.

| Family | Base `--color-X` | `-shadow` | `-ink` | `-soft` mix | Role |
|---|---|---|---|---|---|
| firuze | `#0a8276` / `#33d1c2` | `#076a61` / `#22a99c` | `#066a60` / `#6ae6da` | 14% | Primary action (`btn-primary`), current lesson, brand mark and logo text |
| pista | `#1f7f37` / `#30d158` | `#18652c` / `#22a845` | `#1d7232` / `#6fe28c` | 14% | Correct answer, success, `btn-success` |
| anar | `#d93a30` / `#ff453a` | `#b02a22` / `#d6342b` | `#c0281f` / `#ff8a82` | 13% | Wrong answer, danger, `btn-danger`; also the streak flame |
| saffron | `#f09a0a` / `#ffb340` | `#c97c00` / `#d99420` | `#8f5300` / `#ffcf7a` | 18% | Reward: XP, stars, badges, finished lessons |
| sky | `#006ee6` / `#0a84ff` | `#0059b8` / `#0071e3` | `#0059b8` / `#6cb4ff` | 13% | Selection, audio, info, focus ring, current tab |
| plum | `#9b51e0` / `#bf5af2` | `#7a35bf` / `#9d3fd0` | `#7a35bf` / `#dc9cf9` | 14% | Grammar; "Formal" register tag |

Sources: light `globals.css:46-80`; dark `globals.css:198-215` (repeated at `:236-253` for Auto).

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-on-accent` | `#ffffff` | `#000000` | Text and icons on a solid accent fill (`globals.css:83`, `:216`) |

How the families work:

- **Base** (`bg-X`, `border-X`, `fill-X`): solid fills for buttons, progress, badges, completed nodes; borders for tile states.
- **`-soft`** (`bg-X-soft`): tint behind `-ink` text. Defined as `color-mix(in srgb, var(--color-X) N%, transparent)`, where N is 13, 14 or 18 (`globals.css:49`, `:55`, `:61`, `:67`, `:73`, `:79`). Because the mix is with `transparent`, the tint is translucent: it takes on the surface below it (card or canvas). Saffron uses 18% because yellow-orange reads weaker at the same alpha.
- **`-ink`** (`text-X-ink`): a darker (light) or lighter (dark) shade of the hue, for text on `-soft` and coloured text on cards.
- **`-shadow`**: a darker pressed shade. The 3D button lips are gone; it survives only as the XP star stroke (`text-saffron-shadow`, `AppNav.tsx:78`) and the done-step ring (`border-saffron-shadow`, `src/app/app/page.tsx:79`) (`SKILL.md:48`). In light mode `sky-shadow` equals `sky-ink` (`#0059b8`) and `plum-shadow` equals `plum-ink` (`#7a35bf`).

Other mixes in use:

| Mix | Where | Source |
|---|---|---|
| firuze 20% with transparent | `btn-secondary` hover fill | `globals.css:334` |
| tone 14% over `card` (opaque) | Answered `FeedbackSheet` background | `ui.tsx:267` |
| card 94% with ink | `tile` hover | `globals.css:401` |
| sky 70% with transparent | Global focus outline (3px) | `globals.css:146` |
| sky 22% with transparent | `input` and `select` focus halo (4px) | `globals.css:486`, `:517` |
| ink 4% with transparent | `card` hairline ring | `globals.css:382` |
| firuze 14% (oklab) with transparent | `.tile-bg` dot pattern (defined, currently unused) | `globals.css:613` |

### 2.3 Glass and material variables

| Variable | Light | Dark | What it controls | Source |
|---|---|---|---|---|
| `--glass-opacity` | `62%` | `66%` | Share of `card` in the glass background | `globals.css:40`, `:193` |
| `--glass-edge` | `rgb(255 255 255 / 0.6)` | `rgb(255 255 255 / 0.1)` | 1px border of `glass` | `:41`, `:194` |
| `--glass-highlight` | `rgb(255 255 255 / 0.75)` | `rgb(255 255 255 / 0.12)` | Inset top highlight | `:42`, `:195` |
| `--glass-shadow` | `0.12` | `0.5` | Alpha of the drop shadow (a number, not a colour) | `:43`, `:196` |
| `--glass-pill` | `rgb(0 0 0 / 0.06)` | `rgb(255 255 255 / 0.1)` | Pill behind the current tab in the mobile tab bar | `:44`, `:197`; `AppNav.tsx:138` |

`material` is card at 72% and `material-canvas` is canvas at 78%, both with `blur(20px) saturate(180%)` (`globals.css:437-446`). With reduced transparency, or without backdrop-filter support, all three become solid `card` (`globals.css:531-547`).

### 2.4 Theme switching

| Setting | `<html data-theme>` | Result | Source |
|---|---|---|---|
| Dark (default) | `"dark"` | Dark tokens from `:root[data-theme="dark"]` | `layout.tsx:53`; `store.ts:183`; `globals.css:181-217` |
| Light | `"light"` | `@theme` light values; the Auto query is blocked by `:not([data-theme="light"])` | `globals.css:25-100`, `:219` |
| Auto (`"system"`) | attribute removed | Dark tokens when `prefers-color-scheme: dark`, else light | `store.ts:221-227`; `globals.css:218-256` |

- The page is served with `data-theme="dark"`. An inline script in `<head>` reads the saved setting before first paint and switches to light or Auto, so the wrong theme never flashes (`layout.tsx:5-7`, `:55`).
- The learner picks Dark / Light / Auto in a `Segmented` control under Settings → Appearance (`src/app/app/settings/page.tsx:77-90`). `applyTheme()` runs on every save (`store.ts:212`).
- `color-scheme: dark` is set in both dark blocks, so native controls and scrollbars follow (`globals.css:182`, `:220`).
- The body eases its background over 300ms when the theme changes (`globals.css:138-139`).
- `theme-color` meta: `#f2f2f7` for `prefers-color-scheme: light`, `#000000` for dark (`layout.tsx:42-46`). It follows the **device** setting, not the in-app choice (see Gaps).
- The web manifest sets `background_color` and `theme_color` to `#f2f2f7` (`public/manifest.webmanifest:9-10`).

### 2.5 Colour meaning in the UI

| State or element | Colour treatment | Other signal | Source |
|---|---|---|---|
| Selected option (`tile[data-state="selected"]`) | sky border + 1px inset ring, `sky-soft` fill, `sky-ink` text | `aria-checked` / position | `globals.css:411-416` |
| Correct (`data-state="correct"`) | pista border + ring, `pista-soft`, `pista-ink` | Check icon + title in the feedback sheet | `globals.css:417-422`; `ui.tsx:274` |
| Wrong (`data-state="wrong"`) | anar border + ring, `anar-soft`, `anar-ink`; `animate-shake` | X icon + title in the feedback sheet | `globals.css:423-428`; `ui.tsx:274` |
| Current (`data-state="current"`) | firuze border + ring only, no fill | Position in path | `globals.css:429-432`; `path/page.tsx:126`; `SoundPath.tsx:132` |
| Answered feedback sheet | Tone 14% over card; `-ink` title and icon; matching `btn-success` / `btn-danger` | Icon + title + `role="status"` | `ui.tsx:255-283` |
| Streak chip (top bar) | `text-anar-ink`, flame `fill-anar`; zero streak: `fill-line text-faint`, number `text-muted` | Number + `aria-label` | `AppNav.tsx:73-76` |
| XP chip (top bar) | `text-saffron-ink`, star `fill-saffron` with `text-saffron-shadow` stroke | Number + `aria-label` | `AppNav.tsx:77-80` |
| Week strip day | Goal met: `bg-anar` + `text-on-accent` flame; practised: `border-anar bg-anar-soft`; none: `border-line bg-paper`; today: `ring-sky/60` | `title` + `sr-only` text | `HomeSections.tsx:45-49` |
| "XP today", quest reward | `text-saffron-ink` | Text | `HomeSections.tsx:33-35`, `:91` |
| Lesson path node | Done `bg-saffron`; current `bg-firuze`; locked `bg-line text-faint` (all with `text-on-accent` except locked) | Icon | `lessons/page.tsx:12-16` |
| Completion medallion | `bg-saffron text-on-accent`, size-24 circle | Heading | `LessonSession.tsx:283`, `FlashcardSession.tsx:324` and 5 more |
| Current nav item | `bg-sky-soft text-sky-ink` (sidebar); `text-sky-ink` + glass pill (tab bar); other tabs `text-ink/70` | `aria-current="page"` | `AppNav.tsx:158`, `:184` |
| Register tag | Spoken `saffron-soft`/`saffron-ink`; Formal `plum-soft`/`plum-ink` | Text | `ui.tsx:73-75` |
| Disabled button | `paper` fill, `muted` label | `disabled` | `globals.css:298-305` |
| Focus | 3px sky at 70%, offset 2px, keyboard only | Outline | `globals.css:145-154` |

`TONE` in `ui.tsx:16-23` is the single map from a tone name to literal classes (`bg`, `soft`, `ink`, `border`, `btn`). Saffron has no button of its own: `TONE.saffron.btn` is `btn-primary`.

### 2.6 Contrast

**How the ratios were computed.** WCAG 2.x relative luminance and contrast ratio, from the hex values in `globals.css`. Translucent tokens (`-soft`, `paper`, `line`, the 70% focus ring) were alpha-composited in sRGB over the named surface, which is what `color-mix(in srgb, …, transparent)` produces once painted. Surfaces: card `#ffffff` / `#1c1c1e`, canvas `#f2f2f7` / `#000000`. Calculated with a short Python script; not checked in. Thresholds: 4.5:1 for normal text, 3:1 for large text (≥ 24px, or ≥ 18.66px bold) and for non-text UI.

**Light theme**

| Family | `-soft` over card | `-ink` on `-soft` (card) | `-ink` on `-soft` (canvas) | `-ink` on card | `on-accent` (#fff) on base | Base vs card (non-text) |
|---|---|---|---|---|---|---|
| firuze | `#ddeeec` | 5.39 ✓ | 4.87 ✓ | 6.48 ✓ | 4.70 ✓ | 4.70 ✓ |
| pista | `#e0ede3` | 4.96 ✓ | **4.48 ✗** | 5.99 ✓ | 5.06 ✓ | 5.06 ✓ |
| anar | `#fae5e4` | 4.89 ✓ | **4.42 ✗** | 5.89 ✓ | 4.57 ✓ | 4.57 ✓ |
| saffron | `#fcedd3` | 5.34 ✓ | 4.86 ✓ | 6.17 ✓ | **2.25 ✗** | **2.25 ✗** |
| sky | `#deecfc` | 5.61 ✓ | 5.07 ✓ | 6.73 ✓ | 4.80 ✓ | 4.80 ✓ |
| plum | `#f1e7fb` | 5.67 ✓ | 5.13 ✓ | 6.80 ✓ | 4.52 ✓ | 4.52 ✓ |

**Dark theme**

| Family | `-soft` over card | `-ink` on `-soft` (card) | `-ink` on `-soft` (canvas) | `-ink` on card | `on-accent` (#000) on base | Base vs card (non-text) |
|---|---|---|---|---|---|---|
| firuze | `#1f3535` | 8.58 ✓ | 11.59 ✓ | 11.30 ✓ | 11.04 ✓ | 8.94 ✓ |
| pista | `#1f3526` | 8.08 ✓ | 10.85 ✓ | 10.48 ✓ | 10.39 ✓ | 8.42 ✓ |
| anar | `#3a2122` | 6.48 ✓ | 8.32 ✓ | 7.46 ✓ | 6.16 ✓ | 4.99 ✓ |
| saffron | `#453724` | 7.91 ✓ | 10.87 ✓ | 11.71 ✓ | 11.77 ✓ | 9.54 ✓ |
| sky | `#1a2a3b` | 6.72 ✓ | 8.70 ✓ | 7.79 ✓ | 5.76 ✓ | 4.66 ✓ |
| plum | `#33253c` | 6.94 ✓ | 9.04 ✓ | 8.24 ✓ | 5.96 ✓ | 4.83 ✓ |

**Neutrals and other pairs**

| Pair | Light | Dark | Needs |
|---|---|---|---|
| `ink` on card / canvas | 16.83 / 15.08 | 15.63 / 19.29 | 4.5 ✓ |
| `muted` on card / canvas | 6.45 / 5.78 | 6.61 / 8.16 | 4.5 ✓ |
| `muted` on any `-soft` over canvas (lowest) | 4.82 (pista) | — | 4.5 ✓ |
| `muted` on `paper` over card (disabled button) | 5.59 | 4.99 | 4.5 ✓ |
| `faint` on card / canvas | 2.57 / 2.31 | 2.84 / 3.51 | Decorative only; fails as text |
| `field-edge` on card / canvas | 3.26 / **2.92** | 4.09 / 5.05 | 3:1 |
| `line` / `line-strong` over card | 1.32 / 1.70 | 1.66 / 2.23 | Decorative separators |
| `raised` vs track (`paper` over card) | 1.15 | 2.14 | Selection also shown by shadow and `aria-checked` |
| `ink` on `raised` | 16.83 | 5.50 | 4.5 ✓ |
| `-ink` on feedback sheet (14% over card), pista / anar | 4.96 / 4.82 | 8.08 / 6.40 | 4.5 ✓ |
| Focus ring (sky 70%) vs card / canvas | **2.95 / 2.76** | **2.91** / 3.20 | 3:1 |
| Tab label `ink/70` over card (best case under glass) | 6.20 | 8.21 | 4.5 ✓ |
| XP star stroke `saffron-shadow` on card | 3.30 | — | 3:1 ✓ |

## 3. Usage: do and don't

| Do | Don't |
|---|---|
| Use `text-on-accent` on a solid accent fill (`bg-firuze text-on-accent`) | Use `text-white` or `text-black`; the label must flip with the theme |
| Put `-ink` text on its own `-soft` tint (`bg-pista-soft text-pista-ink`) | Put the base colour as text (`text-saffron`) on a card; saffron is 2.25:1 in light |
| Use `bg-card` where a surface must be opaque | Use `bg-paper` for an opaque surface; it is translucent |
| Pick the tone by meaning: sky = selected, pista = correct, anar = wrong, firuze = current | Use firuze to mark a selected answer, or sky for a correct one |
| Get tone classes from `TONE[tone]` (`ui.tsx:16`) | Build class names by string concatenation (`bg-${tone}`); Tailwind cannot see them |
| Reserve `faint` for icons and decoration | Use `faint` for any text that carries meaning |
| Use `field-edge` for input borders | Use `line` for input borders; it is 1.32:1 |
| Pair every state colour with an icon and words | Show correct / wrong by colour alone |
| Add new colours as tokens in `globals.css`, light and dark | Hard-code hex values in components |

## 4. Accessibility notes

- Body text (`ink`, `muted`) passes 4.5:1 on card and canvas in both themes.
- Every `-ink` passes 4.5:1 on its `-soft` tint **over a card** in both themes. Over the canvas, `pista-ink` (4.48) and `anar-ink` (4.42) fall just short in light mode.
- `on-accent` passes 4.5:1 on every base fill except **saffron in light mode (2.25:1)**. It also fails the 3:1 non-text minimum, so white check marks and icons on saffron are hard to see.
- `field-edge` meets 3:1 on the card in both themes, but not on the light canvas (2.92).
- The global focus ring is just under 3:1 against both surfaces in both themes (2.76–2.95), except dark canvas (3.20).
- `prefers-contrast: more` swaps `line` for `field-edge` and gives cards a `field-edge` ring (`globals.css:548-555`). `prefers-reduced-transparency` makes every material solid (`globals.css:531-539`).
- State is never colour-only: the feedback sheet adds an icon, a title and `role="status"`; nav items add `aria-current`; week-strip days add `title` and `sr-only` text.

## 5. Code reference

- Tokens: `src/app/globals.css:25-100` (light, `@theme`), `:181-217` (dark), `:218-256` (Auto + system dark).
- State colours: `tile` `globals.css:388-433`; buttons `globals.css:261-354`.
- Tone map: `TONE` in `src/components/ui.tsx:16-23`; `Tone` type `ui.tsx:13`.
- Theme: `src/app/layout.tsx:5-7`, `:42-46`, `:53`; `src/lib/store.ts:183`, `:221-227`; `src/app/app/settings/page.tsx:77-90`.
- Stat chips: `src/components/AppNav.tsx:71-82`; week strip `src/components/home/HomeSections.tsx:21-68`.
- Canvas drawing reads tokens at runtime with hex fallbacks: `src/components/TraceCanvas.tsx:99`, `:116`.

## 6. Gaps and recommendations

**P0**
- **White on saffron fails in light mode (2.25:1).** Used on completion medallions (`LessonSession.tsx:283`, `FlashcardSession.tsx:324`, `practice/page.tsx:85`, `speak/page.tsx:50`, `bookmarks/page.tsx:49`, `sounds/page.tsx:132`), done lesson nodes (`lessons/page.tsx:13`), checklist ticks (`app/page.tsx:79`) and the mission-mastered badge (`MissionSession.tsx:80`). *(proposed)* Add `--color-on-saffron` (`#000000` or `saffron-ink`-dark, 9.33:1 for black) or darken the light saffron fill to reach 3:1 for icons.

**P1**
- **Focus ring is below 3:1** (2.76–2.95) on card and light canvas. *(proposed)* Use solid `sky` (4.80 light, 4.66 dark on card) instead of 70%.
- **`prefers-contrast: more` does not reach dark mode.** The override is on `:root` (specificity 0,1,0), but `:root[data-theme="dark"]` and `:root:not([data-theme="light"])` (0,2,0) redefine `--color-line`, so the higher-contrast separators only apply in light mode, and dark is the default (`globals.css:181`, `:219`, `:549-550`). *(proposed)* Repeat the override inside the dark selectors.
- **`pista-ink` and `anar-ink` on their tint over the canvas** are 4.48 and 4.42. This happens on the path page "Next up" panel, whose tone cycles through all six (`path/page.tsx:10`, `:48-49`). *(proposed)* Darken light `pista-ink` and `anar-ink` slightly, or always place tints on a card.
- **Saffron as text or icon colour** (`text-saffron`, `fill-saffron`) on cards is 2.25:1 in light: bookmark on-state (`ui.tsx:140`), stars (`SoundPath.tsx:15`, `HomeSections.tsx:221`, `sounds/page.tsx:97`). *(proposed)* Stroke with `saffron-shadow` (3.30) as the XP chip does.
- **`theme-color` and the manifest ignore the in-app theme.** Meta follows the device scheme (`layout.tsx:43-46`); the manifest is always `#f2f2f7` though the app defaults to dark (`manifest.webmanifest:9-10`). *(proposed)* Update `<meta name="theme-color">` in `applyTheme()`; set the manifest to `#000000`.

**P2**
- **Streak uses anar, the error colour.** The skill says reward is saffron (`SKILL.md:26`); the flame, week strip and daily-goal bar use anar (`AppNav.tsx:73-74`, `HomeSections.tsx:31`, `:47`, `:61`). Document this as a deliberate exception or *(proposed)* move streak to saffron.
- **`field-edge` on the light canvas is 2.92.** Fine today because inputs sit on cards; note it for any input placed on the canvas.
- **Dark values are duplicated** (`globals.css:181-217` and `:218-256`). *(proposed)* Generate both from one list to avoid drift.
- **Hard-coded fallbacks** in `TraceCanvas.tsx` (`#e5e5e5`, `#12a594`) do not match current tokens (`line`, firuze `#0a8276`).
- **`-shadow` tokens are nearly unused** (two classes in the app). *(proposed)* Keep only `saffron-shadow`, or document them as "pressed" shades for future use.
- **`.tile-bg` is defined but unused** (`globals.css:612-615`).
