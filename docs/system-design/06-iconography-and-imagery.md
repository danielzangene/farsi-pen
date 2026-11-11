# 06 · Iconography and imagery

Which icons, marks, emoji and drawings Farsi Pen shows, at what sizes, and the rules that keep them calm and accessible.

## 1. Principles

- **One icon family.** All interface icons come from lucide-react: outlined, round caps, 24px grid. No mixing in other sets.
- **Icons support words.** An icon sits next to a label, or carries an `aria-label` when it stands alone. Meaning never depends on an icon alone.
- **The brand is the "FA" monogram, nothing more.** One mark on a firuze tile, drawn from the same path everywhere: header, favicon, app icons, share image.
- **Restraint.** No mascot, no character art, no stock illustration, no confetti. Imagery is either the product itself (real UI in the landing hero), a teaching diagram (mouth diagrams), or a small emoji that names a topic.
- **Persian letters are imagery too.** Where a picture would be decorative, the app shows the letters being learned (sound-path badges, path items, scene avatars).

## 2. Specification

### 2.1 Icon library

| Fact | Value | Source |
|---|---|---|
| Library | `lucide-react` 1.65.0 | `package.json:16`, `node_modules/lucide-react/package.json` |
| Defaults | 24px, stroke 2, `currentColor` | `node_modules/lucide-react/dist/esm/Icon.mjs` (context defaults `size 24`, `strokeWidth 2`) |
| Accessibility default | Lucide adds `aria-hidden="true"` when no accessible prop (`aria-label`, `title`, children) is passed | `node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs:48` |
| Reach | 85 distinct icons imported in 56 files; 281 icon elements in JSX | grep of `from "lucide-react"` |
| Colour | Inherits text colour; tinted with `text-*-ink` on soft fills, `text-on-accent` on solid fills; filled glyphs use `fill-current` or `fill-<token>` | e.g. `src/components/AppNav.tsx:74,78` |

### 2.2 Icon sizes in use

Counted from `size-*` classes on lucide elements (281 total).

| Class | Pixels | Count | Typical use |
|---|---|---|---|
| `size-3`, `size-3.5` | 12, 14 | 3, 9 | Inside chips and tiny badges (`Check` in "Tested out", stars on Home) |
| `size-4` | 16 | 96 | Inline with 14–15px text and in `btn-sm` (`ArrowLeft` back links, `Zap` XP, `Lightbulb` hints) |
| `size-5` | 20 | 105 | **Default.** In 44px icon buttons, list rows, stat chips, StatCards (`Volume2`, `Bookmark`, `ChevronRight`, `Flame`) |
| `size-[22px]` | 22 | — | Sidebar links (`src/components/AppNav.tsx:162`) |
| `size-6` | 24 | 21 | Tab bar (`src/components/AppNav.tsx:174`), SessionHeader X (`src/components/ui.tsx:218`), Today plan checks |
| `size-7`, `size-8`, `size-9` | 28, 32, 36 | 8, 6, 8 | Large audio button (`size-7`), FeedbackSheet result icon (`size-8`, `src/components/ui.tsx:274`), lesson path nodes (`size-9`) |
| `size-10` – `size-12` | 40–48 | 11, 4, 9 | Result medallions (`PartyPopper`, `Trophy`, `Sparkles` in `size-20`/`size-24` circles), mic buttons |
| `size-14`, `size-16` | 56, 64 | 1, 1 | Hands-free and scene intro headers (`Headphones`) |

### 2.3 Stroke widths in use

| Stroke | Count | Where | Why |
|---|---|---|---|
| 2 (default) | ~245 | Most icons | Matches lucide's design at 20–24px |
| 1.9 / 2.3 | 1 rule | Tab bar: inactive 1.9, active 2.3 (`src/components/AppNav.tsx:174`) | Weight change marks the current tab, alongside colour |
| 1.8, 2.2 | 1, 2 | Large header glyphs (`CircleUserRound size-9`, `Headphones size-16`) | Keeps big icons from looking heavy |
| 2.5 | 14 | 16px icons beside text (`Lightbulb`, `Info`, `Library`, `Search`) | Holds weight next to semibold text |
| 3 | 14 | Small `Check`/`X` marks, `ArrowLeft size-4`, `ChevronRight` in rows, SessionHeader `X size-6` | Thin marks disappear at 12–16px |
| 3.5, 4 | 5, 3 | Check marks on done states (`Check size-6 strokeWidth={3.5}` in Today plan, `size-9 strokeWidth={4}` on lesson nodes) | Reads as a solid tick on a coloured disc |
| 7 (custom SVG) | 1 | LogoMark on a 64-unit box | Monogram weight, not a lucide icon |

