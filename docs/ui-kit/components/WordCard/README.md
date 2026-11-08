# WordCard

The card that presents one word: transliteration, script, sound hint, meaning, an example sentence and the word's actions.

## When to use
Lesson preview and study mode, the Word Library, dictionary results.

## The screen provides
The word (`fa`, `tr`, `en`, `soundsLike`, `register`, example), and the learner's script settings: Latin first, Farsi first or script only (`FaWord`).

## Anatomy
Header (word in the chosen script order + `New` or register chip) · sound hint in `muted` · meaning · example box (`paper`, Persian in `fa-body`, transliteration, English) · action row of ghost icon buttons: play, play slowly, say it, add to my cards, report.

## Do / don't
- Do keep every icon button labelled; audio buttons use `sky-ink`.
- Don't show transliteration when the learner picked script only.

Source: `src/components/WordCard.tsx`, `FaWord`, `AudioButtons`, `BookmarkButton` in `src/components/ui.tsx`.
