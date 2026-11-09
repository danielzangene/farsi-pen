"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AudioLines, Bookmark, GraduationCap, ChartColumn, BookOpenText, Clapperboard, Headphones, BookHeart, BookOpen, Compass, Flame, House, Layers, Menu, Mic, PenLine, Puzzle, Repeat, Settings, Star, X } from "lucide-react";
import { currentStreak, useProgress } from "@/lib/store";
import { cx, IS_DEV_SITE } from "@/lib/util";
import { TONE, type Tone } from "@/components/ui";

type NavItem = { href: string; label: string; icon: typeof House; tone?: Tone; exact?: boolean; hint?: string };

/** The core loop: on the phone's tab bar and first in the sidebar. */
const PRIMARY: NavItem[] = [
  { href: "/app/", label: "Home", icon: House, tone: "firuze", exact: true },
  { href: "/app/lessons/", label: "Lessons", icon: BookOpen, tone: "saffron" },
  { href: "/app/missions/", label: "Missions", icon: Compass, tone: "firuze" },
  { href: "/app/words/", label: "Words", icon: Layers, tone: "sky" },
];

/** Extra practice and tools: under "More" on phones, a second group in the sidebar. */
const SECONDARY: NavItem[] = [
  { href: "/app/progress/", label: "Progress", icon: ChartColumn, tone: "saffron", hint: "Streak calendar, XP chart, your sounds" },
  { href: "/app/speak/", label: "Speak", icon: Mic, tone: "anar", hint: "Say words, see each sound scored" },
  { href: "/app/listen/", label: "Hands-free", icon: Headphones, tone: "firuze", hint: "Hear it, say it, repeat — eyes free" },
  { href: "/app/scenes/", label: "Scenes", icon: Clapperboard, tone: "sky", hint: "Play a part in everyday sketches" },
  { href: "/app/sounds/", label: "Sounds", icon: AudioLines, tone: "saffron", hint: "Hard Persian sounds and a daily workout" },
  { href: "/app/practice/", label: "Daily Practice", icon: Repeat, tone: "sky", hint: "Type words from memory" },
  { href: "/app/reading/", label: "Reading", icon: BookOpenText, tone: "plum", hint: "B1 texts about Iran, with tasks" },
  { href: "/app/samfa/", label: "SAMFA exam", icon: GraduationCap, tone: "firuze", hint: "Prepare for the Persian proficiency test" },
  { href: "/app/grammar/", label: "Grammar", icon: Puzzle, tone: "plum", hint: "A1 to B2, with exercises" },
  { href: "/app/alphabet/", label: "Alphabet", icon: PenLine, tone: "pista", hint: "Letters, vowel signs, tracing" },
  { href: "/app/poetry/", label: "Poetry", icon: BookHeart, tone: "plum", hint: "Fâl-e Hâfez and the poems everyone knows" },
  { href: "/app/bookmarks/", label: "My cards", icon: Bookmark, tone: "saffron", hint: "Words you saved" },
];

const SETTINGS: NavItem = { href: "/app/settings/", label: "Settings", icon: Settings, hint: "Voice, speech, goals, theme" };

/**
 * The "FA" monogram on a teal tile. Same paths as scripts/make-icons.mjs,
 * which renders the favicon, app icons and share image.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cx("grid size-9 shrink-0 place-items-center rounded-xl bg-firuze text-on-accent shadow-[0_3px_0_var(--color-firuze-shadow)]", className)}>
      <svg viewBox="0 0 64 64" className="size-[78%]" fill="none" stroke="currentColor" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 46V18h14M14 31h11M34 46l8-28 8 28M37 37h10" />
      </svg>
    </span>
  );
}

/** Brand mark + name. `compact` shows the mark only. */
export function Logo({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl text-2xl font-extrabold tracking-tight text-firuze-ink" aria-label="Farsi Pen home">
      <LogoMark />
      {!compact && <span>Farsi Pen</span>}
      {IS_DEV_SITE && <span className="chip bg-saffron-soft text-saffron-ink">DEV</span>}
    </Link>
  );
}

function StatChips({ streak, xp }: { streak: number; xp: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="flex items-center gap-1 rounded-xl px-2 py-1.5 text-base font-extrabold text-anar-ink" title="Day streak" aria-label={`${streak} day streak`}>
        <Flame className={cx("size-5", streak > 0 ? "fill-anar text-anar-ink" : "fill-line text-faint")} aria-hidden />
        <span className={streak > 0 ? undefined : "text-faint"}>{streak}</span>
      </span>
      <span className="flex items-center gap-1 rounded-xl px-2 py-1.5 text-base font-extrabold text-saffron-ink" title="Total XP" aria-label={`${xp} XP`}>
        <Star className="size-5 fill-saffron text-saffron-shadow" aria-hidden />
        {xp}
      </span>
    </div>
  );
}

