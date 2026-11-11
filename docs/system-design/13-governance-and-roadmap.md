# 13 · Governance, review and roadmap

How the Farsi Pen design system is owned, changed and checked, and the prioritised backlog that came out of documenting it.

## 1. Principles

- **One source of truth per layer.** Tokens live in `globals.css`, primitives in `ui.tsx`, rules in the skill, and explanation in these docs. When they disagree, the code wins until the system is fixed.
- **Add to the system, never around it.** A missing style becomes a token, variant or primitive. It is never a one-off class on a single screen.
- **Docs change with the code.** A change to tokens or primitives updates the matching doc in the same pull request.
- **Review before merge.** Every UI change gets a design-system review: by a person, or by the `design-system-reviewer` agent.

## 2. Specification

### 2.1 Ownership (design team)

| Role | Owns | Docs |
|---|---|---|
| Head of design | Principles, brand, governance, final call on changes | 00, 01, 13 |
| Visual foundations designer | Colour, type, tokens; Figma variables | 02, 03, 12 |
| Layout and interaction designer | Layout, spacing, elevation, materials, motion, icons | 04, 05, 06 |
| Component library designer | Components and the `ui.tsx` primitives | 07 |
| UX patterns and content designer | Patterns, voice, copy | 08, 11 |
| Inclusive design lead | Persian/RTL, accessibility | 09, 10 |
| `ui-engineer` agent | Builds screens strictly on the system; proposes new primitives instead of adding them | n/a |
| `design-system-reviewer` agent | Read-only review of any UI change against the skill | n/a |

### 2.2 How the system changes

1. **Propose:** describe the need, the screens affected, and why existing tokens, variants or primitives don't fit.
2. **Design:** sketch the variant or primitive with all its states (see 07), in light and dark, at 375 px and 320 px.
3. **Check:** contrast (02, 10), Persian rendering (09), motion rules (05), copy (11).
4. **Build:** in `globals.css` or `ui.tsx` only. Replace the one-offs it supersedes in the same change.
5. **Document:** update the doc, the token reference (12) and the skill (`.claude/skills/farsi-pen-design-system/SKILL.md`).
6. **Review:** run the `design-system-reviewer` agent; fix every P0 and P1 finding before merge.

**Versioning** *(proposed)*: tag the system as `ds-vN` in the changelog below; breaking changes (renamed tokens, removed variants) need a migration note.

### 2.3 Review checklist (every UI pull request)

1. Uses only tokens, utilities and primitives: no hex, Tailwind palette colours, one-off shadows or radii, and no `border-2`.
2. One primary action per screen; it stays disabled until the input is valid.
3. Sessions use SessionHeader and the shared bottom bar, in focus mode, including the result screen.
4. All Persian goes through `<Fa>`; script settings are respected; no tracking or uppercase on Persian.
5. Every state is covered: empty, hydrating, loading, success, error, disabled, offline, permission denied.
6. Works at 375 px and doesn't break at 320 px; nothing is hidden behind the tab bar or the bottom bar.
7. Hierarchy comes from weight and size; labels are sentence case; uppercase is used only for `eyebrow`.
8. Press feedback is a scale on pointer-down; nothing overshoots; loops only for a live state (loading, playing, listening).
9. WCAG 2.1 AA: contrast, 44 px targets, labels on icon buttons, state never shown by colour alone, keyboard path, focus visible and returned.
10. Copy follows 11: one name per feature, error = what happened + what to do, "Profile" not "Settings".
11. No assets from other brands.

### 2.4 Tooling

| Tool | Status |
|---|---|
| Design rules skill for agents | ✅ `.claude/skills/farsi-pen-design-system/SKILL.md` |
| Builder and reviewer agents | ✅ `.claude/agents/ui-engineer.md`, `design-system-reviewer.md` |
| Unit tests in CI | ✅ 841 tests gate every deploy (no visual or accessibility tests) |
| Automated accessibility checks | ❌ *(proposed: axe via Playwright on main routes, light and dark)* |
| Visual regression screenshots | ❌ *(proposed)* |
| Figma library | ❌ *(proposed, see roadmap)* |
| Lint rules for the system | ❌ *(proposed: forbid hex, `border-2`, `tracking-*` on `lang="fa"`)* |

## 3. Consolidated design backlog

The gaps the team found while documenting the prototype, merged and deduplicated. The source docs have file and line details.

### P0: fix before public launch

| # | Issue | Fix *(proposed)* | Docs |
|---|---|---|---|
| 1 | **White icons and text on saffron are 2.25:1** in light mode (result medallions, done lessons, checklist ticks, mission badge, cast avatar) | `saffron-soft` + `saffron-ink`, or a dark `on-saffron` token | 02, 06, 10 |
| 2 | **Single-key answer shortcuts can't be turned off** (1–4, A–D, 1–3; WCAG 2.1.4) | A "Keyboard shortcuts" switch, or listen only when focus is in the option group | 10 |
| 3 | **Tap targets under 44 px:** `btn-sm` is 36 px (69 uses, some primary), segments are 40 px | Raise the minimum height; keep `btn-sm` for secondary actions | 07, 10, 12 |
| 4 | **Focus ring is below 3:1** (sky at 70%) | Use solid sky | 02, 10 |
| 5 | **Report popover:** no Escape or outside-click close, no focus move | Build it on `<dialog>` or a popover primitive | 07, 08 |
| 6 | **Result screens are inconsistent:** some stay in focus mode, others show the tab bar | A `ResultScreen` primitive that includes focus mode | 08 |

