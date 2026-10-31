"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, BookOpen, Flame, House, Library, PenLine, Puzzle, Repeat, Settings, Star } from "lucide-react";
import { currentStreak, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { TONE, type Tone } from "@/components/ui";

type NavItem = { href: string; label: string; icon: typeof House; tone?: Tone; exact?: boolean };

const MAIN: NavItem[] = [
  { href: "/app/", label: "Home", icon: House, tone: "firuze", exact: true },
  { href: "/app/lessons/", label: "Lessons", icon: BookOpen, tone: "saffron" },
  { href: "/app/practice/", label: "Practice", icon: Repeat, tone: "sky" },
  { href: "/app/alphabet/", label: "Alphabet", icon: PenLine, tone: "pista" },
  { href: "/app/grammar/", label: "Grammar", icon: Puzzle, tone: "plum" },
];

const EXTRA: NavItem[] = [
  { href: "/app/words/", label: "Words", icon: Library, tone: "firuze" },
  { href: "/app/bookmarks/", label: "Bookmarks", icon: Bookmark, tone: "saffron" },
  { href: "/app/settings/", label: "Settings", icon: Settings },
];

/** Brand mark + name. `compact` shows the mark only. */
export function Logo({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl text-2xl font-extrabold tracking-tight text-firuze-ink" aria-label="Farsi Pen home">
      <span className="grid size-9 place-items-center rounded-xl bg-firuze text-on-accent shadow-[0_3px_0_var(--color-firuze-shadow)]">
        {/* "FA" monogram — same paths as public/icon.svg. */}
        <svg viewBox="0 0 64 64" className="size-7" fill="none" stroke="currentColor" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14 46V18h14M14 31h11M34 46l8-28 8 28M37 37h10" />
        </svg>
      </span>
      {!compact && <span>Farsi Pen</span>}
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
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href || pathname === href.slice(0, -1) : pathname.startsWith(href.slice(0, -1)));
  const streak = currentStreak(s);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="app-nav fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 border-r-2 border-line bg-card px-4 py-6 lg:flex">
        <div className="px-3">
          <Logo />
        </div>
        <nav aria-label="Main" className="flex flex-col gap-1.5 overflow-y-auto">
          {[...MAIN, ...EXTRA].map((l) => {
            const on = isActive(l.href, l.exact);
            return (
              <Link
                key={l.href}
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
          })}
        </nav>
      </aside>

      {/* Mobile top bar; on desktop only the stat chips, top right of the content column */}
      <header className="app-nav sticky top-0 z-30 border-b-2 border-line bg-card/95 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-1 px-4 lg:h-auto lg:justify-end lg:pt-5">
          <div className="mr-auto lg:hidden">
            <Logo compact />
          </div>
          <StatChips streak={streak} xp={s.xp} />
          <nav aria-label="More" className="flex items-center lg:hidden">
            {EXTRA.map((l) => {
              const on = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  title={l.label}
                  aria-label={l.label === "Words" ? "Word library" : l.label}
                  aria-current={on ? "page" : undefined}
                  className={cx("btn-ghost btn-icon", on && "!bg-sky-soft !text-sky-ink")}
                >
                  <l.icon className="size-[22px]" strokeWidth={2.5} />
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="app-nav fixed inset-x-0 bottom-0 z-30 border-t-2 border-line bg-card pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Main">
        <div className="mx-auto flex max-w-md justify-around px-2 py-1.5">
          {MAIN.map((l) => {
            const on = isActive(l.href, l.exact);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={on ? "page" : undefined}
                className={cx("flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[10px] font-extrabold uppercase tracking-wide", on ? "text-sky-ink" : "text-muted")}
              >
                <span className={cx("grid h-9 w-12 place-items-center rounded-xl border-2 transition-colors", on ? "border-sky bg-sky-soft" : "border-transparent")}>
                  <l.icon className="size-[26px]" strokeWidth={2.5} />
                </span>
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
