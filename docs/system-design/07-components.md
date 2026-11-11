# 07 · Components

A catalogue of every reusable UI building block in the prototype: what it is for, how it is built, its states and props, and where it lives in code.

## 1. Principles

- **Compose, don't restyle.** Screens are built from the utility classes in `src/app/globals.css` (`btn-*`, `card`, `tile`, `chip`, `input`, `select`, `eyebrow`, `material*`, `glass`) and the primitives in `src/components/ui.tsx`. A new look is a new variant in `globals.css`, never an ad hoc class string (`ui.tsx:2-4`).
- **Variants only change colour variables.** Every button is the same `btn` shape; variants set `--btn-bg` and `--btn-fg` (`globals.css:258-260`). That keeps size, radius, press and disabled behaviour identical everywhere.
- **Feedback on pointer-down.** Buttons scale to 0.97 and tiles to 0.98 on `:active`, with a 60ms transition (`globals.css:293-297`, `404-407`). Hover only exists where there is a real pointer.
- **State is never colour-only.** Correct, wrong, selected and current pair colour with an icon, a text label or `aria-*` state (for example the check and cross badges in `ChoiceRound.tsx:150-158`).
- **Persian goes through `<Fa>`.** Any component that shows Persian wraps it in `Fa` (`lang="fa" dir="rtl"`), so font, joining and RTL are right without per-component work.
- **One primary action.** Components that hold a main action (FeedbackSheet, TodayPlan, Path "Next up") expose exactly one `btn-primary` or one tone button.

## 2. Specification

How to read each entry: a heading, then one table. "Hover" always means hover-capable devices only. In `globals.css` it is wrapped in `@media (hover: hover)` (`globals.css:288`, `331`, `343`, `399`). In components, Tailwind 4's `hover:` variant (`package.json:28`, `tailwindcss ^4.3.3`) applies only on devices that can hover. "Focus" is the global keyboard ring unless stated: 3px outline in `sky` at 70%, offset 2px (`globals.css:145-148`). It is hidden while the learner uses a pointer (`html[data-input="pointer"]`, `globals.css:152-154`; set by the script in `src/app/layout.tsx:10`). "Used in" counts `.tsx` files under `src/` found with grep.

### 2.1 Buttons

#### Button base (`btn`) and colour variants

`src/app/globals.css:261-325` · `btn-primary` used in 37 files, `btn-secondary` 33, `btn-ghost` 35, `btn-danger` 11, `btn-sky` 12, `btn-success` 5, `btn-plum` 3

| Aspect | Spec |
|---|---|
| Purpose | Every tappable action that is not a list row or an option. |
| Anatomy | Optional leading icon (lucide, `size-4` or `size-5`), then a label. Inline-flex, centred, `gap: 0.5rem` (8px). |
| Base geometry | `min-height: 2.875rem` (46px), `padding: 0 1.25rem` (20px), `border-radius: 0.875rem` (14px), no border, 16px, weight 600, `letter-spacing: -0.01em`, `line-height: 1.2`, `white-space: nowrap` (`globals.css:261-282`). |
| Colour variants | `btn-primary`: `--btn-bg` firuze, `--btn-fg` on-accent (`307-309`). `btn-success`: pista (`310-313`). `btn-danger`: anar (`314-317`). `btn-sky`: sky (`318-321`). `btn-plum`: plum (`322-325`). `btn-secondary`: firuze-soft fill, firuze-ink label (`327-337`). `btn-ghost`: transparent fill, muted label (`339-354`). |
| Default | Flat fill from `--btn-bg`, label from `--btn-fg`. No shadow, no lip. |
| Hover | Solid variants: `filter: brightness(1.06)` (`288-292`). Secondary: fill becomes firuze mixed 20% with transparent, no filter (`331-336`). Ghost: fill becomes `paper`, label becomes `ink` (`343-349`). |
| Pressed | `transform: scale(0.97)`, `filter: brightness(0.94)`, transition 60ms (`293-297`). Release animates back over 160ms with `--ease-spring`. |
| Focus | Global ring. |
| Disabled | `:disabled` or `aria-disabled="true"`: fill `paper`, label `muted`, `cursor: not-allowed`, no filter, no press (`298-305`). Ghost disabled: transparent fill, label `faint` (`350-353`). |
| Loading | No built-in state. Components swap the label ("Sending…", `ReportButton.tsx:129`) or the icon for a spinning `Loader2` and set `disabled` (`SayItButton.tsx:130`). |
| Behaviour | `touch-action: manipulation` (no double-tap zoom), `user-select: none`, `-webkit-tap-highlight-color: transparent` (`globals.css:141-144`). Works on `<button>` and `<Link>`. |
| Accessibility | Use a real `<button type="button">` or a `Link`. Label must be visible text, or `aria-label` for icon-only. Disabled labels stay readable (`muted`, not `faint`), per the comment at `globals.css:301`. |
| Do | One `btn-primary` per view. `btn-secondary` for the second action, `btn-ghost` for back, skip and icon actions. `btn-success` / `btn-danger` only for Continue after a correct / wrong answer (FeedbackSheet does this for you). |
| Don't | Add `shadow-[0_Npx_0_…]` lips, `border-2`, or one-off `bg-*` colours to a button. Use `btn-sky` for anything but audio and `btn-plum` for anything but grammar. |

#### Button sizes (`btn-sm`, `btn-lg`, `btn-icon`)

`globals.css:355-374` · `btn-sm` in 29 files, `btn-lg` 27, `btn-icon` 21

| Size | Height | Padding | Radius | Font | Use |
|---|---|---|---|---|---|
| default | 46px (`2.875rem`) | 0 20px | 14px | 16px | Most actions |
| `btn-sm` | 36px (`2.25rem`) | 0 14px | 10px (`0.625rem`) | 14px | Inline secondary actions, back links, "Show all" |
| `btn-lg` | 52px (`3.25rem`) | 0 28px | 16px (`1rem`) | 17px (`1.0625rem`) | The screen's main action (Check, Continue, Start) |
| `btn-icon` | 44px (`2.75rem`) | 0 | 9999px (round) | n/a | Icon-only actions; width 44px |

- `btn-icon` is combined with a colour variant, usually `btn-ghost`. Larger round buttons override the size with `!size-*` (AudioButtons `big`: `!size-14 !rounded-2xl`, `ui.tsx:102`; mic: `!size-20`, `SayItButton.tsx:128`; `!size-24`, `SpeakRound.tsx:180`).
- Icon-only buttons recolour the icon with `!text-sky-ink` (audio, video), `!text-anar-ink` (say it) or `!text-saffron` (bookmarked).

#### Banner button (`btn` with custom variables)

`src/app/app/lessons/page.tsx:39`, `src/app/page.tsx:233` · 2 files

| Aspect | Spec |
|---|---|
| Purpose | An action placed on a solid accent banner (the firuze unit header on Lessons, the landing call to action). |
| Anatomy | `btn` plus `[--btn-bg:rgb(0_0_0/0.2)] [--btn-fg:var(--color-on-accent)]`: a 20% black wash over the banner colour with an on-accent label. |
| States | Inherits all `btn` states (hover brightness, press scale, disabled). |
| Do / don't | Do use it only on a solid accent fill (`bg-firuze text-on-accent`, `lessons/page.tsx:28`). Don't use it on `card` or `canvas`: the wash disappears and the label loses contrast. |

### 2.2 Surfaces

#### Card (`card`)

`globals.css:378-385` · 45 files

| Aspect | Spec |
|---|---|
| Purpose | Grouped container on the canvas: sections, result panels, dialogs, popovers. |
| Anatomy | `border-radius: var(--radius-card)` (1.25rem, 20px; `globals.css:99`), `background: var(--color-card)`, three-layer shadow: a 1px ink ring at 4%, `0 1px 2px rgb(0 0 0/0.04)`, `0 4px 16px rgb(0 0 0/0.03)`. No padding: callers add `p-4`, `p-5` or `p-8`. |
| Variants | Grouped list card: `card divide-y divide-line overflow-hidden !p-0` (`settings/page.tsx:37`, `exams/page.tsx:60`). Dialog card: `card !rounded-[1.75rem]` on `<dialog>` (`SayItButton.tsx:101`). Popover card: `card absolute … shadow-lg` (`ReportButton.tsx:99`). |
| States | Static. Under `prefers-contrast: more` the shadow becomes a 1px `field-edge` ring (`globals.css:552-554`). |
| Accessibility | Use a `<section>` with `aria-labelledby` pointing to its heading when the card is a page region (`TodayPlan.tsx:105`, `Achievements.tsx:13`). |
| Do / don't | Do put cards on `canvas`. Don't nest a card in a card; inside a card use `bg-paper` insets (`WordCard.tsx:41`) or `divide-y divide-line`. Don't use `card` for something tappable: use `tile`. |

