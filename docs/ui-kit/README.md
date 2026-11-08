Farsi Pen teaches people to read, write and speak everyday Persian. The UI is playful and bright, the way gamified language apps feel, but the brand is its own: turquoise **firuze**, **saffron** rewards and **anar** (pomegranate) for mistakes, the FA monogram, and Persian set in Yekan Bakh. Dark mode is the default.

Build every screen from these tokens and components. The code lives in `danielzangene/farsi-pen`: tokens and utility classes in `src/app/globals.css`, React primitives in `src/components/ui.tsx`, navigation in `src/components/AppNav.tsx`.

## Principles

- **One thing to do.** Each screen has one primary button (`btn`, firuze). Everything else is secondary, ghost or a tile.
- **Instant, kind feedback.** Every answer gets a coloured sheet within 200ms: `pista` for right, `anar` for wrong, always with an icon and words, never colour alone.
- **Spoken Persian first, formal shown.** Words carry a `Spoken` (saffron) or `Formal` (plum) chip when the two differ.
- **The pen.** Writing is the brand's promise: the alphabet, tracing and script-only mode get first-class space.
- **Never copy another brand.** No owl or mascot lookalike, no Duolingo green `#58CC02`, no Feather or DIN Round fonts, no other product's name in copy.

## Content and voice

- Second person, short and warm, never scolding. One exclamation mark per message at most.
- Real examples: "Nicely done!", "Almost! Watch the spelling.", "Not quite. We'll come back to it.", "Lesson complete!", "That's enough for today."
- Buttons are verbs and render UPPERCASE through the `button` style: CHECK, CONTINUE, START, SKIP TO QUIZ. Everything else is sentence case.
- Name features by what the learner does: "Say it", "Hands-free", "My cards", not system names.
- Persian appears in script with transliteration under or beside it (style: `â` long a, `kh`, `gh`, `sh`, `zh`, `ch`, `'` for ع/ء), following the learner's Latin-first / Farsi-first / script-only setting.
- Emoji are content, not decoration: one per lesson, mission or scene as its picture (👋 Greetings, 🚕 Take a taxi). Don't put emoji in headings, buttons or copy.

## Colour

- Surfaces: `card` for the page and every surface; `paper` for inputs, inset areas and hover. Borders are `line` at 2px.
- Text: `ink` for body and headings, `muted` for secondary text, `faint` only for placeholders and zero-state numbers.
- Each hue is a family of four: the fill (`firuze`), its 3D edge (`firuze-shadow`), a tinted background (`firuze-soft`) and readable text on that background (`firuze-ink`). Always pair a fill with its `-shadow`, and text on a `-soft` with its `-ink`.
- Roles: `firuze` primary and brand · `pista` correct · `anar` wrong, destructive, streak · `saffron` XP, badges, done · `sky` selected, audio, focus, links · `plum` grammar and Formal.
- Text and icons on a solid fill use `on-accent`, never a literal white: it is white in light mode and dark (`#131f24`) in dark mode.
- Dark is the default theme (`<html data-theme="dark">`). Learners can pick Light, or Auto to follow the device. Never hard-code a colour; canvas code reads the tokens when it draws.

## Type

- Latin: Nunito, weights 500 to 800. Headings 800 (`page-title`, `prompt`, `title`), running text 600 (`body`, `body-sm`). Labels above sections use `eyebrow` (12px, 800, uppercase, 0.08em tracking).
- Persian: Yekan Bakh (variable, Persian digits). Wrap every Persian string in `<Fa>` so it gets `lang="fa"`, `dir="rtl"` and the font. Running text uses the dotted style (`DOTS 1`); headings use the plain style (`DOTS 0`).
- Never letter-space or uppercase Persian: tracking breaks letter joining. `[lang="fa"]` resets both, even inside buttons.
- Persian digits come from the font; don't convert numbers by hand.

## Shape, spacing and depth

- Radii: `radius-md` (16px) for buttons, tiles, cards and inputs; `radius-sm` (12px) for small buttons, icon buttons and segmented options; `radius-full` for chips, progress bars and path nodes; `radius-lg` (24px) for the top of bottom sheets.
- Borders are `border` (2px). Tappable surfaces add a `tile-edge` (4px) bottom border.
- No soft shadows. Depth is a solid edge in the fill's `-shadow` colour: `edge-primary` (4px) under buttons, `edge-sm` (3px) on small buttons and the logo tile, `edge-node` (6px) under path nodes. Pressing removes the edge and moves the element down by the same amount.
- Spacing is a 4px scale. Side gutter `space-4` on phones; sections `space-6` apart; option grids `space-3`.
- Widths: sessions `session-max` (768px), app pages `page-max` (1024px), desktop sidebar `sidebar-w` (256px). Hit targets at least `tap-min` (44px).

## Motion

- Press: 100ms. Sheets slide up in 220ms and icons pop in 250ms with a slight overshoot (`cubic-bezier(0.34, 1.56, 0.64, 1)`). Progress bars ease over 500ms. A wrong answer shakes once (350ms). The START bubble bobs (1.6s loop).
- Everything is disabled under `prefers-reduced-motion`.

## Iconography

- Lucide icons (`lucide-react`), stroke 2.5, 20px in rows and buttons, 24 to 26px in navigation, in the colour of their text.
- Icon-only buttons always have an `aria-label`.
- Tones per feature, used for nav icons and row badges: Home and Missions firuze, Lessons and My cards saffron, Words and Scenes sky, Speak anar, Grammar and Poetry plum, Alphabet pista.
- The brand mark lives in Assets › Logos. Use `LogoMark` / `Logo`; never redraw it.

## Accessibility

- Focus ring: 3px `sky`, offset 2px, everywhere. Don't remove it, and don't autofocus buttons on page load.
- Input and select borders use `field-edge` (3:1 or better). Disabled labels use `muted`, not `faint`.
- Correct and wrong always show an icon and words as well as colour.
- Known gap to fix: in light mode, white `on-accent` labels on fills are 3.1 to 4.1:1 (2.0:1 on saffron), below 4.5:1 for 12 to 15px text. Dark mode passes everywhere. See the Review checklist section.
