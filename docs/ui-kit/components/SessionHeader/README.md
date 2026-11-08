# SessionHeader

The sticky top of every session: a close button, the progress bar and an optional counter.

## When to use
Lesson rounds, Daily Practice, flashcards, grammar exercises, missions and scenes. Mounting it turns on focus mode, which hides the app navigation.

## The screen provides
`exitHref` or `onExit` (ask before quitting if answers would be lost), `progress` 0 to 1, and an optional right-hand slot such as `3/8`.

## Do / don't
- Do keep the close button 40px with `aria-label="Quit session"`.
- Don't add other navigation to a session.

Source: `SessionHeader` and `FocusMode` in `src/components/ui.tsx`.
