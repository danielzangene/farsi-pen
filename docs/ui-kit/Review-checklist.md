# Review checklist

Use this for every pull request that touches UI.

1. Built from the components and utility classes here; no one-off colours, shadows or radii.
2. One primary button per screen, disabled until the action is valid.
3. Sessions use `SessionHeader` and `FeedbackSheet`; no navigation is visible.
4. All Persian goes through `<Fa>`; the script setting (Latin first, Farsi first, script only) is respected.
5. States covered: empty, loading, success, error, disabled.
6. Works at 320px and 375px wide with no sideways scrolling; the tab bar doesn't cover content.
7. Copy follows the voice rules; buttons are verbs.
8. Checked in Dark (default) and Light.
9. Every icon-only button has an `aria-label`; hit targets are at least 44px.
10. No other product's brand assets.

## Open issues found on dev (8 Nov 2026)

| Issue | Where | Fix |
|---|---|---|
| Buttons autofocused on load show the focus ring, which reads as "selected" | Speak, Mission intro, Words, Poetry (37 `autoFocus` / `.focus()` calls) | Autofocus only in the feedback sheet and dialogs |
| White labels on fills below 4.5:1 in Light | Buttons 3.1 to 4.1:1; StatCard strip and done node on saffron 2.0:1 | Use the dark `on-accent` in Light too, or darken the fills; recheck |
| `faint` below 3:1 | Placeholders and zero streak | Keep to placeholders; use `muted` for any real text |
| Lessons page about 7,900px tall on a phone | Lessons | Collapse finished units, jump to current |
| Ten items under More; four review paths | Navigation | Proposed five-tab layout (Navigation section) |
| Landing still says "MVP demo" | `/` | Replace with the launch tagline |
