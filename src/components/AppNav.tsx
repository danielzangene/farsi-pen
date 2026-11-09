"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AudioLines, Bookmark, BookHeart, BookOpen, BookOpenText, ChartColumn, CircleUserRound, Clapperboard, Compass, Flame, GraduationCap, Headphones, House, Layers, Mic, PenLine, Puzzle, Repeat, Route, Star } from "lucide-react";
import { currentStreak, useProgress } from "@/lib/store";
import { cx, IS_DEV_SITE } from "@/lib/util";
import { TONE, type Tone } from "@/components/ui";

type NavItem = { href: string; label: string; icon: typeof House; tone?: Tone; exact?: boolean; hint?: string; parent?: number };

/** The five tabs (phone tab bar; first group in the sidebar). */
const PRIMARY: NavItem[] = [
  { href: "/app/", label: "Home", icon: House, tone: "firuze", exact: true },
  { href: "/app/path/", label: "Path", icon: Route, tone: "saffron" },
  { href: "/app/exams/", label: "Exams", icon: GraduationCap, tone: "plum" },
  { href: "/app/progress/", label: "Progress", icon: ChartColumn, tone: "sky" },
  { href: "/app/settings/", label: "Profile", icon: CircleUserRound, tone: "pista" },
];
const HOME = 0;
const PATH = 1;
const EXAMS = 2;
const PROFILE = 4;

/** Every other page, grouped under the tab it belongs to (shown in the sidebar on desktop). */
const SECONDARY: NavItem[] = [
  { href: "/app/words/", label: "Words", icon: Layers, tone: "sky", parent: HOME },
  { href: "/app/speak/", label: "Speak", icon: Mic, tone: "anar", parent: HOME },
  { href: "/app/scenes/", label: "Scenes", icon: Clapperboard, tone: "sky", parent: HOME },
  { href: "/app/listen/", label: "Hands-free", icon: Headphones, tone: "firuze", parent: HOME },
  { href: "/app/practice/", label: "Daily Practice", icon: Repeat, tone: "sky", parent: HOME },
  { href: "/app/sounds/", label: "Sounds", icon: AudioLines, tone: "saffron", parent: PATH },
  { href: "/app/lessons/", label: "Lessons", icon: BookOpen, tone: "saffron", parent: PATH },
  { href: "/app/missions/", label: "Missions", icon: Compass, tone: "firuze", parent: PATH },
  { href: "/app/grammar/", label: "Grammar", icon: Puzzle, tone: "plum", parent: PATH },
  { href: "/app/reading/", label: "Reading", icon: BookOpenText, tone: "plum", parent: PATH },
  { href: "/app/alphabet/", label: "Alphabet", icon: PenLine, tone: "pista", parent: PATH },
  { href: "/app/poetry/", label: "Poetry", icon: BookHeart, tone: "plum", parent: PATH },
  { href: "/app/samfa/", label: "SAMFA", icon: GraduationCap, tone: "plum", parent: EXAMS },
  { href: "/app/placement/", label: "Placement", icon: GraduationCap, tone: "plum", parent: EXAMS },
  { href: "/app/bookmarks/", label: "My cards", icon: Bookmark, tone: "saffron", parent: PROFILE },
];

/**
 * The "FA" monogram on a teal tile. Same paths as scripts/make-icons.mjs,
 * which renders the favicon, app icons and share image.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cx("grid size-9 shrink-0 place-items-center rounded-xl bg-firuze text-on-accent", className)}>
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
        <span className={streak > 0 ? undefined : "text-muted"}>{streak}</span>
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
  // The tab to highlight: the page's own tab, or the tab its section lives under.
  const primaryIndex = PRIMARY.findIndex((l) => isActive(l.href, l.exact));
  const activeTab = primaryIndex >= 0 ? primaryIndex : (SECONDARY.find((l) => isActive(l.href))?.parent ?? -1);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="app-nav fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 border-r border-line bg-card px-3 py-6 lg:flex">
        <div className="px-3">
          <Logo />
        </div>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
          {PRIMARY.map((l) => (
            <SideLink key={l.href} item={l} on={isActive(l.href, l.exact)} />
          ))}
          <p className="mx-3 mb-1 mt-4 text-xs font-semibold text-muted">Practice</p>
          {SECONDARY.filter((l) => l.parent === HOME).map((l) => (
            <SideLink key={l.href} item={l} on={isActive(l.href)} />
          ))}
          <p className="mx-3 mb-1 mt-4 text-xs font-semibold text-muted">Course</p>
          {SECONDARY.filter((l) => l.parent === PATH || l.parent === EXAMS).filter((l) => l.href !== "/app/placement/").map((l) => (
            <SideLink key={l.href} item={l} on={isActive(l.href)} />
          ))}
        </nav>
      </aside>

      {/* Mobile top bar: brand and progress only. On desktop only the stat chips, top right of the content column. */}
      <header className="app-nav max-lg:material-canvas sticky top-0 z-30 border-b border-line lg:static lg:border-0">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-1 px-4 lg:h-auto lg:justify-end lg:pt-5">
          <div className="mr-auto lg:hidden">
            <Logo />
          </div>
          <StatChips streak={streak} xp={s.xp} />
        </div>
      </header>

      {/* Mobile tab bar: a floating glass capsule; a glass pill slides to the current tab. */}
      <nav
        className="app-nav glass fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 mx-auto max-w-md rounded-[1.75rem] p-1 lg:hidden"
        aria-label="Main"
      >
        <div className="relative flex">
          {activeTab >= 0 && (
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-1/5 p-0 transition-transform duration-[420ms] ease-[var(--ease-spring)] motion-reduce:transition-none"
              style={{ transform: `translateX(${activeTab * 100}%)` }}
            >
              <span className="block size-full rounded-[1.5rem] bg-[var(--glass-pill)] shadow-[inset_0_1px_0_var(--glass-highlight)]" />
            </span>
          )}
          {PRIMARY.map((l, i) => (
            <TabLink key={l.href} href={l.href} label={l.label} icon={l.icon} on={activeTab === i} />
          ))}
        </div>
      </nav>

    </>
  );
}

function SideLink({ item: l, on }: { item: NavItem; on: boolean }) {
  return (
    <Link
      href={l.href}
      aria-current={on ? "page" : undefined}
      className={cx(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-semibold transition-colors active:scale-[0.98]",
        on ? "bg-sky-soft text-sky-ink" : "text-ink hover:bg-paper",
      )}
    >
      <span className={cx("grid size-8 shrink-0 place-items-center", on ? "text-sky-ink" : l.tone ? TONE[l.tone].ink : "text-muted")}>
        <l.icon className="size-[22px]" strokeWidth={2} />
      </span>
      {l.label}
    </Link>
  );
}

const TAB = "relative z-[1] flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-[1.5rem] pb-1.5 pt-2 text-[10px] font-semibold transition-[color,transform] duration-200 active:scale-95";

function TabIcon({ icon: Icon, on }: { icon: typeof House; on: boolean }) {
  return (
    <span className="grid h-6 place-items-center">
      <Icon className="size-6" strokeWidth={on ? 2.3 : 1.9} />
    </span>
  );
}

function TabLink({ href, label, icon, on }: { href: string; label: string; icon: typeof House; on: boolean }) {
  return (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={cx(TAB, on ? "text-sky-ink" : "text-ink/70")}
    >
      <TabIcon icon={icon} on={on} />
      {label}
    </Link>
  );
}