#### Tile (`tile`)

`globals.css:388-433` · 25 files; `data-state` set in 11 files

| Aspect | Spec |
|---|---|
| Purpose | Tappable row or option: quiz answers, onboarding choices, path steps, badges. |
| Anatomy | `display: block`, radius 1rem (16px), `1px solid var(--color-line)`, `background: var(--color-card)`. Callers add layout and padding (`tile flex items-center gap-3 p-3`). |
| Default | Hairline border on the card colour. |
| Hover | Only on `a` / `button` tiles without `data-state`: background is card mixed 94% with ink (`globals.css:399-403`). |
| Pressed | `scale(0.98)`, 60ms (`404-407`); release eases over 180ms `--ease-spring`. |
| Focus | Global ring. |
| Disabled | `cursor: not-allowed` (`408-410`). Callers dim unchosen answers with `opacity-50` after checking (`ChoiceRound.tsx:147`). |
| `data-state="selected"` | Sky border, 1px inset sky ring, `sky-soft` fill, `sky-ink` text (`411-416`). |
| `data-state="correct"` | Pista border and inset ring, `pista-soft`, `pista-ink` (`417-422`). |
| `data-state="wrong"` | Anar border and inset ring, `anar-soft`, `anar-ink` (`423-428`). Callers add `animate-shake` (320ms, `globals.css:597-599`). |
| `data-state="current"` | Firuze border and inset ring, no fill change (`429-432`). Used for "Up next" on the path (`path/page.tsx:126`, `SoundPath.tsx:132`). |
| Accessibility | Selection is also exposed as `aria-pressed` (`ChoiceRound.tsx:142`, `TodayPlan.tsx:58`) or `role="radio"` + `aria-checked` (`samfa/Practice.tsx:177`). Correct / wrong add a check or cross icon with `aria-label` (`ChoiceRound.tsx:151-155`). |
| Do / don't | Do drive state only through `data-state`. Don't add a second `border-2` or a custom ring for selection. Don't use `tile` for non-interactive content, except grid items that need the same frame (badges, `Achievements.tsx:64`). |

#### Chip (`chip`)

`globals.css:462-470` · 15 files

| Aspect | Spec |
|---|---|
| Purpose | Small status pill: register (Spoken / Formal), NEW, DEV, counts. |
| Anatomy | Inline-flex, `gap: 0.25rem`, radius 9999px, padding 2px 10px, 12px (`0.75rem`), weight 600. Colour comes from the caller: a `-soft` fill plus the matching `-ink` text (`ui.tsx:73`). |
| States | Static, not interactive. |
| Do / don't | Do pair `bg-{tone}-soft` with `text-{tone}-ink`. Don't make a chip clickable: use `btn-sm` or `Segmented`. |

#### Eyebrow (`eyebrow`)

`globals.css:522-527` · 29 files

| Aspect | Spec |
|---|---|
| Purpose | Section header of a grouped list or card ("Appearance", "Say it", "Sound by sound"). |
| Anatomy | 13px (`0.8125rem`), weight 500, `letter-spacing: 0.02em`, uppercase. Colour from the caller, usually `text-muted`, or a tone `-ink` for a feature label (`text-anar-ink`, `SayItButton.tsx:106`). |
| Accessibility | Used as a real `<h2>` inside settings cards (`settings/page.tsx:78`). Persian inside is never uppercased or tracked (`[lang="fa"]` reset, `globals.css:155-161`). |
| Do / don't | Do use it only for section headers. Don't use it for buttons, body labels or page titles. |

#### Grouped list

`settings/page.tsx:37-55`, `exams/page.tsx:60`; `divide-y divide-line` in 6 files

| Aspect | Spec |
|---|---|
| Purpose | iOS-style list of navigation rows or settings inside one card. |
| Anatomy | `ul.card divide-y divide-line overflow-hidden !p-0`. Row: `Link` with `min-h-[3.75rem]` (60px), `px-4 py-2.5`, leading lucide icon `size-5 text-muted`, title (`font-semibold`), subtitle (`text-sm text-muted`), trailing `ChevronRight size-4 text-faint` (`settings/page.tsx:45-51`). Settings variant: `section.card p-5` with an `eyebrow` `<h2>` and `div.divide-y divide-line` rows of label + control (`settings/page.tsx:94-160`). |
| States | Hover: `hover:bg-paper`. Pressed: `active:bg-paper` (no scale). |
| Do / don't | Do keep one row per destination with a chevron. Don't put buttons inside a navigation row. |

### 2.3 Form controls

#### Text input (`input`)

`globals.css:472-491` · 13 files

| Aspect | Spec |
|---|---|
| Purpose | Single-line text, textareas, time fields. |
| Anatomy | Full width, radius 0.75rem (12px), `1px solid var(--color-field-edge)` (3:1 against card, `globals.css:34-35`), card fill, padding 12px 16px, 17px (`1.0625rem`), weight 400. Placeholder `faint`. |
| Focus | Border turns `sky` plus a 4px sky ring at 22%; the global outline is off (`outline: none`) (`484-487`). |
| Disabled | No dedicated style (browser default). |
| Error / result | Set by callers: `animate-shake !border-anar` on wrong, `!border-pista` on correct (`AnswerInput.tsx:75-80`, `RecallRound.tsx:165`). |
| Variants in use | Textarea: `input resize-none` (`FeedbackCard.tsx:71`, `ReportButton.tsx:107`). Time: `input !w-auto !py-1.5 !text-base` (`ProgressTools.tsx:84`). Size override: `!text-base` (16px) on settings fields. |
| Accessibility | Wrap in `<label>` or give `aria-label` (`AnswerInput.tsx:89`). Keep 16px or more so iOS does not zoom. |

#### Select (`select`)

`globals.css:494-519` · 5 files

| Aspect | Spec |
|---|---|
| Purpose | Native pop-up menu for filters and voice choice. |
| Anatomy | `appearance: none`, min-height 46px, radius 12px, field-edge border, card fill, inline SVG chevron (stroke `#8e8e93`) at right 12px, padding `0 2.25rem 0 0.875rem`, 16px, weight 500, ellipsis. |
| Focus | Same sky border and 4px ring as `input` (`514-518`). |
| Accessibility | Native `<select>`, so keyboard and screen reader behaviour is the platform's. Always add `aria-label` or a `<label>` (`review/page.tsx:151`). |
| Do / don't | Do use it for more than about 4 options. Don't use it for 2–4 options: use `Segmented`. |

#### Segmented

`ui.tsx:152-182` · 10 files

| Aspect | Spec |
|---|---|
| Purpose | iOS segmented control for 2–4 mutually exclusive settings (theme, direction, script, daily goal). |
| Anatomy | Track: `inline-flex rounded-xl bg-paper p-0.5`, 13px, weight 500 (`font-semibold`), horizontal scroll if it overflows. Segment: `min-h-10` (40px), `px-3.5 py-1.5`, radius `0.625rem`. |
| Props | `value: T`, `options: { value: T; label: string }[]`, `onChange: (v: T) => void`, `label: string` (accessible name). Generic over `T extends string`. |
| Default | Unselected segment: `text-muted`. |
| Hover | Unselected label turns `ink`. |
| Selected | `bg-raised text-ink` with a small shadow `0 1px 3px rgb(0 0 0/0.12), 0 0 0 0.5px rgb(0 0 0/0.04)`; `--color-raised` is #ffffff light, #636366 dark (`globals.css:38`, `192`). Transition 200ms. |
| Pressed | No press scale. |
| Accessibility | `role="radiogroup"` with `aria-label`, each segment `role="radio"` + `aria-checked`. Each segment is a separate Tab stop; arrow keys do nothing. |
| Do / don't | Do use sentence-case labels. Don't use it for navigation between pages, or for more than 4 options on a phone. |

