# Input

Text field with a `paper` fill and a `field-edge` border that turns `sky` on focus.

## When to use
Typed recall answers, mission answers (Finglish or Persian), search, the name field in Settings.

## The screen provides
A visible label or `aria-label`, a placeholder that says what to type ("Type in English", "Type in Farsi"), `lang="fa" dir="rtl"` when the answer is Persian, and the on-screen Persian keyboard below it when the learner turned that on.

## States
Rest (`field-edge`, 3.5:1), focus (`sky` border, `card` fill), correct/wrong after Check (the feedback sheet carries the message; the field itself shakes once on wrong).

## Do / don't
- Do accept typos within the checker's tolerance and say "Almost! Watch the spelling."
- Don't use `faint` for anything but the placeholder.

Source: `src/app/globals.css` (`@utility input`), `src/components/RecallRound.tsx`, `src/components/PersianKeyboard.tsx`.
