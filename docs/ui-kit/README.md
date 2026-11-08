# Farsi Pen UI kit

The UI system design and spec kit, built from the code on `dev` (8 Nov 2026). It is the written companion to the live style guide at `/design/` (rendered with the app's real components) and the system-design page at `/present/system-design.html`.

| File | What it covers |
| --- | --- |
| [Brand-guide.md](Brand-guide.md) | Principles, voice, colour, type, shape, motion, icons, accessibility: the rules, naming tokens |
| [tokens.json](tokens.json) | Every token with its Dark (default) and Light value and a usage note: 33 colours, 14 text styles, spacing, radius, edges, sizes |
| [components/](components/) | One guideline per component (20): when to use it, what the screen supplies, states, do's and don'ts, source file |
| [Screens.md](Screens.md) | Screen specs: layout, components and states for every screen |
| [Navigation.md](Navigation.md) | Navigation today and the proposed five-tab layout |
| [Review-checklist.md](Review-checklist.md) | The UI review checklist and open issues found on dev |

Source of truth stays in code: tokens and utility classes in `src/app/globals.css`, primitives in `src/components/ui.tsx`. When they change, update `tokens.json` and the matching guideline here.