#### Checkbox and toggle rows

`settings/page.tsx:141-158`, `listen/page.tsx:129`, `137`, `tutor/page.tsx:218-224` · 3 files

| Aspect | Spec |
|---|---|
| Purpose | On / off settings. There is no switch component; all toggles are native checkboxes. |
| Anatomy | `<label class="flex cursor-pointer items-center justify-between gap-3">` with the text first and `input[type=checkbox].size-5 accent-firuze` last (settings). With a description: checkbox first, `mt-1`, then title + muted hint (`listen/page.tsx:128-134`). |
| States | Checked: firuze tick (`accent-firuze`; tutor uses `accent-[var(--color-firuze)]`). Disabled: the whole label gets `opacity-60` and loses `cursor-pointer` (`listen/page.tsx:136`). |
| Accessibility | Native checkbox inside its `<label>`, so the whole row is the hit area and the name is the label text. |
| Do / don't | Do keep the label text as the accessible name. Don't build a custom switch with a `div`. |

#### PersianKeyboard

`src/components/PersianKeyboard.tsx:18-43` · 1 file (RecallRound)

| Aspect | Spec |
|---|---|
| Purpose | On-screen Persian keyboard for typing answers in Persian script, shown when `settings.showKeyboard` is on (`RecallRound.tsx:192`). |
| Anatomy | `bg-paper rounded-2xl p-2 pb-3` panel, `lang="fa" dir="ltr"`. Three rows in ISIRI 9147 order (12, 11, 10 keys), each indented by `i × 4%`. Bottom row: half-space (ZWNJ, `!flex-[0.7] !text-xs`), space (`!flex-[3]`, muted), backspace (`Delete` icon). Key: `h-11` (44px), `flex-1`, radius 12px, hairline border, card fill, 20px weight 600 (`PersianKeyboard.tsx:15-16`). |
| Props | `onKey: (s: string) => void`, `onBackspace: () => void`. |
| Hover | `hover:bg-paper`. |
| Pressed | `active:translate-y-[3px]` and `active:shadow-none`, 75ms. Not the system scale. |
| Accessibility | Keys are `tabIndex={-1}` (the physical keyboard is the keyboard path). Letter keys are named by their glyph; backspace has `aria-label="Backspace"`; half-space has a `title` only. The panel's `aria-label` sits on a plain `div` without a role. |
| Do / don't | Do keep it as an addition to the text field, never a replacement. Don't reorder keys alphabetically: the layout mirrors physical keys. |

#### AnswerInput (missions)

`src/components/mission/AnswerInput.tsx:12-115` · 1 file (TaskStep)

| Aspect | Spec |
|---|---|
| Purpose | Free answer box: type in Finglish or Persian, or tap the mic and say it. |
| Anatomy | Row: `input min-h-14 flex-1 !text-lg` (56px, 18px) with `dir="auto"`, and a 56px round mic button (`btn-icon !size-14`). Under it a status line (`text-sm font-semibold text-muted`, `min-h-5`). |
| Props | `value: string`, `onChange: (text, alternatives: string[]) => void`, `onSubmit: () => void`, `disabled?: boolean`, `state?: "correct" \| "almost" \| "wrong"`, `autoFocus?: boolean` (default true). |
| States | Input: wrong is `animate-shake !border-anar`, correct and almost are `!border-pista`. Mic idle: `btn-sky` + `Mic`. Listening: `btn-danger` + filled `Square`. Loading model or checking: `Loader2` spinning, disabled. The mic is hidden when no speech engine is available. |
| Behaviour | Enter submits. Focuses itself when enabled. Speech returns several transcripts, all passed on for checking. Errors become a status note ("Microphone is blocked — you can type instead."). |
| Accessibility | Input `aria-label="Your answer"`; mic `aria-label` switches between "Say your answer" and "Stop recording"; status line is `role="status"`. |
| Do / don't | Do always keep typing available. Don't show the mic when `resolveEngine` returns null. |

### 2.4 Feedback and progress

#### ProgressBar

`ui.tsx:34-48` · 16 consumer files

| Aspect | Spec |
|---|---|
| Purpose | Thin capsule showing progress through a session, level, section or badge. |
| Anatomy | Track: `rounded-full bg-paper`, height 10px (`md`, `h-2.5`) or 6px (`sm`, `h-1.5`). Fill: `TONE[tone].bg`, rounded, minimum width equal to its height when above 0 so it reads as a dot. |
| Props | `value: number` (0–1, clamped), `tone?: Tone` (default firuze), `size?: "sm" \| "md"`, `className?: string`, `label?: string` (default "Progress"). |
| Behaviour | Width animates over 500ms with `--ease-spring`. |
| Accessibility | `role="progressbar"`, `aria-label`, `aria-valuenow` (0–100), `aria-valuemin`, `aria-valuemax`. |
| Do / don't | Do pass a specific `label` ("Level progress"). Don't leave the default "Progress" when several bars are on one screen (BadgesCard does, `Achievements.tsx:73`). |

#### StatCard

`ui.tsx:295-305` · 11 files

| Aspect | Spec |
|---|---|
| Purpose | Result tile on session summaries: XP, accuracy, counts. |
| Anatomy | `card animate-pop px-3 py-3.5 text-center`. Label: 12px, weight 500, muted. Value: 24px, weight 600, tight tracking, `TONE[tone].ink`, optional icon before it. |
| Props | `label: string`, `value: ReactNode`, `tone?: Tone` (default saffron), `icon?: ReactNode`. |
| States | Static; appears with `animate-pop` (0.96 → 1, 280ms). |
| Do / don't | Do use the tone that matches meaning (saffron XP, pista accuracy, anar "Again", `practice/page.tsx:91-94`). Don't put actions inside. |

#### FeedbackSheet

`ui.tsx:232-292` · 7 files

| Aspect | Spec |
|---|---|
| Purpose | The fixed bottom bar of every answering session: holds the main action before answering, then shows the verdict and Continue. |
| Anatomy (idle) | Fixed, `inset-x-0 bottom-0 z-40`, `material border-t border-line`, safe-area bottom padding. Inner row `max-w-3xl px-4 py-5 sm:py-7`, column on phones, row from `sm`. Holds `children` (hint text + `btn-primary btn-lg w-full sm:w-auto sm:min-w-40`, `ChoiceRound.tsx:178-183`). |
| Anatomy (answered) | Same position, `animate-slide-up` (420ms, `--ease-sheet`), `rounded-t-[1.75rem]`, shadow `0 -12px 40px rgb(0 0 0/0.14)`, background `color-mix(tone 14%, card)`. Left: 44px round card-colour badge with `CheckCircle2` or `XCircle` (`size-8`, `animate-pop`), title 20px weight 700, optional detail 14px weight 500, all in the tone's `-ink`. Right: Continue as `btn-success` or `btn-danger` `btn-lg`. |
| Props | `state: "idle" \| "correct" \| "almost" \| "wrong"`, `title?: string`, `detail?: ReactNode`, `onContinue?: () => void`, `continueLabel?: string` (default "Continue"), `children?: ReactNode`. |
| States | correct and almost: pista, check icon. wrong: anar, cross icon. |
| Behaviour | Renders a 160px (`h-40`) spacer so content can scroll clear. Continue gets `autoFocus`, so Enter continues. |
| Accessibility | Answered container is `role="status"`, so the verdict is announced. Icon plus title means state is not colour-only. |
| Do / don't | Do use it in every answering session with `SessionHeader`. Don't build another fixed bottom bar for answering (see Gaps). |

#### Status messages (no toasts)

There is no toast component; `grep -rn toast src` finds nothing. Status is inline text with `role="status"`:

| Pattern | Example | Spec |
|---|---|---|
| Success line | `ProgressTools.tsx:71`, `ReportButton.tsx:116-121` | `text-sm font-bold text-pista-ink` + `CheckCircle2` or `Check` icon |
| Error line | `ReportButton.tsx:134-139`, `FeedbackCard.tsx:88` | `text-sm font-semibold text-anar-ink`, "Couldn't send. Try again." |
| Live hint | `AnswerInput.tsx:110`, `SayItButton.tsx:133` | muted, `min-h-*` reserved so layout does not jump |
| Info callout | `settings/page.tsx:68-74` | `rounded-2xl bg-sky-soft p-3 text-sm font-semibold text-sky-ink` + `Info` icon |
| Score pill | `TraceCanvas.tsx:179-188` | `rounded-full px-4 py-2 text-sm font-extrabold`, `pista-soft` if passed, `saffron-soft` if not, `animate-pop` |
| Day done | `TodayPlan.tsx:148-160` | `rounded-2xl bg-pista-soft` or `bg-saffron-soft` panel + `PartyPopper` |

