# Tile

A tappable bordered surface with a 4px bottom edge: answer options, list rows, navigation cards.

## When to use
Anything people tap that is not a button: multiple-choice options, lesson and mission rows, deck cards, settings rows that open something. Static containers use `card` instead.

## The screen provides
Content (number badge + label for options; icon, title, one-line hint and a chevron for rows) and a `data-state` when it changes: `selected` (sky), `correct` (pista), `wrong` (anar, plus one `animate-shake`), `current` (firuze border).

## States
Hover fills `paper`; press moves 2px down and the bottom edge shrinks to 2px; state colours come from the matching `-soft` background and `-ink` text.

## Do / don't
- Do show an icon or word with correct/wrong, never colour alone.
- Do support keys 1 to 4 (and A to D) for options, with the number shown on the tile.
- Don't nest a tile inside another tile or card with its own border.

Source: `src/app/globals.css` (`@utility tile`), options in `src/components/ChoiceRound.tsx`.
