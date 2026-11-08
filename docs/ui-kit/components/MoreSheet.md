# MoreSheet

A bottom sheet listing the pages that don't have their own tab, each with a one-line hint.

## Today on dev
Speak, Hands-free, Scenes, Sounds, Daily Practice, Grammar, Alphabet, Poetry, My cards, Settings: ten items, too many to scan. The proposed navigation folds them into the Learn, Speak, Review and Me tabs.

## Rules
Modal dialog (Escape and backdrop close it; focus moves to Close), 24px top radius, slides up. Rows are 56px with a tinted round icon, bold label and `muted` hint; the current page row has the `sky` border. Closes on navigation.

Source: `MoreSheet` in `src/components/AppNav.tsx`.
