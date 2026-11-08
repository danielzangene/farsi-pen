# Benchmarks

We studied the strongest design-system sites on the web (8 Nov 2026) and picked the five that best match a playful, Persian-first learning app. The `/design/` style guide takes one idea from each.

| # | System | Why it matches Farsi Pen | What we took |
|---|---|---|---|
| 1 | [Duolingo brand guidelines](https://blog.duolingo.com/hub/design/) | The closest product: playful, gamified language learning | Personality first: big colour blocks up top; voice shown through real copy, not adjectives. Pattern only: never its owl, green or fonts |
| 2 | [Khan Academy Wonder Blocks](https://github.com/Khan/wonder-blocks) | An education product that cut 50+ button styles and 50+ type styles down to one small, accessible set | Few tokens, each with one job; accessibility written into every component's contract |
| 3 | [Shopify Polaris](https://polaris.shopify.com/) | The reference for usable component docs and content guidelines | Do / Don't pairs with a reason; "Use it for / Not for"; tokens you can copy |
| 4 | [Atlassian Design System](https://atlassian.design/) | Clear information architecture and practical examples | Overview → Foundations → Components → Patterns; a persistent sidebar; patterns annotated part by part |
| 5 | [Wikimedia Codex](https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html) | Open source and treats Persian and other RTL scripts as first-class | A bidirectionality foundation: what mirrors (arrows), what doesn't (play, media, time), mixed-script text |

Also considered: Material Design 3 (bidirectionality and theming), IBM Carbon and GitHub Primer (enterprise depth, more than a small team needs), eBay Playbook (visual-first, minimal text).

## How each component entry is laid out

Live example → Use it for / Not for → Do / Don't with a reason → Accessibility contract → Tokens used → Source file. Token values and contrast ratios on the page are read from `tokens.json`, so they update when a colour changes.

Sources: [designsystems.surf, 11 best design system examples in 2026](https://designsystems.surf/articles/11-best-design-system-examples-in-2026) · [UXPin, best design system examples](https://uxpin.com/studio/blog/best-design-system-examples) · [designsystems.com on Wonder Blocks](https://designsystems.com/about-wonder-blocks-khan-academys-design-system-and-the-story-behind-it) · [Material bidirectionality (mirror)](https://www.mdui.org/en/design/1/usability/bidirectionality.html) · [Wikimedia Codex bidirectionality](https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html)