### 2.4 Most-used icons and their meanings

Import counts across `src` (single-line and multi-line imports).

| Icon | Files | Meaning in Farsi Pen |
|---|---|---|
| `Check` | 19 | Correct, done, tested out |
| `Mic` | 13 | Speak / record; also the "Speak" section |
| `CheckCircle2` | 11 | Correct answer (FeedbackSheet), lesson completed |
| `X` | 10 | Close or quit a session; wrong (small) |
| `RotateCcw` | 10 | Try again, review again |
| `Loader2` | 10 | Loading (always with `animate-spin`) |
| `ChevronRight` | 10 | Row navigates deeper |
| `Zap` | 8 | XP earned (filled) |
| `Square` | 8 | Stop recording (filled) |
| `ArrowLeft` | 8 | Back link |
| `Volume2` | 7 | Play audio |
| `Star` | 7 | XP total (top bar, some StatCards) and star ratings |
| `PartyPopper` | 7 | Finished / celebration medallion |
| `XCircle` | 6 | Wrong answer (FeedbackSheet) |
| `Target` | 6 | Accuracy, "recognised", "nearly there" |
| `Play` / `Pause` | 6 / 4 | Media playback |
| `Headphones` | 5 | Hands-free listening |
| `Bookmark` | 5 | "My cards" (filled when saved) |
| `Flame` | 3 | Day streak (filled anar when active, `fill-line text-faint` when zero) |
| `Lightbulb` | 3 | Hint |
| `Lock` | 3 | Locked step, "Soon" |
| `Snail` | 1 | Play slowly |
| `Trophy`, `Crown`, `Sparkles` | 2, 1, 2 | Achievements; review stage on the sound path; new lesson / open the Divan |

Navigation icons (`src/components/AppNav.tsx:13-43`):

| Tab / page | Icon | Tab / page | Icon |
|---|---|---|---|
| Home | `House` | Sounds | `AudioLines` |
| Path | `Route` | Lessons | `BookOpen` |
| Exams, SAMFA, Placement | `GraduationCap` | Missions | `Compass` |
| Progress | `ChartColumn` | Grammar | `Puzzle` |
| Profile | `CircleUserRound` | Reading | `BookOpenText` |
| Words | `Layers` | Alphabet | `PenLine` |
| Speak | `Mic` | Poetry | `BookHeart` |
| Scenes | `Clapperboard` | My cards | `Bookmark` |
| Hands-free | `Headphones` | Daily Practice | `Repeat` |
| AI tutor | `MessagesSquare` | | |

### 2.5 Icon buttons

| Rule | Spec | Source |
|---|---|---|
| Shape and size | `btn-icon`: 44×44px, round, no letter-spacing; pair with `btn-ghost` or `btn-secondary` (or a solid variant for the main mic/audio action) | `src/app/globals.css:368-374` |
| Icon inside | `size-5` (20px) in a 44px button; `size-6` for the SessionHeader X | `src/components/ui.tsx:123,127,146,218` |
| Large variants | Prompt audio: `btn-sky btn-icon !size-14 !rounded-2xl` with `size-7`; mic: `!size-16` to `!size-24` round with `size-8` to `size-11` | `src/components/ui.tsx:102-103`, `src/components/SpeakRound.tsx:180-182` |
| Label | Every one of the 41 `btn-icon` uses has an `aria-label`; some add `title` for a pointer tooltip | grep of `btn-icon` |
| Toggle state | `aria-pressed` plus a visual change (Bookmark: `!text-saffron` and `fill-current`) | `src/components/ui.tsx:138-146` |
| Disabled | Ghost audio buttons use `disabled:!text-line-strong`; the `title` explains why | `src/components/ui.tsx:92,118,126` |
| Live state | Recording swaps `Mic` for a filled `Square` and the button to `btn-danger`; playing pulses | `src/components/SpeakRound.tsx:180-182` |

### 2.6 The brand mark

