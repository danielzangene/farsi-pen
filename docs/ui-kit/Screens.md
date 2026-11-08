# Screen specs

Each spec lists the layout from top to bottom, the components it uses and the states it must handle. Phone first (375px), then desktop. Screens marked *proposed* follow the system-design plan and aren't built yet.

## Session (lesson rounds, Daily Practice, flashcards, grammar exercises)

Full screen, no app navigation (focus mode). Width `session-max`.

1. `SessionHeader`: close, `ProgressBar`, counter (`3/8`).
2. Instruction in `prompt` style: "Select the correct meaning", "Type it in English", "Say it".
3. Prompt: the word (`FaWord` xl, or `fa-hero`) or the big sky speaker (`AudioButtons big`).
4. Answer area: option `Tile`s in a one- or two-column grid, numbered 1 to 4; or an `Input` with the Persian keyboard below; or the mic button for speaking.
5. `FeedbackSheet`: Check (disabled until there is an answer), then the correct / almost / wrong state with Continue.

Keys: 1 to 4 or A to D pick an option, Enter checks and continues, Escape asks to quit.
States: loading content, no audio available, answer typed with a typo ("almost"), last item → result screen.

## Result

Centred, pops in. Heading in `prompt` style ("Lesson complete!"), a row of two or three `StatCard`s (Total XP saffron, Accuracy pista, Words sky), then `btn btn-lg` Continue and `btn-secondary` Review mistakes. XP is only awarded the first time a skill is mastered.

## Today (home)

1. Greeting in Persian and transliteration (`سلام · salâm!`) and the `page-title`.
2. First visit: two onboarding questions as option `Tile`s (Why are you learning Persian? Can you read the script?), with Skip.
3. The plan: a `Card` with up to three steps (due reviews, one new thing, one mission), each a row with a status, and one `btn` Continue that starts the next step.
4. Done: "That's enough for today." with the streak and XP.
5. Below: shortcuts to every feature as `Tile` rows, and the Getting started checklist until it's finished or hidden.

## Lessons (path)

1. `PageHeader` "Lessons", subtitle "0 of 36 lessons complete".
2. Per unit: a firuze banner (`eyebrow` "UNIT 1 · A1", title with Persian, description, `btn-secondary btn-sm` Word list).
3. `PathNode`s in a zig-zag, 40px apart, title and status under each; the current node has the ring and the bobbing `Bubble`.
4. Footer note: lessons unlock in order but any can be opened.

Proposed: collapse finished units and jump to the current node, because the full path is about 7,900px tall on a phone.

## Lesson preview and study

`SessionHeader`-less page with a back link. Script `Segmented` (Latin first / Farsi first / Script only), level `Chip` and lesson count, title with Persian, description, then a `WordCard` per word. Sticky bottom bar: `btn-secondary` Skip to quiz and `btn` Start.

## Missions list and mission

List: `PageHeader`, a mastery `ProgressBar` ("0/21 real-world skills mastered"), then a `Tile` row per mission (emoji badge, category eyebrow, title with Persian, skill count, `New` / `Mastered` chip, chevron).

Mission intro: back link, emoji, title with Persian, the situation in one paragraph, a `Card` "After this mission you can" listing the skills with status chips, time estimate, then `btn` Start mission and `btn-secondary` Already know this? Prove it.

Mission session: listen to the dialogue → key phrases (spoken and formal) → grammar on demand → build sentences → role-play → unguided check. Answers by typing (Finglish or Persian) or voice. Ends as mastered, needs practice (a short repair round) or retry.

## Scenes

List: "Today's scene" `Card` with episode number, title with Persian, setting line, cast avatars and `btn` Play; then all episodes as numbered `Tile` rows.
Scene: choose your part (one `Tile` per character with line count), or `btn-secondary` Just listen first. Playback reads the other lines; your lines are scored sound by sound with `PronunciationFeedback`.

## Words (flashcards and browse)

`PageHeader` with a `Segmented` Flashcards / Browse. Flashcards: direction and script controls, then deck `Card`s (Today: due + 5 new, My cards, By lesson), each with a `btn` start. Card flow: see the word → guess → flip to hear it, see the example, watch real clips, say it → rate Didn't know / Almost / Knew it.
Browse: search `Input` (English or Persian, with "Did you mean …?"), filters, `WordCard` list, dictionary results under the course words.

## Speak, Sounds, Hands-free

Speak: a `Card` with the mic, word-set select and `btn` Start; results colour each letter by how clearly it was heard, with a score per sound, play-model / play-mine buttons and a mouth diagram for the weakest sound.
Sounds: a daily three-sound workout `Card`, then a row per hard sound (letter, name, a tip, "Not tried" / score chip).
Hands-free: what to play, pause length (`Segmented`), options as checkboxes, `btn` Start. Keeps the screen awake; responds to earphone play and pause.

## Settings

`PageHeader`, then `Card` sections: Profile (name `Input`, guest-mode note in a sky callout) · Appearance (theme `Segmented`: Dark / Light / Auto) · Learning (why you're learning, reading level, daily goal, card defaults, keyboard) · Voice and speech · Backup and restore · Reminder · Reset progress (`btn-danger` behind a confirm). Credits for open data sources at the bottom in `muted`. The build's commit and time show in the footer.

## Empty, loading and error states

- Empty: a round tinted icon, a `title`, one sentence saying how to fill it, one button (My cards: "No cards saved yet … Go to flashcards").
- Loading: keep the layout; show the header and a muted line, not a spinner over everything.
- Error: say what failed and what to do ("Couldn't play audio. Check your connection, or download the natural voice in Settings").
