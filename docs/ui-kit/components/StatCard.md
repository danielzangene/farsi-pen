# StatCard

A result tile: a coloured label strip over a value box.

## When to use
Session results and mission results: TOTAL XP (saffron), ACCURACY (pista), WORDS or TIME (sky). Two to three in a row.

## The screen provides
`label` (rendered uppercase), `value`, optional `icon` and `tone`.

## Accessibility
In light mode the strip label is white on the fill: 2.0:1 on saffron, 3.3:1 on pista, 3.1:1 on sky. That fails WCAG AA for 12px text. Fix before launch by using `on-accent` dark labels in light mode too, or a darker strip. Dark mode passes (5.7:1 and up).

Source: `StatCard` in `src/components/ui.tsx`.