#### Empty state

Built by hand in each place: `bookmarks/page.tsx:95-116`, `practice/page.tsx:49-59`, `HandsFree.tsx:254-262`, `YouglishPlayer.tsx:72-90`, `path/page.tsx:68-71`.

| Aspect | Spec |
|---|---|
| Anatomy | `card flex flex-col items-center p-8 text-center`; 80px round icon disc (`size-20`, tone `-soft` fill, tone `-ink` icon `size-10`); title 24px weight 700 (`mt-5`); explanation `max-w-sm font-semibold text-muted` (`mt-2`); one action (`btn-primary btn-lg` or `btn-secondary`, `mt-6`). |
| Variants | Neutral disc (`bg-paper text-muted`) when nothing is wrong, for example "No hidden words". Compact (inside a panel): 56px `bg-card text-faint` disc (`YouglishPlayer.tsx:74`). |
| Do / don't | Do say what will fill the space and give the one action that fills it. Don't leave a blank card or show "No data". |

### 2.5 Navigation

#### AppNav

`src/components/AppNav.tsx:85-149` · 1 file (`src/app/app/layout.tsx`)

| Aspect | Spec |
|---|---|
| Purpose | App chrome: phone tab bar, phone top bar, desktop sidebar. All three carry `.app-nav` and are hidden in focus mode (`globals.css:618-620`). |
| Destinations | 5 tabs: Home, Path, Exams, Progress, Profile (`AppNav.tsx:13-19`). 14 secondary pages, each mapped to a parent tab (`26-43`). The tutor appears only with a backend. |
| Tab bar | `glass`, fixed, `inset-x-3`, `bottom: max(0.75rem, safe area)`, `max-w-md`, `rounded-[1.75rem]`, `p-1`, phones only (`lg:hidden`) (`127-129`). Five equal `TabLink`s: icon 24px (stroke 2.3 on, 1.9 off), label 10px weight 500, `active:scale-95` (`169-190`). Current tab: `text-sky-ink`; others `text-ink/70`. A `--glass-pill` capsule (`rounded-[1.5rem]`, inset top highlight) slides under the current tab with `translateX(index × 100%)`, 420ms `--ease-spring`, no transition under reduced motion (`132-139`). |
| Top bar (phone) | `material-canvas`, sticky, `h-14` (56px), bottom hairline; Logo left, StatChips right (`117-124`). On desktop only the StatChips show, top right, static. |
| Sidebar (desktop) | `lg:flex`, fixed, `w-64` (256px), solid `bg-card`, right hairline (`97-114`). Logo, then the 5 tabs, then "Practice" and "Course" group labels (`text-xs font-semibold text-muted`). `SideLink`: `rounded-xl px-3 py-2`, 15px weight 500, 32px icon slot with the item's tone `-ink`; current: `bg-sky-soft text-sky-ink`; hover `bg-paper`; `active:scale-[0.98]` (`151-167`). |
| StatChips | Streak (`Flame`, `fill-anar` when > 0, else `fill-line text-faint`) and XP (`Star fill-saffron`), 16px weight 700 (`70-83`). Not interactive. |
| Behaviour | A secondary page highlights its parent tab (`91-92`). |
| Accessibility | Both navs are `<nav aria-label="Main">`; current link has `aria-current="page"`. StatChips have `aria-label` ("3 day streak", "120 XP") and `aria-hidden` icons. |
| Do / don't | Do keep content padded by `pb-[calc(7.5rem+safe area)]` so the tab bar never covers it (`src/app/app/layout.tsx:14`). Don't add a sixth tab; add a secondary page with a `parent`. |

#### Logo and LogoMark

`AppNav.tsx:49-68` · 2 files

| Aspect | Spec |
|---|---|
| Anatomy | LogoMark: 36px (`size-9`) `rounded-xl bg-firuze` tile with an "FA" monogram SVG (stroke 7, on-accent, 78% of the tile, `aria-hidden`). Logo: LogoMark + "Farsi Pen" 24px weight 700 `text-firuze-ink`, links to `/`; a `DEV` chip on the dev site. |
| Props | `LogoMark { className?: string }`; `Logo { compact?: boolean }` (mark only). |
| Accessibility | Logo link `aria-label="Farsi Pen home"`. |

#### SessionHeader (and FocusMode)

`ui.tsx:196-230` · SessionHeader 12 files, FocusMode 4 more

| Aspect | Spec |
|---|---|
| Purpose | Top bar of every session: a way out, progress, an optional right slot. Turns on focus mode, which hides AppNav. |
| Anatomy | `sticky top-0 z-30 -mx-4 mb-6 material-canvas px-4 py-3`; inner `max-w-3xl` row, gap 12px: X (`btn-ghost btn-icon -ml-2`, `X size-6 strokeWidth 3`), `ProgressBar` (`flex-1`), `right`. |
| Props | `exitHref: string`, `onExit?: () => void` (renders a button instead of a link), `progress: number` (0–1), `right?: ReactNode`. |
| Behaviour | `FocusMode` sets `body[data-focus]="1"` on mount and removes it on unmount (`ui.tsx:200-208`); the app layout drops sidebar and tab-bar spacing (`src/app/app/layout.tsx:10`, `14`). |
| Accessibility | X has `aria-label="Quit session"`. Progress bar is announced as "Progress". |
| Do / don't | Do use it in every lesson, practice and exercise. Don't show AppNav during a session. |

#### PageHeader

`ui.tsx:184-194` · 19 files

| Aspect | Spec |
|---|---|
| Anatomy | `mb-6 flex flex-wrap items-end justify-between gap-3`; `h1` 30px weight 700 `tracking-tight`; optional subtitle `mt-1 font-semibold text-muted`; optional `children` on the right (filters, actions). |
| Props | `title: string`, `subtitle?: ReactNode`, `children?: ReactNode`. |
| Accessibility | Provides the page's only `h1`. |
| Do / don't | Do use it on every tab and list page. Don't use it inside sessions (SessionHeader replaces it). |

#### Back link

Hand-built in 9 files, for example `MissionScreen.tsx:50-52`, `privacy/page.tsx:57-59`, `LessonSession.tsx:53-55`

| Aspect | Spec |
|---|---|
| Anatomy | `Link` with `btn-ghost btn-sm -ms-3` (or `-ml-3`) and `ArrowLeft size-4` + the parent page name ("Missions", "Profile"). |
| Variants in use | Icon stroke 3 (`MissionScreen.tsx:51`, `GrammarLesson.tsx:72`) or default 2 (`privacy/page.tsx:58`). Without `btn-sm` (`LessonSession.tsx:53`). Text arrow "← Situations" (`tutor/page.tsx:212`). |
| Accessibility | Visible text names the destination. |
| Do / don't | Do name the parent page, not "Back", when the destination is fixed. Don't use a text arrow character. |

### 2.6 Audio and speech controls

#### AudioButtons

`ui.tsx:79-132` · 18 files

| Aspect | Spec |
|---|---|
| Purpose | Play a Persian word or line with text-to-speech, at normal or slow speed. |
| Anatomy (default) | Two 44px `btn-ghost btn-icon` buttons, icons `!text-sky-ink`: `Volume2` (play) and `Snail` (slow). |
| Anatomy (`big`) | Prompt speaker: `btn-sky btn-icon !size-14 !rounded-2xl` (56px) with `Volume2 size-7`, plus a 44px `btn-sky btn-icon !size-11` slow button. |
| Props | `text: string`, `compact?: boolean` (hides the slow button), `big?: boolean`. |
| States | Playing: `animate-pulse`. Failed: icon `!text-anar-ink`; in `big`, "Audio unavailable" in `text-xs font-bold text-anar-ink`. Disabled when no voice is available (`canSpeak()` false): ghost icons `disabled:!text-line-strong`. |
| Accessibility | `aria-label` "Play audio" / "Play slowly"; on failure "Audio unavailable — try again". The offline / failure reason is only in a `title` on the wrapper. |
| Do / don't | Do use `big` once per prompt. Don't hand-build speaker buttons; mission chat bubbles currently do (`InfoSteps.tsx:53`). |

