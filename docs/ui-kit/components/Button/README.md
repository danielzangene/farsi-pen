# Button

The chunky 3D button: a solid fill sitting on a darker bottom edge that it sinks into when pressed.

## When to use
- `btn` (primary, firuze): the ONE main action on a screen: Start, Check, Continue.
- `btn-success` / `btn-danger`: only for Continue inside the feedback sheet after a correct / wrong answer.
- `btn-secondary`: the second action beside a primary (Skip to quiz, Review, I already have progress).
- `btn-ghost`: low-emphasis and icon actions (back, close, bookmark, audio in a card). No depth.
- `btn-sky`: audio and listening actions. `btn-plum`: grammar calls to action.
- Size modifiers combine with any variant: `btn-sm` (36px, 3px edge), `btn-lg` (56px, session actions), `btn-icon` (40px square, needs `aria-label`).

## The screen provides
A verb label in plain text (rendered UPPERCASE by the class), an optional leading icon at 16 to 20px, and `disabled` until the action is valid (Check stays disabled until there is an answer).

## States
Rest, hover (`brightness(1.06)`), pressed (moves down by its edge depth, edge disappears, 100ms), disabled (`line` fill, `muted` label, no edge), focus (3px `sky` ring, offset 2px).

## Do / don't
- Do keep one primary per screen; full-width (`w-full`) on phones for session actions.
- Don't restyle a button with one-off colours or shadows; add a variant in `globals.css` instead.
- Don't autofocus a button on page load: the focus ring then looks like a selected state (seen on Speak, Missions, Words and Poetry on dev). Autofocus only inside the feedback sheet, where Enter should continue.
- Persian inside a button goes in `<Fa>` so it is not uppercased or letter-spaced.

Source: `src/app/globals.css` (`@utility btn*`).
