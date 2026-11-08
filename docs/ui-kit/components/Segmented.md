# Segmented

A pill-shaped radio group for switching between two to four options in place.

## When to use
Settings toggles (theme, daily goal), card display (Latin first / Farsi first / Script only), direction (FA → EN / EN → FA), small tab sets (Saved / Hidden, A1 / A2 / B1 / B2).

## The screen provides
`label` for the group (`aria-label`), the options with short labels, the current value and a change handler.

## States
Selected option: `card` fill, `sky-ink` text, 2px `line` edge under it. Others: `muted`, `ink` on hover. Each option is at least 40px tall.

## Do / don't
- Do keep labels to one or two words.
- Don't use it for navigation between pages; use tabs or links.

Source: `Segmented` in `src/components/ui.tsx`.
