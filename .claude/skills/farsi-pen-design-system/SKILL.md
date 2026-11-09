---
name: farsi-pen-design-system
description: Farsi Pen's UI design system — Apple-style interface principles on the web (grouped surfaces, translucent materials, system font with Yekan Bakh for Persian, weight-based hierarchy, instant press feedback, critically damped motion), with Farsi Pen's own brand colours. Use before building, changing or reviewing any screen or component in this project (src/app, src/components, globals.css).
---

# Farsi Pen design system

Farsi Pen follows Apple's interface principles (WWDC *Designing Fluid Interfaces*, *The Details of UI Typography*, *Principles of Great Design*), translated for the web: content first, calm surfaces, hierarchy from type, translucent floating chrome, and motion that responds instantly and settles without overshoot. Brand colours stay Farsi Pen's own.

Source of truth in code:
- Tokens and utility classes: `src/app/globals.css`
- React primitives: `src/components/ui.tsx`
- Notes: `docs/design-system.md`

## 1. Principles (the names to reason with)

- **Purpose & simplicity.** One clear primary action per screen; every element earns its place. Show the common path first, the rest one level deeper.
- **Response.** Feedback on pointer-down, never only on release: buttons scale to 0.97, tiles to 0.98, instantly.
- **Restraint.** No gradients for decoration, no mascots, no confetti, no looping animations. Delight comes from getting the rest right.
- **Familiarity.** Grouped lists, tab bar, sheets with a grabber, segmented controls — patterns people already know. Same-looking things behave the same.
- **Wayfinding.** Every screen answers: where am I, where can I go, how do I get out (SessionHeader X, back links).

## 2. Brand guardrails

- Never copy another product's branding (logos, mascots, illustrations, fonts, exact brand colours).
- Primary is **firuze** (turquoise); reward is **saffron**; error is **anar** (pomegranate); success **pista**; info/selection **sky**; grammar **plum**.
- Brand mark: the "FA" monogram on a firuze tile (`<LogoMark />` / `<Logo />` in `AppNav.tsx`; icons via `scripts/make-icons.mjs`).

## 3. Tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `canvas` | #f2f2f7 | #000000 | Page background (grouped) |
| `card` | #ffffff | #1c1c1e | Raised surfaces |
| `paper` | grey 12% (translucent) | grey 24% | Fills: insets, segmented track, disabled buttons, progress track |
| `line` / `line-strong` | translucent separators | translucent | Hairline borders, dividers |
| `ink` / `muted` / `faint` | #1d1d1f / #5e5e63 / #a1a1a6 | #f5f5f7 / #a1a1a6 / #636366 | Text: primary / secondary / decorative only |
| `field-edge` | #8e8e93 | #7c7c80 | Input borders (3:1, WCAG 1.4.11) |
| `firuze` `pista` `anar` `saffron` `sky` `plum` | base fills | brighter fills | Accents |
| `-soft` | colour mixed 13–18% with transparent | same | Tinted backgrounds (adapts to any surface) |
| `-ink` | darker shade | lighter shade | Text on `-soft` (AA) |
| `on-accent` | white | black | Text/icons on a solid accent fill |

Rules:
- Never hard-code colours (`bg-white`, hex). Text on fills is `text-on-accent`.
- Neutral fills and separators are translucent, so they read on canvas, on cards and in dark mode. Don't put `bg-paper` where something must be opaque (use `bg-card`).
- Dark mode is true black with raised greys; base accents brighten, `-soft` follows automatically.
- `-shadow` tokens remain only as pressed/darker shades (e.g. star icon strokes). No 3D lips.

## 4. Typography

- **Latin:** the system font (`--font-sans`: -apple-system / SF Pro, Segoe UI Variable, Roboto…). **Persian:** Yekan Bakh (variable, DOTS 1 in text, 0 in headings) via `<Fa>` / `[lang="fa"]` — keep it.
- **Hierarchy from weight + size + leading.** Weights are remapped in the theme: `font-extrabold` = 700 (titles), `font-bold` = 600 (headlines, emphasised Persian), `font-semibold` = 500 (labels, light emphasis), body = 400. Prefer the lighter step when in doubt.
- **Tracking is size-specific:** h1 −0.022em, h2 −0.012em, body 0. `eyebrow` (13px, 500, uppercase, +0.02em) is only for grouped-list section headers. Buttons are sentence case. Never letter-space or uppercase Persian (`[lang="fa"]` resets both).
- **Leading:** tight on large headings (1.12–1.2), 1.5 for body, loose for Persian running text (`leading-loose` / 2.2 in reading blocks).

## 5. Utility classes (globals.css)