export function AppNav() {
  const pathname = usePathname();
  const s = useProgress();
  const [moreOpen, setMoreOpen] = useState(false);
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href || pathname === href.slice(0, -1) : pathname.startsWith(href.slice(0, -1)));
  const streak = currentStreak(s);
  const moreActive = [...SECONDARY, SETTINGS].some((l) => isActive(l.href));

  // Close the sheet whenever the route changes.
  useEffect(() => setMoreOpen(false), [pathname]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="app-nav fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 border-r-2 border-line bg-card px-4 py-6 lg:flex">
        <div className="px-3">
          <Logo />
        </div>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
          {PRIMARY.map((l) => (
            <SideLink key={l.href} item={l} on={isActive(l.href, l.exact)} />
          ))}
          <hr className="mx-3 my-2 border-t-2 border-line" />
          {SECONDARY.map((l) => (
            <SideLink key={l.href} item={l} on={isActive(l.href)} />
          ))}
          <div className="mt-auto pt-2">
            <SideLink item={SETTINGS} on={isActive(SETTINGS.href)} />
          </div>
        </nav>
      </aside>

      {/* Mobile top bar: brand and progress only. On desktop only the stat chips, top right of the content column. */}
      <header className="app-nav sticky top-0 z-30 border-b-2 border-line bg-card/95 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-1 px-4 lg:h-auto lg:justify-end lg:pt-5">
          <div className="mr-auto lg:hidden">
            <Logo />
          </div>
          <StatChips streak={streak} xp={s.xp} />
        </div>
      </header>

      {/* Mobile bottom tab bar: the core loop + More */}
      <nav className="app-nav fixed inset-x-0 bottom-0 z-30 border-t-2 border-line bg-card pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Main">
        <div className="mx-auto flex max-w-md justify-around gap-0.5 px-1 py-1.5">
          {PRIMARY.map((l) => (
            <TabLink key={l.href} href={l.href} label={l.label} icon={l.icon} on={isActive(l.href, l.exact) && !moreOpen} />
          ))}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            className={cx("flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[11px] font-extrabold", moreActive || moreOpen ? "text-sky-ink" : "text-muted")}
          >
            <TabIcon icon={Menu} on={moreActive || moreOpen} />
            More
          </button>
        </div>
      </nav>

      {moreOpen && <MoreSheet onClose={() => setMoreOpen(false)} isActive={isActive} />}
    </>
  );
}

function SideLink({ item: l, on }: { item: NavItem; on: boolean }) {
  return (
    <Link
      href={l.href}
      aria-current={on ? "page" : undefined}
      className={cx(
        "flex items-center gap-4 rounded-xl border-2 px-3 py-2 text-[15px] font-extrabold uppercase tracking-wider transition-colors",
        on ? "border-sky bg-sky-soft text-sky-ink" : "border-transparent text-muted hover:bg-paper",
      )}
    >
      <span className={cx("grid size-8 shrink-0 place-items-center", on ? "text-sky-ink" : l.tone ? TONE[l.tone].ink : "text-muted")}>
        <l.icon className="size-6" strokeWidth={2.5} />
      </span>
      {l.label}
    </Link>
  );
}

function TabIcon({ icon: Icon, on }: { icon: typeof House; on: boolean }) {
  return (
    <span className={cx("grid h-9 w-12 place-items-center rounded-xl border-2 transition-colors", on ? "border-sky bg-sky-soft" : "border-transparent")}>
      <Icon className="size-[26px]" strokeWidth={2.5} />
    </span>
  );
}

function TabLink({ href, label, icon, on }: { href: string; label: string; icon: typeof House; on: boolean }) {
  return (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={cx("flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[11px] font-extrabold", on ? "text-sky-ink" : "text-muted")}
    >
      <TabIcon icon={icon} on={on} />
      {label}
    </Link>
  );
}

/** Bottom sheet listing everything that isn't on the tab bar, each with what it's for. */
function MoreSheet({ onClose, isActive }: { onClose: () => void; isActive: (href: string) => boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label="More"
      className="app-nav fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none animate-slide-up rounded-t-3xl border-t-2 border-line bg-card p-0 pb-[env(safe-area-inset-bottom)] text-ink backdrop:bg-black/50 lg:hidden"
    >
      <div className="mx-auto max-w-md px-4 pb-4 pt-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">More</h2>
          <button type="button" className="btn-ghost btn-icon -mr-2" onClick={onClose} aria-label="Close" autoFocus>
            <X className="size-6" />
          </button>
        </div>
        <ul className="space-y-1">
          {[...SECONDARY, SETTINGS].map((l) => {
            const on = isActive(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={onClose}
                  aria-current={on ? "page" : undefined}
                  className={cx("flex min-h-14 items-center gap-3 rounded-2xl border-2 px-3 py-2", on ? "border-sky bg-sky-soft" : "border-transparent hover:bg-paper")}
                >
                  <span className={cx("grid size-10 shrink-0 place-items-center rounded-full", l.tone ? cx(TONE[l.tone].soft, TONE[l.tone].ink) : "bg-paper text-muted")}>
                    <l.icon className="size-5" strokeWidth={2.5} />
                  </span>
                  <span className="min-w-0">
                    <span className={cx("block font-extrabold", on && "text-sky-ink")}>{l.label}</span>
                    {l.hint && <span className="block text-sm font-semibold text-muted">{l.hint}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </dialog>
  );
}
