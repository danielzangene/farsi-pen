# FeedbackSheet

The fixed bottom bar of a session: it holds Check while the learner answers, then slides up green or red with the result and Continue.

## When to use
Every answered exercise in lessons, practice, grammar and missions.

## The screen provides
`state` (`idle`, `correct`, `almost`, `wrong`), a `title` ("Nicely done!", "Almost! Watch the spelling.", "Not quite"), optional `detail` (the right answer), `onContinue`, and in `idle` the Check button as children.

## States
- idle: `card` with a `line` top border; the primary Check button, disabled until there is an answer.
- correct / almost: `pista-soft`, check icon pops in, `btn-success` Continue.
- wrong: `anar-soft`, cross icon, `btn-danger` Continue; the answer area shakes once.
The sheet has `role="status"` so screen readers hear the result. Continue takes focus so Enter moves on.

## Do / don't
- Do keep titles short and kind; never scold.
- Don't put more than one action in the sheet.

Source: `FeedbackSheet` in `src/components/ui.tsx`.
