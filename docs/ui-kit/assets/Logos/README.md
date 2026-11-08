# Logos

- `fa-mark.svg`: the FA monogram, white letters on a firuze (#12a594) tile with 14/64 rounded corners. Browser-tab icon. Single ink: white.
- `app-icon-512.png`: home-screen and install icon, rounded tile.
- `app-icon-maskable-512.png`: Android adaptive icon; square, letters kept inside the safe zone.
- `share-card.png`: 1200 × 630 link preview (Open Graph) on the dark background.

All four are generated from the same paths as the `LogoMark` component by `scripts/make-icons.mjs`. Change the mark there and in `LogoMark` together, re-run the script, then bump `ICON_VERSION`.
