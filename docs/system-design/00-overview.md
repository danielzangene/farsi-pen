# 00 · Farsi Pen design system: overview

The design system behind the Farsi Pen prototype: what it is, the principles it rests on, and how to use the docs in this folder.

## 1. What the design system is

Farsi Pen's interface follows **Apple's human interface principles, translated for the web**, with Farsi Pen's own brand:

- content first;
- calm grouped surfaces;
- hierarchy from type weight;
- translucent floating chrome;
- motion that responds instantly and settles without overshoot.

It replaced an earlier playful, gamified look in November 2026 (3D buttons with lips, 2px borders, uppercase heavy labels, overshooting motion).

It is used by every screen in the prototype: 5 tabs, about 25 feature areas, and more than 40 components.

| Layer | Source of truth |
|---|---|
| Tokens and utility classes | `src/app/globals.css` |
| React primitives | `src/components/ui.tsx` |
| Working rules for builders and agents | `.claude/skills/farsi-pen-design-system/SKILL.md` |
| Origin and decisions | `docs/design-system.md` |
| This documentation | `docs/system-design/` (also in Google Drive: Projects/FarsiPen/System Design) |

## 2. Design principles

| Principle | What it means in Farsi Pen | Example |
|---|---|---|
| **Purpose and simplicity** | One clear primary action per screen; show the common path first, the rest one level deeper | Home leads with the Today plan and a single **Continue** |
| **Honest progress** | Reward proven ability, never busywork; say when the learner is done | "That's enough for today"; XP only for first-time mastery |
| **Response** | Feedback on pointer-down, never only on release | Buttons scale to 0.97, tiles to 0.98, in 60 ms |
| **Restraint** | No mascots, confetti, decorative gradients or looping animations | Delight comes from getting the basics right |
| **Familiarity** | Patterns people already know behave the way they expect | Tab bar, grouped lists, segmented controls, sheets with a grabber |
| **Wayfinding** | Every screen answers: where am I, where can I go, how do I get out | Tab highlight on every page; SessionHeader with ✕ in every session |
| **Persian with respect** | Persian is shown properly, never as an afterthought | Yekan Bakh, `<Fa>`, correct joining, Persian digits, loose leading |
| **Inclusive by default** | WCAG 2.1 AA; speaking never blocks progress where typing works (today: missions), and every mic failure explains what to do | Focus rings, 44 px targets, reduced motion and transparency |

## 3. The docs in this folder

| # | Doc | Covers | Owner |
|---|---|---|---|
| 00 | Overview | This page | Head of design |
| 01 | Brand identity | Name, logo, brand colours, personality, guardrails | Head of design |
| 02 | Colour | Every colour token, light and dark, roles, contrast | Visual foundations |
| 03 | Typography | Fonts, weights, scale, tracking, Persian type | Visual foundations |
| 04 | Layout, spacing and elevation | Breakpoints, widths, spacing, radii, layers, safe areas | Layout and interaction |
| 05 | Materials and motion | Material, glass, dialogs, sheets, easing, durations | Layout and interaction |
| 06 | Iconography and imagery | Icons, logo mark, emoji, letter badges, diagrams | Layout and interaction |
| 07 | Components | Catalogue of every component, with states and props | Component library |
| 08 | Patterns | Page types, sessions, answering, feedback, system states | UX patterns |
| 09 | Persian script and RTL | Showing Persian inside an English interface | Inclusive design |
| 10 | Accessibility | WCAG 2.1 AA standard, audits, checklists | Inclusive design |
| 11 | Content design and voice | Voice, tone, copy rules, word list | Content design |
| 12 | Design token reference | Every token, with proposed Figma variable names | Visual foundations |
| 13 | Governance and roadmap | How the system changes, reviews, gaps, next steps | Head of design |

## 4. How to use it

- **Designing a screen:** start with *08 Patterns* to pick the page type, build it from *07 Components*, check against *10 Accessibility* and *11 Content design*.
- **Building:** use only tokens and classes from *12 Token reference* and primitives from `ui.tsx`. If something is missing, add a variant to the system (see *13 Governance*), never a one-off style.
- **Reviewing:** run the review checklist in *13 Governance*, or ask the `design-system-reviewer` agent.
- **Building a Figma library:** use *12 Token reference* (proposed variable names) and the component anatomy in *07 Components*.

## 5. Status

| Area | Status |
|---|---|
| Tokens, light and dark themes | Stable, in code |
| Core primitives (`ui.tsx`) | Stable |
| Feature components | Stable, a few one-offs to promote (see 07) |
| Accessibility | Audited (Hallmark and axe passes in the prototype) |
| Figma library | Not started *(proposed, see 13)* |
| Brand assets (icons, share image) | Partly out of date with the new system (see 01 and 13) |