#### SayItButton and SayItDialog

`src/components/SayItButton.tsx:16-178` · SayItButton 3 files, SayItDialog 2

| Aspect | Spec |
|---|---|
| Purpose | Say a word and see how close it sounded. |
| Trigger | `btn-ghost btn-icon !text-anar-ink` with `Mic size-5`, `title="Say it"` (`20-22`). |
| Dialog anatomy | Native `<dialog>` opened with `showModal()`, portalled to `body`: `card m-auto !rounded-[1.75rem] w-[min(32rem,100vw-2rem)] max-h-[100dvh-2rem] animate-pop`, `backdrop:bg-black/40` + 4px backdrop blur (`globals.css:606-609`). Header: eyebrow "Say it" in `anar-ink`, close X. Word (`FaWord lg`), meaning, "sounds like", `AudioButtons`. Then the mic, the status line, and PronunciationFeedback after a take. |
| Props | `SayItButton { word: Word }`; `SayItDialog { word: Word; onClose: () => void }`. |
| Mic states | Idle: `btn-primary`, 80px round (`!size-20`), `Mic size-10`, status "Listen, then tap the mic and say it". Loading model: `Loader2 animate-spin`, disabled, "Loading speech model…". Listening: `btn-danger`, filled `Square`, `animate-ping` ring in `anar/30`, "Listening…". Checking: spinner, disabled, "Checking…". Done: "Tap to try again". |
| Result | `role="status"` block: `CheckCircle2` / `XCircle` + "Spot on!", "Almost — sounds close." or "Not quite yet." in pista-ink or anar-ink, then "We heard …". |
| Errors | Mapped messages in `anar-ink` (`30-37`); no engine: a `bg-paper` notice with a Settings link (`146-155`). |
| Accessibility | Dialog `aria-label="Say it"`; Escape closes (native); backdrop click closes. Mic `aria-label` "Start speaking" / "Stop recording". |

#### Mic button (pattern)

Repeated in `SayItButton.tsx:121-131`, `SpeakRound.tsx:173-182`, `ScenePlayer.tsx:302-310`, `AnswerInput.tsx:94-108`

| State | Fill | Icon | Extra |
|---|---|---|---|
| Idle | `btn-primary` (dialogs, Speak, Scenes) or `btn-sky` (AnswerInput) | `Mic` | none |
| Loading / checking | unchanged, `disabled` (paper fill, muted icon) | `Loader2 animate-spin` | status text |
| Listening | `btn-danger` | filled `Square` (stop) | `animate-ping` ring `bg-anar/30`, `aria-hidden` |
| Sizes | 96px (`!size-24`, Speak), 80px (`!size-20`, Say it), 64px (`!size-16`, Scenes), 56px (`!size-14`, AnswerInput) | | |

#### PronunciationFeedback, ColoredWord, SoundTipCard

`src/components/PronunciationFeedback.tsx:12-226` · PronunciationFeedback 2 files, ColoredWord 3, SoundTipCard 3

| Aspect | Spec |
|---|---|
| Purpose | Sound-by-sound feedback after speaking. |
| Anatomy | Row: `ScoreRing` (64px SVG ring, stroke 7, `stroke-line` track, tone fill, number 18px weight 700, `49-75`) + `ColoredWord` (30px, `sm:` 36px) + "Accuracy n% · Completeness n%". Then "Sound by sound" eyebrow and a wrap of sound tiles, a colour legend, playback buttons, and the `SoundTipCard` for the picked sound. |
| Score tones | ≥ 90 pista, ≥ 60 saffron, else anar (`21-23`). |
| ColoredWord | Each letter coloured by status: good `pista-ink`, close `saffron-ink`, off `anar-ink`, missed `anar-ink` at 60% with a dotted underline (offset 8px), silent uncoloured (`12-18`, `31-47`). |
| Sound tile | `min-h-11 min-w-14 rounded-xl border px-2 py-1`, tone border + `-soft` fill + `-ink` text; glyph 18px + "label · score" 12px. Selected: `ring-[3px] ring-sky`. Pressed: `active:translate-y-0.5` (`141-145`). |
| Playback | `btn-sky btn-sm` "Model", `btn-secondary btn-sm` "My voice" and "Back to back"; the playing one pulses; all disabled while playing (`164-178`). |
| SoundTipCard | `animate-pop rounded-2xl border border-line bg-paper p-4`: letters on card-coloured chips, name, score, "Like …", tip, `MouthDiagram`, example chips with `AudioButtons compact` (`192-226`). Props: `sound: Sound`, `score?: number`, `compact?: boolean`, `className?: string`. |
| Props | `result: PhonicsResult`, `overall: number`, `model: string`, `audio: Blob \| null`, `focus?: string`. |
| Accessibility | ColoredWord exposes one `aria-label` listing each sound and its status in words ("sh clear, r off"), letters are `aria-hidden`. ScoreRing is `role="img"` "Overall n%". Sound tiles have `aria-pressed` and a label with score and "show tip". Legend repeats the colours in words. |

#### YouglishPlayer, YouglishButton, YouglishDialog

`src/components/YouglishPlayer.tsx:14-151` · YouglishPlayer 1 consumer (`words/page.tsx`), YouglishButton 2

| Aspect | Spec |
|---|---|
| Purpose | Real-video pronunciation: clips of native speakers saying the word, via the YouGlish widget. |
| Anatomy | Frame: `rounded-2xl border border-line bg-paper`. Attribution under it: "n clips · Powered by YouGlish.com" (required by YouGlish, `92-96`). |
| States | Loading: `role="status"`, `Loader2 animate-spin` + "Finding videos…". Ready: widget shown. Empty: `VideoOff` in a 56px card disc, "No clips for … yet", "Try a shorter or more common word." Error: same layout, "Videos couldn't load", "Check your connection and try again." |
| Button | `btn-ghost btn-icon !text-sky-ink` with `MonitorPlay`, `aria-label` "Hear “word” in real videos". |
| Dialog | Same dialog shell as SayItDialog, `w-[min(48rem,100vw-2rem)]`, eyebrow in `sky-ink`, close button `autoFocus`, locks body scroll while open (`114-151`). |
| Props | `YouglishPlayer { query }`; `YouglishButton { query; label? }`; `YouglishDialog { query; label?; onClose }`. |

### 2.7 Content components

#### Fa

`ui.tsx:25-31` · 40 consumer files

| Aspect | Spec |
|---|---|
| Purpose | Wrap every piece of Persian text. |
| Anatomy | `<span lang="fa" dir="rtl">`. `[lang="fa"]` sets Yekan Bakh, DOTS 1 (0 inside headings), no letter-spacing, no uppercase (`globals.css:155-165`). |
| Props | `children: ReactNode`, `className?: string`. |
| Do / don't | Do use `Fa` for any Persian string, even one word inside English. Don't set `dir="rtl"` on a whole LTR layout. |

#### FaWord

`ui.tsx:50-68` · 5 files

| Aspect | Spec |
|---|---|
| Purpose | Show a word according to the learner's script settings. |
| Props | `word: Pick<Word, "fa" \| "tr">`, `settings: Settings`, `size?: "md" \| "lg" \| "xl"` (default lg). |
| Variants | `scriptOnly`: Persian only. `script: "farsi"`: Persian (weight 600) over muted transliteration. `script: "latin"`: transliteration (weight 700) over muted Persian. Sizes: md 20px, lg 30px, xl 36px → 48px from `sm`. |

#### Bubble (pointer label)

`ui.tsx:307-320` · 2 files (`src/app/page.tsx`, `lessons/page.tsx`)

| Aspect | Spec |
|---|---|
| Purpose | Small speech bubble with a pointer, for "Start" / "Continue" above the current lesson node. |
| Anatomy | `eyebrow` text in `firuze-ink`, `rounded-xl border border-line bg-card px-3 py-1.5`, a 10px rotated square pointer at the bottom centre. |
| Props | `children: ReactNode`, `className?: string`. |
| Note | Its `relative` beats an `absolute` class, so callers position it with a wrapper (`lessons/page.tsx:62`). A different component with the same name (chat bubble) lives in `mission/InfoSteps.tsx:41`. |

