# LogoMark

The FA monogram on a firuze tile: Farsi Pen's brand mark.

## When to use
`LogoMark` alone: tight spaces (phone header when compact, footer at 28px). `Logo`: mark + "Farsi Pen" in `firuze-ink`, links home. The dev site adds a `DEV` chip.

## Rules
- Never redraw the mark: use the component, or the files in Assets › Logos.
- Letters are `on-accent`: white on firuze in light, dark in dark mode.
- The same paths drive the favicon, app icons and share image (`scripts/make-icons.mjs`). Change both together, then bump `ICON_VERSION`.

Source: `LogoMark` and `Logo` in `src/components/AppNav.tsx`.
