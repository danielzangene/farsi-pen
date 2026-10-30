"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, BookOpen, Flame, House, Library, PenLine, Puzzle, Repeat, Settings, Star } from "lucide-react";
import { currentStreak, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";

const MAIN = [
  { href: "/app/", label: "Home", icon: House, exact: true },
  { href: "/app/lessons/", label: "Lessons", icon: BookOpen },
  { href: "/app/practice/", label: "Practice", icon: Repeat },
  { href: "/app/alphabet/", label: "Alphabet", icon: PenLine },
  { href: "/app/grammar/", label: "Grammar", icon: Puzzle },
];

const EXTRA = [
  { href: "/app/words/", label: "Word Library", icon: Library },
  { href: "/app/bookmarks/", label: "Bookmarks", icon: Bookmark },
  { href: "/app/settings/", label: "Settings", icon: Settings },
];

export function Logo({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap font-display text-lg font-semibold tracking-tight" aria-label="Farsi Pen home">
      <span className="grid size-8 place-items-center rounded-lg bg-firuze text-white">
        <PenLine className="size-4" />
      </span>
      <span className={compact ? "hidden sm:inline" : undefined}>Farsi Pen</span>
    </Link>
  );
}

export function AppNav() {
  const pathname = usePathname();
  const s = useProgress();
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href || pathname === href.slice(0, -1) : pathname.startsWith(href.slice(0, -1)));

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
          <Logo compact />
          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
            {MAIN.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cx("rounded-lg px-3 py-1.5 text-sm font-medium transition", isActive(l.href, l.exact) ? "bg-firuze-soft text-firuze" : "text-muted hover:text-ink")}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <span className="chip mr-1 bg-anar-soft text-anar" title="Day streak">
              <Flame className="size-3.5" /> {currentStreak(s)}
            </span>
            <span className="chip mr-2 bg-saffron-soft text-saffron" title="Total XP">
              <Star className="size-3.5" /> {s.xp}
            </span>
            {EXTRA.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                title={l.label}
                aria-label={l.label}
                className={cx("rounded-lg p-2 transition", isActive(l.href) ? "bg-firuze-soft text-firuze" : "text-muted hover:text-ink")}
              >
                <l.icon className="size-5" />
              </Link>
            ))}
          </div>
        </div>
      </header>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Main"
      >
        <div className="mx-auto flex max-w-md justify-around">
          {MAIN.map((l) => {
            const on = isActive(l.href, l.exact);
            return (
              <Link key={l.href} href={l.href} className={cx("flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium", on ? "text-firuze" : "text-muted")}>
                <l.icon className="size-5" />
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