#### Chat bubble (missions)

`mission/InfoSteps.tsx:41-61` · 2 files

| Aspect | Spec |
|---|---|
| Anatomy | `max-w-[85%] rounded-2xl border p-3.5`; learner lines right-aligned with `border-firuze bg-firuze-soft`, the other speaker left with `border-line bg-card`. Speaker eyebrow, `RegisterTag`, Persian 24px (20px `compact`) with a speaker button, transliteration, optional English. |
| Props | `line`, `name?: string`, `showEn: boolean`, `compact?: boolean`. |

#### RegisterTag

`ui.tsx:70-77` · 4 files

| Aspect | Spec |
|---|---|
| Purpose | Marks a word as spoken or formal. |
| Variants | `colloquial`: chip `bg-saffron-soft text-saffron-ink` "Spoken". `formal`: `bg-plum-soft text-plum-ink` "Formal". `both`: renders nothing. |
| Props | `register: Word["register"]`. |

#### BookmarkButton

`ui.tsx:134-149` · 3 files

| Aspect | Spec |
|---|---|
| Anatomy | `btn-ghost btn-icon` with `Bookmark size-5`. |
| States | Off: muted outline icon. On: `!text-saffron` and `fill-current`. Hover / press / focus from `btn-ghost`. |
| Props | `wordId: string`. Toggles via `toggleBookmark`. |
| Accessibility | `aria-pressed`; `aria-label` "Add to my cards" / "Remove from my cards"; `title` "In my cards" when on. |

#### ReportButton

`src/components/ReportButton.tsx:35-151` · 6 files

| Aspect | Spec |
|---|---|
| Purpose | Report a content problem on any word, sentence or exercise. |
| Anatomy | Trigger: `btn-ghost btn-icon` with `Flag`. Popover: `card absolute bottom-full z-20 mb-2 w-72 animate-pop p-4 shadow-lg`, aligned left or right; title, muted explanation, `input` textarea (3 rows), `btn-primary w-full` "Send report" (with `ExternalLink` when it opens GitHub). |
| Props | `itemId: string`, `context?: string`, `className?: string`, `align?: "left" \| "right"` (default right). |
| States | Idle; sending ("Sending…", disabled); sent (`role="status"`, pista "Thanks — report sent", closes after 1400ms); error (`role="status"`, anar "Couldn't send. Try again."). |
| Behaviour | Saves a copy (last 50) in `localStorage` key `farsipen:reports`; sends to the backend if there is one, otherwise opens a pre-filled GitHub issue. |
| Accessibility | Trigger `aria-expanded` + `aria-label="Report a problem with this content"`; textarea `aria-label`. The popover does not close on Escape or outside click, and focus does not move into it. |

#### WordCard

`src/components/WordCard.tsx:11-65` · 3 files

| Aspect | Spec |
|---|---|
| Purpose | One word in the lesson preview, word library and My cards. |
| Anatomy | `card flex flex-col p-4`. Top: word per script setting (Persian 24px weight 600 + transliteration, or transliteration 20px weight 700 + Persian 20px muted), and `NEW` chip + `RegisterTag` right. "sounds like …" 12px muted. Meaning 18px weight 700; example in a `bg-paper rounded-xl p-3` inset. Footer action row: AudioButtons, SayItButton, YouglishButton, BookmarkButton, ReportButton, then `extra` (`53-62`). |
| Props | `word: Word`, `isNew?: boolean`, `hideMeaning?: boolean`, `extra?: ReactNode`. |
| States | `hideMeaning`: a `btn-secondary btn-sm` "Show translation" replaces the meaning until tapped (`49-51`). |
| Accessibility | Every icon button has its own `aria-label`. |

#### CardControls

`src/components/CardControls.tsx:6-33` · 5 files

| Aspect | Spec |
|---|---|
| Purpose | Direction and script toggles shown above lessons, practice and the word list. |
| Anatomy | Wrap of up to two `Segmented` controls: Direction (FA → EN / EN → FA) and Script (Latin first / فارسی first / Script only). |
| Props | `showDirection?: boolean` (default true). Writes straight to settings. |

#### TraceCanvas

`src/components/TraceCanvas.tsx:80-192` · 1 file (`alphabet/page.tsx`)

| Aspect | Spec |
|---|---|
| Purpose | Trace a Persian letter with finger or mouse and get a score. |
| Anatomy | 300px square `card` with three ruled guide lines (`border-line`, the middle one dashed), a guide canvas drawing the glyph in the `line` colour, an ink canvas drawing 14px round strokes in `firuze`. Below: `btn-secondary` "Clear" (`Eraser`) and `btn-primary` "Check" (`Check`). Then a score pill. |
| Props | `text: string`, `onScore: (score: number) => void`, `passMark: number`. |
| States | Empty: both buttons disabled. Inked: enabled. Result: ≥ 85 "Beautiful! n/100"; ≥ passMark "Nice — passed with n/100" (pista-soft); below "n/100 — try to cover the whole letter and stay on it" (saffron-soft). |
| Behaviour | Pointer capture, `touch-none` (no scroll while drawing), canvas scaled by devicePixelRatio, colours read from CSS tokens so it follows the theme. Score = coverage × accuracy on a 60 × 60 grid. |
| Accessibility | Ink canvas `aria-label="Trace the letter …"`; result `role="status"`. There is no keyboard way to trace. |

#### MouthDiagram

`src/components/MouthDiagram.tsx:29-107` · 1 file (via SoundTipCard)

| Aspect | Spec |
|---|---|
| Purpose | Side view of the mouth showing where a sound is made. |
| Anatomy | SVG, viewBox `20 0 160 170`, max width 240px (`max-w-60`). Face outline `stroke-muted`; lips `fill-anar-soft stroke-anar`; teeth `fill-card stroke-line-strong`; palate and throat `stroke-ink`; tongue `fill-firuze-soft stroke-firuze`; dashed air path `stroke-sky` with an arrow; voice box zig-zag `stroke-plum` (voiced) or a flat line; contact point saffron dot with a pulsing halo. All strokes 2–2.5. Caption under it. |
| Props | `mouth: Mouth`, `className?: string`. |
| Accessibility | `role="img"` with `aria-label="Mouth position: …"`; the same text as a visible `figcaption`. |

#### LevelCard and BadgesCard (achievements)

`src/components/Achievements.tsx:10-89` · 1 file each (`progress/page.tsx`)

| Aspect | Spec |
|---|---|
| LevelCard | `section.card p-5`: "Level n" (14px, saffron-ink), level name `h2` 20px + Persian name, saffron `ProgressBar`, "n XP to …" or "Top level reached". |
| BadgesCard | `section.card p-5`: `Trophy` + "Badges" `h2` + "n/N earned". Grid 2 columns (4 from `sm`) of `tile` items: 48px round emoji disc (`bg-saffron-soft` earned; `bg-paper opacity-60 grayscale` locked), name, then "Earned" (saffron-ink) or description + `sm` saffron ProgressBar + "have/need". Earned first, then closest. Four shown until "Show all N badges" (`btn-ghost btn-sm w-full`, `aria-expanded`). |
| Accessibility | Sections are labelled by their headings; emoji discs are `aria-hidden`. Locked state is in text, not only grey. |

#### TodayPlan (and Onboarding, BackupNudge)

`src/components/TodayPlan.tsx:24-200` · 1 file each (`src/app/app/page.tsx`)

| Aspect | Spec |
|---|---|
| TodayPlan anatomy | `section.card p-5 sm:p-6`: "Today" `h2` 24px + "n of N done". Ordered list of steps; one `btn-primary btn-lg w-full` "Start" / "Continue" with `ArrowRight`; or a "finished" panel. |
| Step item | `Link`, `rounded-2xl border p-3`, gap 12px: 44px round marker (done: `bg-pista text-on-accent` + `Check`; current: `bg-card` + emoji; later: `bg-paper` + emoji), title weight 700 (done: muted, struck through), detail 14px muted truncated (`119-138`). |
| Step states | Current: `border-firuze bg-firuze-soft`, `aria-current="step"`. Others: `border-line`, hover `bg-paper`. Screen-reader text "Done" / "Next". |
| Onboarding | Two questions in a card. Step 1: 2-column grid of `tile` choices with emoji (`data-state="selected"` + `aria-pressed`). Step 2: 3 `tile` choices. `btn-ghost btn-sm` Skip and Back. |
| BackupNudge | After a 3-day streak, once a month: card with 🔥, message, `btn-secondary btn-sm` "Save backup", `btn-ghost btn-icon` X (`aria-label="Not now"`). |