| Class | Use |
|---|---|
| `btn-primary` | The one main action (firuze fill). |
| `btn-success` / `btn-danger` | Continue after a correct / wrong answer. |
| `btn-sky`, `btn-plum` | Audio buttons; grammar CTAs. |
| `btn-secondary` | Tinted (firuze-soft fill, firuze-ink label): second action. |
| `btn-ghost` | Plain: icon actions, back, skip. |
| `btn-sm`, `btn-lg`, `btn-icon` | Sizes; `btn-icon` is round. On a solid colour banner, use `btn` with `[--btn-bg:rgb(0_0_0/0.2)] [--btn-fg:var(--color-on-accent)]`. |
| `card` | Grouped container: card colour, 20px radius, faint shadow, no border. |
| `tile` | Tappable row/option: 1px hairline, 16px radius, scales on press. `data-state="selected|correct|wrong|current"`. |
| `material` / `material-canvas` | Translucent blurred layer for floating chrome (top bar, session header, bottom action bars). Content scrolls underneath. |
| `glass` | Light Liquid Glass for floating controls: the mobile tab bar (a capsule above the bottom edge with a glass pill that slides to the current tab) and the lesson action bar. Mostly opaque (`--glass-opacity` 62% / 66%) with a bright top edge and soft shadow, so text stays legible. |
| `chip`, `input`, `eyebrow` | Pills; text fields (1px field edge, focus ring); section headers. |
| `animate-pop`, `animate-slide-up`, `animate-shake` | Appear (scale 0.96→1, no overshoot); sheet entrance (iOS sheet curve); wrong answer (small shake). |

Borders are hairlines: use `border` (1px), not `border-2`. No `shadow-[0_Npx_0_…]` lips. Don't restyle buttons ad hoc; add a variant to globals.css.

## 6. Primitives (`src/components/ui.tsx`)

- `Fa` — any Persian text. `FaWord` — a word per script settings.
- `ProgressBar` — thin capsule (10px, `sm` 6px) on a `paper` track.
- `SessionHeader` — sticky translucent bar with X + progress (+ right slot); enables focus mode (hides app nav).
- `FeedbackSheet` — bottom action bar. Idle: material bar holding the main action. Answered: a sheet with rounded top corners, tinted pista/anar over the card colour, icon, title, detail and Continue.
- `StatCard` — card with a small muted label over a large tinted value.
- `Bubble`, `AudioButtons` (`big` for prompts), `BookmarkButton`, `RegisterTag`, `Segmented` (iOS segmented control), `PageHeader`, `TONE`.

## 7. Materials, depth and dialogs

- Floating chrome is translucent (`material*`, `glass`), never an opaque strip. Heavier/structural regions (sidebar) are solid `card`.
- The phone tab bar floats: `inset-x-3`, `bottom: max(0.75rem, safe area)`, `rounded-[1.75rem]`. Page content keeps `pb-[calc(7.5rem+safe area)]` so nothing hides under it; anything sticky above it sits at `bottom-[calc(5.25rem+safe area)]`.
- Don't stack a translucent surface on another translucent one.
- Modal dialogs dim and blur the background (`backdrop:bg-black/40` + global backdrop blur), use `!rounded-[1.75rem]`, and pop in from 0.96. Bottom sheets slide up with the sheet curve and show a grabber.
- `prefers-reduced-transparency` makes materials solid; `prefers-contrast: more` turns separators into the field edge.

## 8. Motion

- Default: critically damped (`--ease-spring`, no overshoot), 160–300ms. Sheets: `--ease-sheet`, ~420ms.
- Press: scale on `:active` with a 60ms transition. Enter and exit along the same path; anchor popovers to their trigger.
- No looping or bobbing animations; no bouncing on things that merely appear.
- `prefers-reduced-motion`: animations collapse to instant (globals.css). Theme changes ease the background colour.

## 9. Farsi / RTL rules

- Persian text only through `<Fa>`; never set `dir` on a whole LTR layout. Reading blocks are `dir="rtl"` blocks.
- Show transliteration per `settings.script`; respect `scriptOnly`.
- Persian digits come from the FaNum font.

## 10. Accessibility checklist

- Hit targets ≥ 44px; icon buttons have `aria-label`.
- Inputs use `field-edge`; disabled labels use `muted`.
- Focus ring: 3px sky outline (global).
- State is never colour-only: icons + text accompany correct/wrong/selected.
- `text-on-accent` only on solid accent fills, at ≥ 15px semibold.

## 11. Review checklist (use for PRs)

1. Uses primitives/utilities; no one-off colours, shadows, radii or 2px borders.
2. One primary action per screen; disabled until valid.
3. Sessions: SessionHeader + FeedbackSheet; no nav visible.
4. All Persian through `<Fa>`; script settings respected.
5. States covered: empty, loading/hydrating, success, error, disabled.
6. Works at 375px wide with no horizontal scroll; the tab bar doesn't cover content.
7. Hierarchy from weight and size; sentence-case labels; no uppercase except `eyebrow`.
8. Motion is instant on press, settles without overshoot, nothing loops; floating chrome is translucent.
9. No brand assets from other products (§2).