| Item | Spec | Source |
|---|---|---|
| Monogram path | `M14 46V18h14M14 31h11` ("F") and `M34 46l8-28 8 28M37 37h10` ("A") on a 64×64 box; stroke 7, round caps and joins | `src/components/AppNav.tsx:52-53`, `scripts/make-icons.mjs:22` |
| `LogoMark` | `size-9` (36px) tile, `rounded-xl` (12px), `bg-firuze`, `text-on-accent`; SVG at 78% of the tile, `aria-hidden` | `src/components/AppNav.tsx:49-57` |
| `Logo` | `LogoMark` + "Farsi Pen", `text-2xl font-extrabold tracking-tight text-firuze-ink`, `gap-2.5`; links to `/` with `aria-label="Farsi Pen home"`; `compact` hides the name; a saffron `DEV` chip on the dev site | `src/components/AppNav.tsx:60-68` |
| Where it appears | Sidebar, mobile top bar, landing header; a `size-7 rounded-lg` mark in the landing footer | `src/components/AppNav.tsx:99,120`, `src/app/page.tsx:144,241` |
| In-app colours | Light: white on #0a8276. Dark: black on #33d1c2 (`--color-on-accent` flips) | `src/app/globals.css:47,83,198,216` |

Generated assets (`node scripts/make-icons.mjs`, needs Playwright with Chromium and Python Pillow):

| File | Size | Shape | Source line |
|---|---|---|---|
| `public/icon.svg` | vector | tile `rx 14` (of 64), fill #12a594, white mark | `scripts/make-icons.mjs:25-30` |
| `public/icon-192.png`, `public/icon-512.png` | 192, 512 | rounded tile `rx 14` | `scripts/make-icons.mjs:52-53` |
| `public/apple-touch-icon.png` | 180 | square (`rx 0`); iOS rounds it | `scripts/make-icons.mjs:51` |
| `public/icon-maskable-512.png` | 512 | square, mark scaled to 80% (`inset 0.1`) so it stays inside the maskable safe circle | `scripts/make-icons.mjs:54` |
| `public/favicon.ico` | 16, 32, 48 | from a 48px rounded tile | `scripts/make-icons.mjs:55,64-70` |
| `public/og.png` | 1200×630 | dark #131f24 background, faint teal dot grid, 168px mark tile with a `0 12px 0 #0c7f72` lip, "Farsi Pen" in Nunito 900, tagline in #9db0ba with "Farsi" in #6be3d3 | `scripts/make-icons.mjs:33-41,57-60` |

Cache busting: `ICON_VERSION = 2` (`src/app/layout.tsx:13`) and `?v=2` in `public/manifest.webmanifest`. The manifest lists the SVG, 192, 512 and the maskable 512, `display: standalone`, `background_color` and `theme_color` #f2f2f7.

### 2.7 Emoji

Emoji are the only colour pictures in the app. They name a topic; they never carry state on their own.

| Where | What | Size / container | Source |
|---|---|---|---|
| Lessons | One per lesson (`Lesson.emoji`, e.g. 👋 greetings, 🙏 courtesy, 🔢 numbers, 🍵 food) | `text-3xl` in the current lesson node; `text-3xl` in Speak topic tiles; inline in the lesson title and "Up next" | `src/content/lessons.ts:15,35-65`, `src/app/app/lessons/page.tsx:80`, `src/components/home/HomeSections.tsx:252-253`, `src/components/LessonSession.tsx:64,301` |
| Missions | One per mission (🧺 bazaar, ☕ café, 🧭 directions, 🫖 guest, 👋 meet, 💊 pharmacy, 🚕 taxi) | `size-14 rounded-2xl bg-firuze-soft text-3xl`; detail `size-16 text-4xl`; upcoming missions `bg-paper grayscale` | `src/content/missions/*.ts`, `src/app/app/missions/page.tsx:31,60`, `src/components/mission/MissionScreen.tsx:55` |
| Today plan steps | 🗂️ review, ✍️ letter, lesson emoji, 🧩 grammar, mission emoji, 🗣️ sound workout, 🎤 speak | `size-11 rounded-full text-xl`; replaced by a `Check` on `bg-pista` when done | `src/lib/today.ts:62-96`, `src/components/TodayPlan.tsx:126-131` |
| Goal picker | 🧳 travel, 👨‍👩‍👧 family, 🏡 heritage, ✨ curious | `text-3xl` | `src/components/TodayPlan.tsx:10-14,64-65` |
| Badges | 14 badges (🌱, 📗, 🎓, 🔥 ×2, 🌙, 🗂️, 📚, ⭐, 🌟, ✍️, 🖋️, 🧩, 🏛️ …) | `size-12 rounded-full text-2xl`, `bg-saffron-soft` when earned, `bg-paper opacity-60 grayscale` when not | `src/lib/gamification.ts:107-120`, `src/components/Achievements.tsx:64-66` |
| Path items | Lesson and mission emoji, 🎬 scenes, 📖 reading, 🌹 poetry, 🧩 grammar | `size-11 rounded-xl`, `text-xl`, `aria-hidden` | `src/lib/path.ts:57,91,110,117,139,153`, `src/app/app/path/page.tsx:13-26` |
| AI tutor scenarios | 💬 ☕ 🚕 🧺 🫖 💊 🧭 | list and header | `src/app/app/tutor/page.tsx:28-70,178,215` |
| Feedback rating | 😞 😕 😐 🙂 😍 | `size-11 text-2xl` radio buttons labelled "1 of 5" … | `src/components/FeedbackCard.tsx:6,53-62` |
| Landing hero | 👋 in a firuze `size-16` circle | decorative, inside an `aria-hidden` hero | `src/app/page.tsx:125-129` |