#### Path items

`src/app/app/path/page.tsx:13-148` · 1 file; same pattern in `SoundPath.tsx`

| Aspect | Spec |
|---|---|
| Next-up panel | `rounded-[1.25rem] p-5 sm:p-6` on the section tone's `-soft`; "Next up · Section n · …" in tone `-ink`; Badge + title `h2` 24px; `btn-primary btn-lg w-full` Start / Continue (`47-66`). |
| Section | `li.card overflow-hidden`; header `button` (`aria-expanded`) with a 48px tone-filled number disc, "Section n · CEFR", title + Persian, "n of N done", `ChevronDown` that rotates 180° over 300ms. |
| Step row | Timeline rail (2px line, tone fill when done, `bg-line` otherwise) and a 24px dot: done = tone fill + `Check`; next = tone border on card; later = `border-line` on card. Then a `tile` link (`data-state="current"` when next) with a 44px Badge, kind or "Up next", title, subtitle, optional `sm` ProgressBar, `ChevronRight`. |
| Badge | 44px `rounded-xl`: done = tone fill + on-accent; else tone `-soft` + tone `-ink`. Shows an emoji (`aria-hidden`) or Persian letters in `Fa` (`13-26`). |
| Tones | Sections cycle firuze, saffron, sky, pista, plum, anar, firuze (`path/page.tsx:10`). |

#### TONE map

`ui.tsx:13-23` · used with `TONE[` in 8 files

| Tone | `bg` | `soft` | `ink` | `border` | `btn` |
|---|---|---|---|---|---|
| firuze | `bg-firuze` | `bg-firuze-soft` | `text-firuze-ink` | `border-firuze` | `btn-primary` |
| pista | `bg-pista` | `bg-pista-soft` | `text-pista-ink` | `border-pista` | `btn-success` |
| anar | `bg-anar` | `bg-anar-soft` | `text-anar-ink` | `border-anar` | `btn-danger` |
| saffron | `bg-saffron` | `bg-saffron-soft` | `text-saffron-ink` | `border-saffron` | `btn-primary` |
| sky | `bg-sky` | `bg-sky-soft` | `text-sky-ink` | `border-sky` | `btn-sky` |
| plum | `bg-plum` | `bg-plum-soft` | `text-plum-ink` | `border-plum` | `btn-plum` |

Tailwind needs literal class names, so any tone-driven component looks classes up here instead of building them from strings.

## 3. Usage: do and don't

| Do | Don't |
|---|---|
| Put the session's main action in `FeedbackSheet` children as `btn-primary btn-lg w-full sm:w-auto sm:min-w-40`. | Build a new fixed bottom bar with `material … border-t` for an answering step. |
| Mark answer options with `tile` + `data-state` and an icon. | Colour an option green or red with `bg-pista-soft` alone. |
| Use `Segmented` for 2–4 settings choices, `select` for more. | Use a row of `btn-sm` buttons as a radio group. |
| Use `SessionHeader` with `onExit` when quitting needs a callback. | Copy SessionHeader's markup into a local header (`RecallRound.tsx:251-265` does). |
| Give every icon-only button an `aria-label` that names the action and the word ("Say “salâm” and check your pronunciation"). | Rely on `title` for the only explanation. |
| Keep `btn-sm` for secondary, inline actions. | Use `btn-sm` as the only way to do something important on a phone (36px is below the 44px target). |
| Use `hover:` (Tailwind 4) or `@media (hover: hover)` for hover styles. | Write raw `:hover` CSS that sticks after a tap. |
| Show Persian with `Fa` / `FaWord` and respect `settings.scriptOnly`. | Print `word.fa` in a plain `span`. |
| Indicate playing or listening with a static change (icon, label, fill). | Add new looping animations (`animate-pulse`, `animate-ping`). |

## 4. Accessibility notes

- **Targets.** `btn` is 46px, `btn-lg` 52px, `btn-icon` 44px, tiles are at least 64px in quizzes (`min-h-16`, `ChoiceRound.tsx:146`). Below 44px today: `btn-sm` (36px), `Segmented` segments (40px), Persian keyboard keys on phones (44px tall but about 25px wide at 375px).
- **Names.** Icon buttons in `ui.tsx`, AppNav, SayIt, Youglish and Report all carry `aria-label`. Toggle buttons expose `aria-pressed` (BookmarkButton, sound tiles, onboarding tiles); disclosures expose `aria-expanded` (path sections, ReportButton, BadgesCard).
- **Roles.** ProgressBar is `role="progressbar"` with values; Segmented and FeedbackCard's rating are `radiogroup`/`radio`; ScoreRing and MouthDiagram are `role="img"` with text.
- **Live regions.** Verdicts (FeedbackSheet answered, SayIt result, TraceCanvas score) and status lines use `role="status"`.
- **Focus.** One global ring (3px sky at 70%, offset 2px), keyboard-only. Inputs and selects use a sky border plus a 4px 22% ring instead. FeedbackSheet's Continue and YouglishDialog's close take focus when they appear. Dialogs are native `<dialog>` with `showModal()`, so focus is trapped and Escape closes.
- **Colour.** Correct / wrong / selected always come with icons or words; PronunciationFeedback adds a written legend and a spoken `aria-label`.
- **Motion and transparency.** All animations collapse under `prefers-reduced-motion` (`globals.css:166-173`); materials go solid under `prefers-reduced-transparency` and without blur support (`531-547`).

## 5. Code reference

| Area | File |
|---|---|
| Button, surface, form and motion classes | `src/app/globals.css:258-603` |
| Primitives: Fa, FaWord, ProgressBar, RegisterTag, AudioButtons, BookmarkButton, Segmented, PageHeader, FocusMode, SessionHeader, FeedbackSheet, StatCard, Bubble, TONE | `src/components/ui.tsx` |
| AppNav, Logo, LogoMark, StatChips, SideLink, TabLink | `src/components/AppNav.tsx` |
| PersianKeyboard | `src/components/PersianKeyboard.tsx` |
| AnswerInput | `src/components/mission/AnswerInput.tsx` |
| SayItButton, SayItDialog | `src/components/SayItButton.tsx` |
| PronunciationFeedback, ColoredWord, ScoreRing, SoundTipCard | `src/components/PronunciationFeedback.tsx` |
| YouglishPlayer, YouglishButton, YouglishDialog | `src/components/YouglishPlayer.tsx` |
| ReportButton | `src/components/ReportButton.tsx` |
| WordCard, CardControls | `src/components/WordCard.tsx`, `src/components/CardControls.tsx` |
| TraceCanvas, MouthDiagram | `src/components/TraceCanvas.tsx`, `src/components/MouthDiagram.tsx` |
| LevelCard, BadgesCard | `src/components/Achievements.tsx` |
| TodayPlan, Onboarding, BackupNudge | `src/components/TodayPlan.tsx` |
| Path Badge, section and step rows | `src/app/app/path/page.tsx` |
| Chat Bubble | `src/components/mission/InfoSteps.tsx:41` |

### Component inventory

"Used in" counts `.tsx` files under `src/` that render the component (`<Name`) or use the class, excluding the file that defines it.

