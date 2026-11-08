# AudioButtons

Play and play-slowly controls for any Persian text.

## When to use
`big`: the prominent sky speaker on a listening prompt (56px) with a 44px slow button. Default: two ghost icon buttons in `sky-ink` inside cards and rows. `compact`: play only.

## The screen provides
The Persian `text`. Recorded clips play first, then the in-browser voice, then the device voice.

## States
Playing (pulses), unavailable (disabled; `title` explains why), failed (`anar-ink` icon and "Audio unavailable").

Source: `AudioButtons` in `src/components/ui.tsx`, `src/lib/speech.ts`.
