# TopBar

The phone header: logo on the left, streak and XP on the right.

## Anatomy
`Logo` (mark + name; mark only when space is tight) · flexible gap · streak chip (flame, `anar-ink`; `faint` at zero) · XP chip (star, `saffron-ink`). Each chip has an `aria-label` ("3 day streak").

## Rules
Sticky at the top, `card` at 95% with blur, 2px `line` bottom border. Hidden in sessions. On desktop the stats move to the top right and the logo into the sidebar.

Source: `AppNav` and `StatChips` in `src/components/AppNav.tsx`.