Rules seen in code: emoji containers are `aria-hidden` and the title next to them carries the meaning; locked or unearned items are greyed with `grayscale` + `opacity-60` and also say so in text ("Soon", progress counts).

### 2.8 Persian-letter badges

| Where | What | Spec | Source |
|---|---|---|---|
| Sound path units | Letters for the unit's sounds: خ, ق غ, ر, آ اَ, او, ای, ه ح, ژ | `size-14 rounded-2xl`, `<Fa className="text-xl font-bold">`; unit colour fill + `text-on-accent` when open, `bg-paper text-muted` when locked | `src/lib/sound-path.ts:17-31`, `src/components/SoundPath.tsx:80-81` |
| Path items | الف (alphabet), خ (sound path) | Same `Badge` as emoji items: `size-11 rounded-xl`, `<Fa className="text-lg font-bold">`, tone soft fill or solid when done | `src/lib/path.ts:24-25,76-77`, `src/app/app/path/page.tsx:13-26` |
| Path badge switch | `/\p{Extended_Pictographic}/u` decides emoji (hidden from screen readers) versus Persian text (rendered with `<Fa>`) | — | `src/app/app/path/page.tsx:14` |

### 2.9 Mouth diagrams

`MouthDiagram` (`src/components/MouthDiagram.tsx`) draws a side view of the mouth, facing left, for each Persian sound.

| Part | Drawing | Token |
|---|---|---|
| Face outline, chin | Stroke 2.5, round caps | `stroke-muted` |
| Lips | Filled shapes | `fill-anar-soft stroke-anar` |
| Teeth | 6×9 rounded rects | `fill-card stroke-line-strong` |
| Roof of mouth, back of throat | Stroke 2.5 | `stroke-ink` |
| Tongue | Filled path that moves with place and jaw | `fill-firuze-soft stroke-firuze` |
| Air path | Dashed `4 5`, arrowhead marker | `stroke-sky`, `fill-sky` |
| Voice | Zigzag when voiced, flat line when not | `stroke-plum` / `stroke-line-strong` |
| Contact point | 4.5r dot with a 9r halo (pulsing) | `fill-saffron`, `fill-saffron/30` |

Box and text: `viewBox="20 0 160 170"`, `max-w-60` (240px; `max-w-44` when compact), `role="img"` with `aria-label="Mouth position: …"`, and a visible `figcaption` (`text-sm font-semibold text-muted`) built by `mouthCaption()`, e.g. "back of the tongue raised to the soft palate · air rubs through a narrow gap · voice off" (`src/components/MouthDiagram.tsx:24-27,64-105`). Used in `PronunciationFeedback` (`src/components/PronunciationFeedback.tsx:211`). All colours are tokens, so the diagram follows dark mode.

### 2.10 Scene cast avatars

`CastAvatar` (`src/components/scene/Cast.tsx:6-24`) is a solid circle in the character's tone with the first letter of their Persian name in `text-on-accent`.

| Size | Classes |
|---|---|
| `sm` | `size-7 text-sm` |
| `md` | `size-10 text-lg` |
| `lg` | `size-14 text-2xl` (scene intro overrides to `!size-20 !text-4xl`, `src/components/scene/ScenePlayer.tsx:149`) |
| Speaking | `ring-4 ring-sky/40` |

