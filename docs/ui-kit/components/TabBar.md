# TabBar

The phone's bottom navigation: five labelled tabs.

## Today on dev
Home, Lessons, Missions, Words, More. More opens `MoreSheet` and is highlighted on any page listed there.

## Proposed (see the Navigation section)
Today, Learn, Speak, Review, Me.

## Rules
- Icon 26px in a 48 × 36px pill; active pill has a `sky` border and `sky-soft` fill, label `sky-ink`; inactive `muted`.
- Labels 11px, sentence case, always visible; never icon-only.
- Fixed to the bottom with the safe-area inset; hidden in sessions. Desktop uses the sidebar instead.

Source: `AppNav` in `src/components/AppNav.tsx`.
