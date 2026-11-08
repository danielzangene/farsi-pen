# Card

A static container with a 2px `line` border, 16px radius and no depth.

## When to use
Grouping that people do not tap as a whole: settings sections, the Today plan, the word card body, the speaking-practice panel. If the whole surface navigates, use `tile`.

## The screen provides
Children with 16 to 20px padding; an optional `eyebrow` heading in `muted`.

## Do / don't
- Do use one level of cards; inset areas inside a card use a `paper` fill without a border.
- Don't add shadows: Farsi Pen has no soft shadows.

Source: `src/app/globals.css` (`@utility card`).
