# ProgressBar

A thick rounded bar with a light sheen on the fill.

## When to use
Session progress (16px, firuze), the daily goal and XP to next level (saffron), small inline meters in rows and settings (`size="sm"`, 10px, no sheen).

## The screen provides
`value` from 0 to 1 and an optional `tone`. It renders `role="progressbar"` with `aria-valuenow`.

## Motion
Width eases over 500ms. A non-zero value always shows at least a 16px nub so early progress is visible.

Source: `ProgressBar` in `src/components/ui.tsx`.
