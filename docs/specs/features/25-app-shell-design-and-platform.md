# F25 · App shell: landing page, navigation, design system, accessibility and platform

**Product line:** Cross-cutting (supports all 8 lines) · **Priority:** P0 · **Prototype status:** ✅ Live (offline service worker 🔜)

## 1. Summary

Everything around the features:

- the public **landing page**;
- the **five-tab navigation**;
- the **design system** (Apple-style interface principles with Farsi Pen's own colours);
- **accessibility** to WCAG AA;
- **PWA** installability;
- **hosting**: a static site with dev and prod channels;
- the optional **Cloudflare Worker**.

## 2. Why it matters

- A calm, consistent, accessible interface is what makes a lot of features feel like one product.
- A static, no-backend architecture keeps the product free to run and private by default.

## 3. How it works in the prototype

### 3.1 Landing page (`/`)

- A chip reads "MVP demo · free · no sign-up".
- Headline: **"Learn to read, write and speak Farsi."** Subhead: "Five-minute lessons, smart review, and a pen for practising the alphabet. Everyday spoken Persian, with formal forms clearly labelled."
- CTAs: **Get started** (opens Lesson 1 · Greetings) and **I already have progress** (opens Home).
- The hero is a stack of the app's own UI (quiz card, path node, XP chip).
- 9 feature cards: Real-world missions · Smart flashcards · Speak and get scored · Grammar A1 → B2 · Write the letters · Bite-size lessons · Real people, real videos · Finglish or فارسی · Progress that means something.

### 3.2 Navigation (`AppNav.tsx`)

- **Five tabs:** Home · Path · Exams · Progress · Profile.
- **Phone:** a floating "liquid glass" capsule tab bar, with a glass pill that slides to the current tab (no motion when reduced motion is on).
- **Desktop:** a sidebar with the tabs, then *Practice* (Words, Speak, Scenes, Hands-free, Daily Practice, AI tutor) and *Course* (Sounds, Lessons, Missions, Grammar, Reading, Alphabet, Poetry, SAMFA).
- **Top bar:** logo (an "FA" monogram on a teal tile), streak and XP. A **DEV** badge shows on the dev site.
- Every page highlights the tab it belongs to.

### 3.3 Design system (`docs/design-system.md`, the `farsi-pen-design-system` skill)

- **Surfaces:** grouped surfaces on a soft canvas (true black in dark mode), cards without borders, hairline separators, large radii.
- **Materials:** translucent blurred materials for bars and sheets. They turn solid when transparency is reduced or blur isn't supported.
- **Type:**
  - the system font for Latin text (SF on Apple devices);
  - **Yekan Bakh** for Persian;
  - hierarchy by weight (titles 700, headlines 600, labels 500, body 400);
  - sentence-case buttons.
- **Colour tokens:** firuze (turquoise, primary), saffron, anar (pomegranate), pista (pistachio), plum, sky. Each has soft, ink and shadow variants, tuned for light and dark.
- **Motion:** instant press feedback (scale on pointer-down); critically damped motion with no overshoot; no looping animations.
- **Persian text:** right-to-left handling with `dir="auto"` inputs. Coloured letters keep cursive joins (zero-width joiners).
- **Helper agents** in the repo: `ui-engineer` and `design-system-reviewer` (`.claude/agents`).

### 3.4 Accessibility

- From axe and Hallmark audits:
  - text contrast ≥ 4.5:1;
  - labelled progress bars;
  - focus rings for keyboard users only;
  - charts with data tables;
  - landmarks;
  - role=img on avatars;
  - no sideways scroll at 320 px;
  - 16 px inputs (no iOS zoom);
  - 40–44 px touch targets.
- Respects reduced motion, reduced transparency and more contrast.

### 3.5 Platform

- **Next.js 16** (App Router), React 19, TypeScript, Tailwind CSS 4, with **static export**.
- **Hosting:** GitHub Pages.
  - `main` → `/farsi-pen/`.
  - `dev` → `/farsi-pen/dev/` (DEV badge, own storage key, hidden from search engines).
  - Every deploy runs the **841 unit tests** first.
  - Moving to Vercel needs no code changes; just drop the base path.
- **PWA basics:** web manifest, icons (192, 512, maskable), Apple touch icon, theme colour, OG share image.
- **Optional API:** one Cloudflare Worker with KV (tutor, sync, feedback, `/health`). Every online feature is hidden unless `NEXT_PUBLIC_API_URL` is set.

## 4. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | Landing page matches today's scope | Copy updated (README is out of date) |
| 2 | Five-tab navigation, phone and desktop | Every route highlights a tab |
| 3 | WCAG 2.1 AA | axe run with no serious issues on all main routes |
| 4 | Installable PWA | Lighthouse PWA installable |
| 5 | Tests gate every deploy | CI fails on any test failure |
| 6 | Privacy-safe defaults | No analytics, ads or cookies without consent |

## 5. Real application

- **Offline service worker:** cache the app shell, audio and dictionary letters. Background sync.
- **Native apps** (iOS and Android, e.g. Capacitor or React Native) for push notifications, background audio and app-store presence.
- **Analytics (opt-in, privacy-first)** for the metrics in each feature spec.
- **Error monitoring** (privacy-safe), **performance budgets** and **feature flags**.
- **i18n** of the interface. **SEO pages** for each lesson or topic.
- **Production backend:** accounts (Supabase planned), a content CMS, payments.

## 6. Code references

`src/app/page.tsx` · `src/app/layout.tsx` · `src/app/app/layout.tsx` · `src/components/AppNav.tsx` · `src/components/ui.tsx` · `src/app/globals.css` · `docs/design-system.md` · `public/manifest.webmanifest` · `.github/workflows/deploy.yml` · `next.config.ts` · `worker/`