### P1: next design sprint

| # | Issue | Fix *(proposed)* | Docs |
|---|---|---|---|
| 7 | Looping animations (pulse, ping, spin, mouth-diagram halo) against the "no loops" rule; reduced motion may not stop them | Allow loops only for live states, written into the skill; add `animation-iteration-count: 1` under reduced motion; static halo | 05, 07, 10 |
| 8 | The skill promises a sheet grabber that doesn't exist | Remove it from the skill (sheets aren't draggable) | 05, 07, 08 |
| 9 | Grammar "Start exercises" bar: gradient, and a 4 rem offset that the tab bar can cover | Use the glass action bar at the standard offset | 04, 05, 08 |
| 10 | Safe-area insets are probably 0 (no `viewportFit: "cover"`) | Add it; test on a notched iPhone | 04 |
| 11 | Three different builds of the session bottom bar (one opaque) | A `SessionFooter` / `ActionBar` primitive | 07, 08 |
| 12 | Brand assets out of date: icon teal `#12a594` ≠ firuze; share image in Nunito with a 3D lip | Regenerate from tokens; remove Nunito | 01, 06 |
| 13 | Tab labels are 10 px (the audit had fixed them at 11 px) | Back to 11 px | 10 |
| 14 | `prefers-contrast: more` doesn't reach dark mode (the default) | Repeat the override in the dark selectors | 02, 12 |
| 15 | Copy: "Profile" tab, but 13 strings say "Settings"; "Total XP" means two things; feature names vary | One name per feature; "XP earned" on results | 11 |
| 16 | Persian outside `<Fa>`; grammar ignores Script only; reversed "yek ۱" cells; inconsistent Persian alignment | Fix the strings; an alignment rule (see 09) | 09 |
| 17 | Mic button built 4 times with two idle colours; Segmented has no arrow keys | `MicButton` primitive; roving tabindex | 07, 10 |
| 18 | Typing instead of speaking exists only in missions; SAMFA listening has no non-audio route; fixed timers | "Type it instead" in Speak and Scenes; untimed practice mode | 10 |
| 19 | No exit confirmation in long sessions (SAMFA mock, writing) | Confirm in place only when work would be lost | 08 |
| 20 | Dialog focus isn't returned on close | Call `close()` and refocus the opener | 10 |

### P2: polish and system health

- **Tokens:** layout offsets, radii (28/24 px), shadows and durations as tokens. A `focus-mode` custom variant. Remove unused utilities (`.tile-bg`, `animate-bob`, `font-display`). Generate dark values once. Select chevron from a token.
- **Type:** named text styles (`title-1`, `title-2`, `body`, `subhead`, `caption`, `fa-display`, `fa-reading`); one h1 tracking value; ship woff2.
- **Icons:** `Zap` for XP everywhere, `Star` only for ratings; distinct icons for SAMFA and Placement; size and stroke scale; emoji `aria-hidden`; unique SVG ids.
- **Components:** `BackLink`, `EmptyState`, `Dialog`, `CheckboxRow`, `NextUpCard`, `OptionTile` primitives; rename the chat `Bubble`; replace old 3D press effects with scale; specific `ProgressBar` labels.
- **Content:** curly quotes, digits for numbers, consistent ranges and dates, no ALL CAPS ("New", "Dev"), sentence case for lesson titles, publish the transliteration standard to learners.
- **Accessibility:** skip link, axe in CI, alphabet tile labels, keyboard group role, smooth scroll and backdrop blur under the user's preferences, dyslexia options.
- **Theme:** `theme-color` and the manifest should follow the app's dark default.

## 4. Roadmap *(proposed)*

| Phase | Goal | Deliverables |
|---|---|---|
| **Now: launch readiness** (2 weeks) | Close the P0 list | P0 fixes 1–6; axe check in CI; review checklist in the PR template |
| **Next: system v2** (1–2 months) | Fewer one-offs, tokens for everything | P1 list; new primitives (ResultScreen, SessionFooter, MicButton, Dialog, EmptyState); duration, shadow, radius and offset tokens; named text styles; refreshed icons and share image |
| **Next: Figma library** | Design and code share one source | Variables from 12 (two collections: Theme with Light and Dark modes, and Core); components from 07 with variants for every state; page templates from 08; a brand sheet from 01 |
| **Later: scale** | Native apps and Persian UI | Native tokens (iOS and Android) from the same token file; a Persian-interface (RTL layout) review; dyslexia and text-size options; visual regression tests |

## 5. Code reference

`src/app/globals.css` · `src/components/ui.tsx` · `.claude/skills/farsi-pen-design-system/SKILL.md` · `.claude/agents/ui-engineer.md` · `.claude/agents/design-system-reviewer.md` · `docs/design-system.md` · `.github/workflows/deploy.yml`

## 6. Changelog

| Version | Date | Change |
|---|---|---|
| ds-v0 | before Nov 2026 | Playful gamified look (3D buttons, Nunito, uppercase labels, overshooting motion) |
| ds-v1 | Nov 2026 | Redesign on Apple's interface principles; floating glass tab bar; five-tab structure; axe accessibility fixes |
| ds-v1 docs | 11 Nov 2026 | This documentation set (00–13) written from the prototype; backlog in §3 |