Cast (`src/content/scenes.ts:21-26`): Sara س (sky), Khale Mahin م (plum), Arash آ (firuze), Agha Mamad م (saffron), Shirin ش (pista), Driver ر (anar). Avatars are `aria-hidden`; `CastStack` overlaps `sm` avatars with `-space-x-2 ring-2 ring-card` and gives the group `role="img"` with "With Sara, Arash…" (`src/components/scene/Cast.tsx:26-33`).

### 2.11 What is deliberately absent

- No mascot, character illustrations, stock photos or decorative illustrations anywhere in `src` or `public/` (only icons, `og.png` and audio/data folders).
- Only four inline SVGs exist: the LogoMark, the MouthDiagram, the pronunciation score ring and the progress sparkline (`src/components/AppNav.tsx:52`, `src/components/MouthDiagram.tsx:66`, `src/components/PronunciationFeedback.tsx:55`, `src/app/app/progress/page.tsx:208`). No `<img>` or `next/image` is used.
- The landing hero is the product itself: a tilted quiz card, a path node and an XP chip built from real `card`, `tile`, `Bubble` and `chip` styles, marked `aria-hidden` (`src/app/page.tsx:88-137`).
- `.tile-bg` (a faint firuze dot pattern for hero areas) is defined but unused (`src/app/globals.css:612-615`).
- Embedded YouGlish videos (`src/components/YouglishPlayer.tsx`) are third-party content in a dialog, not Farsi Pen imagery.

## 3. Usage: do and don't

| Do | Don't |
|---|---|
| Use a lucide icon at `size-5` with the default stroke inside buttons and rows | Import icons from another set, or draw a one-off SVG icon |
| Use `size-4` with `strokeWidth={2.5}` next to small text | Use stroke 3+ on icons larger than 24px |
| Give every icon-only button `btn-icon` and an `aria-label` | Rely on `title` alone, or on the icon to explain an action |
| Pair status icons with text (`CheckCircle2` + "Correct!") | Show a coloured icon as the only sign of right or wrong |
| Reuse the icon meanings in 2.4 (`RotateCcw` = again, `ChevronRight` = go deeper) | Use one icon for two meanings, or two icons for one meaning |
| Put emoji in a tinted circle or tile, `aria-hidden`, with a text title beside it | Put emoji in buttons as the only label, or inside headings read by screen readers |
| Show the Persian letters being learned instead of a picture | Add a mascot, a character or a decorative illustration |
| Regenerate icons with `scripts/make-icons.mjs` and bump `ICON_VERSION` | Edit `public/*.png` by hand or copy another product's mark |

## 4. Accessibility notes

- Decorative icons stay hidden: lucide does this by default; keep it that way by not passing `aria-label` to icons that sit beside visible text.
- Meaningful standalone icons get a label: `<Check aria-label="Correct" />` style, as used in 5 places.
- Icon-only controls: 44px minimum target, `aria-label`, and `aria-pressed` for toggles.
- Non-text contrast: icons and avatar letters on a solid fill need 3:1 (icons) or 4.5:1 (letters below 18.66px bold). White on saffron #f09a0a is only about 2.2:1 (see Gaps).
- Emoji render differently on each platform; they must never be the only carrier of meaning.
- Persian letters in badges are real text in `<Fa>` (`lang="fa"`), so screen readers can read them with a Persian voice.
- The mouth diagram's meaning is fully available as text (`aria-label` and visible caption).

## 5. Code reference

