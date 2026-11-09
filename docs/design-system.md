# Farsi Pen design system — sources and decisions

The working rules live in the project skill `.claude/skills/farsi-pen-design-system/SKILL.md`. This file records **where the system came from and why**.

## Brief (Nov 2026)

Redesign Farsi Pen on Apple's interface principles, using the `apple-design` skill (github.com/emilkowalski/skills, `skills/apple-design`), which distils Apple's WWDC design talks (*Designing Fluid Interfaces* 2018, *The Details of UI Typography* 2020, *Principles of Great Design*) for the web. Keep the Persian font (Yekan Bakh); weights may change. Keep Farsi Pen's own brand colours.

This replaces the earlier playful, gamified look (3D buttons with a darker bottom lip, 2px borders, uppercase heavy labels, Nunito, overshooting motion).

## What we took from the principles

| Principle | Decision in Farsi Pen |
|---|---|
| Response: feedback on pointer-down | Buttons scale to 0.97 and tiles to 0.98 on `:active`, 60ms |
| Behaviour over animation; no overshoot for things that just appear | `--ease-spring` is critically damped; pop-in is 0.96 → 1; the looping bob is gone |
| Spatial consistency | Sheets slide up from the bottom and show a grabber; dialogs scale in place |
| Materials convey hierarchy | Tab bar, top bar, session header and action bars are translucent blurred `material` layers; the sidebar is solid |
| Dim to focus | Dialogs dim and blur what's behind them |
| Typography: system font, size-specific tracking, hierarchy from weight | Latin uses the system font stack; h1/h2 tracked tighter; weights remapped (700/600/500/400); sentence-case buttons |
| Reduced motion / transparency / more contrast | All three media queries handled in globals.css |
| Simplicity, restraint, craft | Grouped surfaces on a soft canvas, hairline separators, no decorative gradients or mascot |

## Colour

Neutrals follow iOS's grouped palette (canvas #f2f2f7, cards white; dark: black and #1c1c1e), with translucent fills and separators so they work on any surface. Accent hues keep their Farsi Pen names and roles, retuned to iOS-like values with AA-checked `-ink` text colours; `-soft` tints are mixed from each accent, so dark mode only redefines the base colours. In dark mode, labels on accent fills are black for contrast.

## Persian

Yekan Bakh stays, DOTS axis 1 for text and 0 for headings. With the remapped weights Persian headings render at 600–700 instead of 800, closer to the lighter system Latin. Persian never gets letter-spacing or uppercase.

## What we deliberately don't do

Copy any product's branding, use gradient hero cards, mascots or confetti, loop animations, or rely on colour alone for state.