| Name | File | Status | Used in |
|---|---|---|---|
| `btn` + variants | `globals.css:261-354` | stable | primary 37, secondary 33, ghost 35, danger 11, sky 12, success 5, plum 3 |
| `btn-sm` / `btn-lg` / `btn-icon` | `globals.css:355-374` | stable | 29 / 27 / 21 |
| Banner button (`--btn-bg`) | `lessons/page.tsx:39` | one-off pattern | 2 |
| `card` | `globals.css:378` | stable | 45 |
| `tile` (+ `data-state`) | `globals.css:388` | stable | 25 (11 with `data-state`) |
| `chip` | `globals.css:462` | stable | 15 |
| `eyebrow` | `globals.css:522` | stable | 29 |
| `input` | `globals.css:472` | stable | 13 |
| `select` | `globals.css:494` | stable | 5 |
| `material` / `material-canvas` | `globals.css:437-446` | stable | 7 |
| `glass` | `globals.css:451` | stable | 2 |
| Fa | `ui.tsx:25` | stable | 40 |
| FaWord | `ui.tsx:51` | stable | 5 |
| ProgressBar | `ui.tsx:34` | stable | 16 |
| RegisterTag | `ui.tsx:70` | stable | 4 |
| AudioButtons | `ui.tsx:89` | stable | 18 |
| BookmarkButton | `ui.tsx:134` | stable | 3 |
| Segmented | `ui.tsx:152` | stable | 10 |
| PageHeader | `ui.tsx:184` | stable | 19 |
| FocusMode | `ui.tsx:200` | stable | 4 |
| SessionHeader | `ui.tsx:211` | stable | 12 |
| FeedbackSheet | `ui.tsx:239` | stable | 7 |
| StatCard | `ui.tsx:295` | stable | 11 |
| Bubble (pointer) | `ui.tsx:308` | stable | 2 |
| AppNav | `AppNav.tsx:85` | stable | 1 |
| Logo / LogoMark | `AppNav.tsx:49-68` | stable | 1 (`src/app/page.tsx`) |
| StatChips | `AppNav.tsx:70` | one-off | 0 (local) |
| PersianKeyboard | `PersianKeyboard.tsx:18` | one-off | 1 |
| AnswerInput | `mission/AnswerInput.tsx:12` | one-off | 1 |
| SayItButton | `SayItButton.tsx:16` | stable | 3 |
| SayItDialog | `SayItButton.tsx:39` | stable | 1 (`HomeSections.tsx`) |
| PronunciationFeedback | `PronunciationFeedback.tsx:78` | stable | 2 |
| ColoredWord | `PronunciationFeedback.tsx:31` | stable | 2 |
| SoundTipCard | `PronunciationFeedback.tsx:192` | stable | 2 |
| YouglishPlayer | `YouglishPlayer.tsx:14` | stable | 1 |
| YouglishButton | `YouglishPlayer.tsx:102` | stable | 2 |
| ReportButton | `ReportButton.tsx:35` | stable | 6 |
| WordCard | `WordCard.tsx:11` | stable | 3 |
| CardControls | `CardControls.tsx:6` | stable | 5 |
| TraceCanvas | `TraceCanvas.tsx:80` | one-off | 1 |
| MouthDiagram | `MouthDiagram.tsx:29` | one-off | 1 |
| LevelCard / BadgesCard | `Achievements.tsx:10`, `35` | one-off | 1 each |
| TodayPlan / Onboarding / BackupNudge | `TodayPlan.tsx:97`, `24`, `167` | one-off | 1 each |
| Chat Bubble | `mission/InfoSteps.tsx:41` | one-off (name clash) | 1 (`TaskStep.tsx`) |
| Path Badge | `path/page.tsx:13` | one-off | 0 (local) |
| RoundHeader | `RecallRound.tsx:251` | duplicate of SessionHeader | 0 (local) |
| Mic button | 4 hand-built copies | should be promoted to ui.tsx | 4 (`SayItButton`, `SpeakRound`, `ScenePlayer`, `AnswerInput`) |
| Bottom action bar | hand-built `material fixed … border-t` | should be promoted to ui.tsx | 4 (`ReadingLessonView`, `FlashcardSession`, `ScenePlayer`, `placement`) |
| Empty state | hand-built | should be promoted to ui.tsx | 5 (`bookmarks`, `practice`, `HandsFree`, `YouglishPlayer`, `path`) |
| Back link | hand-built | should be promoted to ui.tsx | 9 |
| Modal dialog shell | hand-built `<dialog>` | should be promoted to ui.tsx | 3 (`SayItButton`, `YouglishPlayer`, `sounds/page.tsx`) |
| Checkbox row | native checkbox | should be promoted to ui.tsx | 3 (`settings`, `listen`, `tutor`) |
| Grouped list row | hand-built | should be promoted to ui.tsx | 2 (`settings`, `exams`) |

## 6. Gaps and recommendations

### P0

- **Looping animations break the "nothing loops" rule.** `animate-pulse` while playing (`ui.tsx:102`, `118`; `PronunciationFeedback.tsx:165-173`), on the contact point (`MouthDiagram.tsx:99`), and `animate-ping` on listening mics (`SayItButton.tsx:122`, `SpeakRound.tsx:174`, `ScenePlayer.tsx:304`). They stop under reduced motion, but the skill (§1, §8) says no looping animations. *(proposed)* Replace with a static state (playing: filled icon + "Playing" label; listening: the existing danger fill and stop icon) or one 280ms `animate-pop` on change.
- **Targets under 44px.** `btn-sm` is 36px (`globals.css:356`) and is used for real actions (Skip, Save backup, Show translation); Segmented segments are 40px (`ui.tsx:173`). The skill's checklist asks for 44px or more. *(proposed)* Raise `btn-sm` to 44px with a smaller visual padding, and Segmented to `min-h-11`.
- **ReportButton popover has no keyboard dismissal.** No Escape, no outside click, focus does not move in (`ReportButton.tsx:97-148`). *(proposed)* Build it on `<dialog>` or a popover primitive.

### P1

- **No grabber on sheets.** The skill (§1, §7) says bottom sheets show a grabber; `grep -i grabber src` finds none, and FeedbackSheet's answered state has none (`ui.tsx:261-268`). Fix the code or the skill.
- **Mic button idle colour is inconsistent.** `btn-primary` in SayIt, Speak and Scenes, `btn-sky` in AnswerInput. *(proposed)* Promote a `MicButton` (idle / loading / listening / checking) to `ui.tsx` with one colour rule.
- **Duplicated chrome.** `RoundHeader` copies SessionHeader although SessionHeader already accepts `onExit` (`RecallRound.tsx:247-265`). Four screens hand-build a bottom action bar instead of a shared `ActionBar` *(proposed)*.
- **Segmented lacks arrow-key navigation.** It claims `role="radiogroup"`, but every segment is a Tab stop and arrows do nothing (`ui.tsx:164-180`). *(proposed)* Roving tabindex with Left / Right.
- **Press feedback differs from the system.** PersianKeyboard keys translate 3px (`PersianKeyboard.tsx:16`) and sound tiles translate 2px (`PronunciationFeedback.tsx:145`) instead of scaling; FeedbackCard faces scale to 0.90. Its code comment still describes "2px border plus a 3px bottom edge" (`PersianKeyboard.tsx:14`).
- **`border-2` on path step dots** (`path/page.tsx:119`) breaks the hairline rule.
- **Two components called `Bubble`** (`ui.tsx:308`, `mission/InfoSteps.tsx:41`). *(proposed)* Rename the chat one `ChatBubble`.
- **Audio failure reason is only in `title`.** Screen-reader and touch users never hear why the speaker is disabled (`ui.tsx:92`, `100`, `115`). *(proposed)* Visible or `aria-describedby` text.

### P2

- **Stale comments.** ProgressBar says "Thick rounded bar with a highlight sheen" (`ui.tsx:33`), but it is thin and flat.
- **Back links vary.** `-ml-3` vs `-ms-3`, icon stroke 3 vs 2, with and without `btn-sm`, and a text arrow in the tutor (`tutor/page.tsx:212`). *(proposed)* A `BackLink` primitive.
- **Checkbox accent differs.** `accent-firuze` vs `accent-[var(--color-firuze)]` (`tutor/page.tsx:220`). *(proposed)* A `CheckboxRow` primitive; decide whether a switch is wanted.
- **Empty states and dialogs are hand-built** in 5 and 3 places. *(proposed)* `EmptyState` and `Dialog` primitives; YouglishDialog locks body scroll and focuses close, SayItDialog does neither.
- **PersianKeyboard's `aria-label`** sits on a `div` without a role, so it is not announced. *(proposed)* `role="group"`.
- **`TONE.saffron.btn` maps to `btn-primary`** (`ui.tsx:20`); there is no saffron button. Document this or add one.
- **Uppercase "NEW" chip** (`WordCard.tsx:32`) is typed in capitals; the rules reserve uppercase for `eyebrow`.
- **Redundant `!p-0` on `card`** (`settings/page.tsx:37`, `path/page.tsx:90`): `card` has no padding.
- **No toast component.** Inline `role="status"` lines cover every case today; keep it that way unless a background event needs one *(proposed)*.