- `src/components/AppNav.tsx` — `LogoMark`, `Logo`, navigation icons, tab/sidebar icon sizes and strokes.
- `scripts/make-icons.mjs` — favicon, app icons, maskable icon, OG image.
- `public/` — `icon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `favicon.ico`, `og.png`, `manifest.webmanifest`.
- `src/app/layout.tsx` — `ICON_VERSION`, icon and Open Graph metadata.
- `src/components/ui.tsx` — icon buttons in `AudioButtons`, `BookmarkButton`, `SessionHeader`, `FeedbackSheet`.
- `src/components/MouthDiagram.tsx`, `src/components/scene/Cast.tsx`, `src/app/app/path/page.tsx` (`Badge`), `src/components/SoundPath.tsx`, `src/components/Achievements.tsx`, `src/components/TodayPlan.tsx`.
- Content: `src/content/lessons.ts`, `src/content/missions/*.ts`, `src/lib/today.ts`, `src/lib/gamification.ts`, `src/lib/path.ts`, `src/lib/sound-path.ts`, `src/content/scenes.ts`.

## 6. Gaps and recommendations

> Priorities in this section are this designer's view. The agreed, deduplicated priority for each issue is in *13 · Governance and roadmap*, §3.

**P0**
- **White on saffron fails non-text contrast.** `text-on-accent` (white) on `bg-saffron` (#f09a0a) is about 2.25:1 in light mode, below the 3:1 minimum for icons and well below 4.5:1 for text. It is used for done lesson nodes (`src/app/app/lessons/page.tsx:13`), `size-24` result medallions (`src/components/FlashcardSession.tsx:324`, `src/components/LessonSession.tsx:283`, `src/app/app/speak/page.tsx:50`, `src/app/app/bookmarks/page.tsx:49`, `src/app/app/sounds/page.tsx:132`, `src/app/app/practice/page.tsx:85`) and Agha Mamad's avatar letter (`src/components/scene/Cast.tsx:12-14`). *(proposed)* Use `bg-saffron-soft text-saffron-ink` for medallions (as `LessonSession.tsx:132` already does), and `text-ink` (or a darker saffron) on solid saffron.

**P1**
- **App icons and share image use the retired brand.** `scripts/make-icons.mjs:19-20` fills the tile with #12a594, not firuze #0a8276; the OG image still uses Nunito 900, a dark #131f24 background and a hard `0 12px 0` lip shadow (`scripts/make-icons.mjs:33-41`), all of which the redesign dropped (`docs/design-system.md:9`). *(proposed)* Render icons in #0a8276, rebuild `og.png` with the system font stack (or Yekan Bakh for Persian), the canvas or card colour and no lip; then bump `ICON_VERSION` to 3. The `@fontsource-variable/nunito` dependency exists only for this script.
- **XP has two icons.** `Zap` (Home, flashcards, lesson results) and `Star` (top bar, grammar and mission results) both mean XP (`src/components/home/HomeSections.tsx:35`, `src/components/AppNav.tsx:78`, `src/components/GrammarLesson.tsx:47`). `Star` also means star ratings on the sound path. *(proposed)* Use `Zap` for XP everywhere and keep `Star` for ratings.
- **Emoji inside headings are read aloud.** The lesson title `h1` and "Up next" line render `lesson.emoji` as plain text (`src/components/LessonSession.tsx:64,301`), so screen readers announce "waving hand" before the title. *(proposed)* Wrap it in `<span aria-hidden>`.

**P2**
- **One icon, three destinations.** `GraduationCap` marks Exams, SAMFA and Placement (`src/components/AppNav.tsx:16,40-41`). *(proposed)* Keep it for the Exams tab; give SAMFA and Placement distinct icons (for example `ClipboardCheck`, already in use, for Placement).
- **No icon size or stroke tokens.** 13 sizes and 9 stroke values are in use. *(proposed)* Standardise on 16 / 20 / 24px for UI (40–48px for medallions) and strokes 2 (default), 2.5 (16px beside text), 3–3.5 (check and X marks at 16px or less).
- **In-app mark and app icon differ in dark mode.** The header mark is black on #33d1c2 in dark mode, the installed icon is white on #12a594, and the tile rounding differs (12/36 in app versus 14/64 in icons). *(proposed)* Decide whether the mark keeps a fixed light-mode colour in every theme, and match the corner ratio.
- **Manifest colours ignore the default dark theme.** The app is served dark by default (`src/app/layout.tsx:53`, `src/lib/store.ts:183`), but `background_color`/`theme_color` are #f2f2f7, so the installed app's splash screen is light. *(proposed)* Use #000000, or accept the flash and document it.
- **Duplicate emoji meanings.** 👋 is both the greetings lesson and the "meet" mission; 🔥 is used for two badges; 🧩 is a badge, a Today step and the path grammar item; 🗂️ is a badge and the review step. *(proposed)* Keep one emoji per concept in a shared list.
- **Duplicate SVG id.** Each `MouthDiagram` defines `id="mouth-arrow"`; two diagrams on one page produce duplicate ids. *(proposed)* Use `useId()`.
- **Mouth-diagram halo loops** (`animate-pulse`, `src/components/MouthDiagram.tsx:99`). See 05 · Materials and motion.
- **Unused `.tile-bg`** pattern in `src/app/globals.css:612-615`. *(proposed)* Delete it, or document where hero areas may use it.
- **The skill does not mention emoji or Persian-letter badges.** *(proposed)* Add a short "Imagery" section to the skill: lucide only, emoji only as `aria-hidden` topic markers in tinted containers, Persian letters as badges, no mascots or illustrations.
