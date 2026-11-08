# Chip

A small pill label: register tags, levels, counts and statuses.

## When to use
- `Spoken` (saffron) and `Formal` (plum) register tags on words and phrases: `RegisterTag` renders nothing when a word is both.
- `New` on unseen words, the CEFR level (`A1`) on lessons, `Not tried` / `Best 80` on practice rows.

## The screen provides
One or two words in sentence case; an optional 12px icon.

## Do / don't
- Do pair the tone's `-soft` background with its `-ink` text.
- Don't make chips tappable; use `Segmented` or a button for choices.

Source: `src/app/globals.css` (`@utility chip`), `RegisterTag` in `src/components/ui.tsx`.
