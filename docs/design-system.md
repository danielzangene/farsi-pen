# Farsi Pen design system — research and decisions

The working rules live in the project skill `.claude/skills/farsi-pen-design-system/SKILL.md`. This file records **where the system came from and why** each choice was made.

## Brief

Restyle Farsi Pen after the playful, gamified style of the Duolingo app (reference: the Figma community kit "Duolingo App UI – Free UI Kit (Recreated)"), while keeping spec §3: no copying of another product's branding.

## Sources (researched 30 Oct 2026)

| Source | What it gave us | Reliability |
|---|---|---|
| duolingo.com production CSS/JS (home + learning-path bundles) | Colour tokens with light/dark values, button and path-node CSS, type scale, motion timings | Primary — read directly |
| design.duolingo.com (now redirects to the design blog hub) | Colour roles, voice & tone principles (search snippets only) | Secondary |
| Figma kit `figma.com/community/file/1279168389289425844` | Cover image only: unit banner, round path nodes with START bubble, option rows, speaker button, 2×2 word tiles, yellow progress bar. The file is a teaser (community comments note it isn't editable) and needs sign-in | Visual reference only |
| github.com/bryanjenningz/react-duolingo (open-source clone) | Lesson-screen structure: tiles, Check button, feedback sheet, result stat cards | Cross-check |
| blog.duolingo.com (home screen redesign, shape language), creativebloq (Feather Bold), LottieFiles case study | Principles, font licensing, celebration animation approach | Context |

## What the reference does (facts we used)

- **Colour:** one saturated colour per role, each paired with a darker "lip" shade (e.g. green `#58CC02` / `#58A700`, blue `#1CB0F6` / `#1899D6`, red `#FF4B4B` / `#EA2B2B`), plus a grey ramp `#F7F7F7 / #E5E5E5 / #AFAFAF / #777777 / #4B4B4B` on white.
- **Buttons:** 50px tall, 16px radius, bold 15px UPPERCASE with ~0.04em tracking, flat `0 4px 0` lip in the darker shade, `translateY(4px)` on press, brightness hover, disabled = grey fill + grey text with no lip.
- **Tiles/cards:** 2px borders, `border-width: 2px 2px 4px`, 12–16px radius; selected = light-blue fill, blue border, blue text.
- **Path:** oval nodes ~70×57px with an 8px lip, unit banner in the unit colour with a 70%-opacity uppercase eyebrow, START bubble on the current node.
- **Sessions:** close X + pill progress bar (with a white sheen) + hearts; answer area; Check (disabled until answered); bottom sheet that slides up green/red with an icon, title, correct solution and a Continue in the sheet colour.
- **Motion:** 0.1–0.2s presses, ~0.2s overshooting sheet, 0.4s progress fill, reduced-motion respected.
- **Type:** proprietary rounded fonts (Feather Bold, DIN Next Rounded builds). Free stand-in: Nunito. Letter-spacing is reset for Arabic-script text.
- **Accessibility gap:** white on their green is 2.1:1, on blue 2.4:1, and their `#777` grey is 4.48:1 (just under AA).

## Our decisions

| Topic | Reference | Farsi Pen | Why |
|---|---|---|---|
| Primary | Green `#58CC02` | Firuze `#12a594` / lip `#0c7f72` | Own brand (spec §3); Persian turquoise; 3.1:1 with white |
| Correct | Green | Pista `#46a21c` / `#36800f` | Universal "correct" semantics, own hue, 3.3:1 |
| Wrong | Red `#FF4B4B` | Anar `#e5484d` / `#c0353a` | 3.9:1 |
| Rewards | Gold `#FFC800` | Saffron `#f5a623` | Persian reference; decorative only (never white text on it) |
| Selection/audio | Blue `#1CB0F6` | Sky `#1e9be0`, ink `#12669a` | 3.1:1 fill, 5.3:1 ink on soft |
| Grammar accent | — | Plum `#9b5de5` | Separates grammar from vocabulary |
| Secondary text | `#777777` (4.48:1) | `#737373` (4.74:1) | Passes AA |
| Latin font | Feather / DIN Rounded (proprietary) | Nunito Variable | Free rounded substitute |
| Farsi font | — | Yekan Bakh (DOTS axis) | Chosen by the team; never letter-spaced |
| Mascot | Owl | None | Spec §3; a Farsi Pen character can be designed later |
| Hearts | Lives system | Not used | Our product doesn't punish mistakes; streak + XP only |

### Contrast check

Run this when changing any colour (needs only Python):

```bash
python3 -c "
def l(h):
    c=[int(h[i:i+2],16)/255 for i in (1,3,5)];c=[x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
    return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
r=lambda a,b:(max(l(a),l(b))+.05)/(min(l(a),l(b))+.05)
print(round(r('#ffffff','#12a594'),2))"
```

Targets: button fill vs white ≥ 3:1; `-ink` on `-soft` ≥ 4.5:1; body text ≥ 4.5:1.

## Not adopted (on purpose)

Owl/mascot, logo/wordmark, Feather and DIN fonts, animal colour names, the exact brand green, hearts/gems/leagues artwork and names, their UI strings and sounds.

## Team setup

- Skill: `.claude/skills/farsi-pen-design-system` — rules for anyone building UI.
- Agent roles: `.claude/agents/ui-engineer.md` (implements screens on the system), `.claude/agents/design-system-reviewer.md` (read-only review against the skill).
