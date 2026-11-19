"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LayoutGrid, AudioLines, Bookmark, BookHeart, BookOpen, BookOpenText, ChartColumn, ChevronRight, CircleUserRound, Clapperboard, Compass, Flame, GraduationCap, Headphones, House, Layers, MessagesSquare, Mic, PenLine, Puzzle, Repeat, Route, Star } from "lucide-react";
import { hasBackend } from "@/lib/backend";
import { buildDeck } from "@/lib/flashcards";
import { currentStreak, useProgress } from "@/lib/store";
import { cx, IS_DEV_SITE } from "@/lib/util";
import { TONE, type Tone } from "@/components/ui";

type NavItem = { href: string; label: string; icon: typeof House; tone?: Tone; exact?: boolean; hint?: string; parent?: number; featured?: boolean };

/** The main pages. Home, Exams and Progress are tabs (phone) and the sidebar's first group; Journey leads the Learn group; Profile is the top-right avatar. */
const PRIMARY: NavItem[] = [
  { href: "/app/", label: "Home", icon: House, tone: "firuze", exact: true },
  { href: "/app/path/", label: "Journey", icon: Route, tone: "anar", hint: "The whole course, step by step", featured: true },
  { href: "/app/exams/", label: "Exams", icon: GraduationCap, tone: "plum" },
  { href: "/app/progress/", label: "Progress", icon: ChartColumn, tone: "sky" },
  { href: "/app/settings/", label: "Profile", icon: CircleUserRound, tone: "pista" },
];
const HOME = 0;
const PATH = 1;
const EXAMS = 2;
const PROGRESS = 3;
const PROFILE = 4;

/** Every other page, grouped under the tab it belongs to (shown in the sidebar on desktop). */
const SECONDARY: NavItem[] = [
  { href: "/app/words/", label: "Words", icon: Layers, tone: "sky", parent: HOME },
  { href: "/app/speak/", label: "Speak", icon: Mic, tone: "plum", parent: HOME },
  { href: "/app/scenes/", label: "Scenes", icon: Clapperboard, tone: "saffron", parent: HOME },
  { href: "/app/listen/", label: "Hands-free", icon: Headphones, tone: "pista", parent: HOME },
  { href: "/app/practice/", label: "Daily Practice", icon: Repeat, tone: "firuze", parent: HOME },
  ...(hasBackend ? [{ href: "/app/tutor/", label: "AI tutor", icon: MessagesSquare, tone: "pista" as const, parent: HOME }] : []),
  { href: "/app/sounds/", label: "Sounds", icon: AudioLines, tone: "sky", parent: PATH },
  { href: "/app/lessons/", label: "Lessons", icon: BookOpen, tone: "saffron", parent: PATH },
  { href: "/app/missions/", label: "Missions", icon: Compass, tone: "firuze", parent: PATH },
  { href: "/app/grammar/", label: "Grammar", icon: Puzzle, tone: "plum", parent: PATH },
  { href: "/app/reading/", label: "Reading", icon: BookOpenText, tone: "sky", parent: PATH },
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

/** Brand mark + name. `compact` shows the mark only; `bar` is the phone top-bar size (name hidden on very narrow screens). */
export function Logo({ compact, bar }: { compact?: boolean; bar?: boolean }) {
  return (
    <Link
      href="/"
      className={cx("flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl font-extrabold tracking-tight text-firuze-ink", bar ? "text-xl" : "text-2xl")}
      aria-label="Farsi Pen home"
    >
      <LogoMark />
      {!compact && <span className={cx(bar && "max-[359px]:hidden")}>Farsi Pen</span>}
      {IS_DEV_SITE && <span className="chip bg-saffron-soft text-saffron-ink">DEV</span>}
    </Link>
  );
}

function StatChips({ streak, xp }: { streak: number; xp: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="flex items-center gap-1 rounded-xl px-1.5 py-1.5 text-base font-extrabold text-anar-ink lg:px-2" title="Day streak" aria-label={`${streak} day streak`}>
        <Flame className={cx("size-5", streak > 0 ? "fill-anar text-anar-ink" : "fill-line text-faint")} aria-hidden />
        <span className={streak > 0 ? undefined : "text-muted"}>{streak}</span>
      </span>
      <span className="flex items-center gap-1 rounded-xl px-1.5 py-1.5 text-base font-extrabold text-saffron-ink lg:px-2" title="Total XP" aria-label={`${xp} XP`}>
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
  const [sheet, setSheet] = useState<"sections" | "profile" | null>(null);

  // Close any sheet when the route changes (a link inside it was followed).
  useEffect(() => setSheet(null), [pathname]);

  // The phone tab to highlight: Sections while its sheet is open; else the page's own tab; Sections for any
  // page listed in the sheet; otherwise the tab its section lives under (e.g. SAMFA → Exams).
  const sectionsTab = TABS.indexOf("sections");
  const primaryIndex = PRIMARY.findIndex((l) => isActive(l.href, l.exact));
  const ownerIndex = primaryIndex >= 0 ? primaryIndex : (SECONDARY.find((l) => isActive(l.href))?.parent ?? -1);
  const directTab = TABS.findIndex((t) => t !== "sections" && isActive(t.href, t.exact));
  const ownerTab = TABS.findIndex((t) => t !== "sections" && t.href === PRIMARY[ownerIndex]?.href);
  const inSheet = MENU_GROUPS.some((g) => g.items.some((l) => isActive(l.href, l.exact)));
  const activeTab = sheet === "sections" ? sectionsTab : directTab >= 0 ? directTab : inSheet ? sectionsTab : ownerTab;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="app-nav fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 border-r border-line bg-card px-3 py-6 lg:flex">
        <div className="px-3">
          <Logo />
        </div>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
          {/* Same hierarchy as phones: the tabs (Sections is the groups below), then the Sections groups. Profile is top right. */}
          {TABS.filter((t): t is NavItem => t !== "sections").map((l) => (
            <SideLink key={l.href} item={l} on={isActive(l.href, l.exact)} />
          ))}
          {MENU_GROUPS.map((g) => (
            <Fragment key={g.title}>
              <p className="mx-3 mb-1 mt-4 text-xs font-semibold text-muted">{g.title}</p>
              {g.items.map((l) => (
                <SideLink key={l.href} item={l} on={isActive(l.href)} />
              ))}
            </Fragment>
          ))}
        </nav>
      </aside>

      {/* Mobile top bar: brand, progress and Profile. On desktop the stat chips and Profile, top right of the content column. */}
      <header className="app-nav max-lg:material-canvas sticky top-0 z-30 border-b border-line lg:static lg:border-0">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-1 px-4 lg:h-auto lg:justify-end lg:pt-5">
          <div className="mr-auto lg:hidden">
            <Logo bar />
          </div>
          <StatChips streak={streak} xp={s.xp} />
          <button
            type="button"
            className="btn-ghost btn-icon -mr-2 shrink-0"
            onClick={() => setSheet("profile")}
            aria-label="Profile"
            aria-haspopup="dialog"
            aria-expanded={sheet === "profile"}
          >
            <Avatar name={s.settings.name} />
          </button>
        </div>
      </header>

      {/* Mobile tab bar: a floating glass capsule; a glass pill slides to the current tab. Sections sits in the centre. */}
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
          {TABS.map((t, i) =>
            t === "sections" ? (
              <button
                key="sections"
                type="button"
                className={cx(TAB, activeTab === i ? "text-sky-ink" : "text-ink/70")}
                onClick={() => setSheet("sections")}
                aria-haspopup="dialog"
                aria-expanded={sheet === "sections"}
              >
                <TabIcon icon={LayoutGrid} on={activeTab === i} />
                Sections
              </button>
            ) : (
              <TabLink key={t.href} href={t.href} label={t.label} icon={t.icon} on={activeTab === i} />
            ),
          )}
        </div>
      </nav>

      {sheet === "sections" && (
        <Sheet title="Sections" onClose={() => setSheet(null)}>
          <SectionsList isActive={isActive} />
        </Sheet>
      )}
      {sheet === "profile" && (
        <Sheet title="Profile" grouped onClose={() => setSheet(null)}>
          <div className="space-y-6">
            <ProfileContent />
          </div>
        </Sheet>
      )}
    </>
  );
}

const MY_CARDS = SECONDARY.find((l) => l.href === "/app/bookmarks/")!;

/** Phone tab bar: Home, My cards, Sections (opens the sheet), Exams, Progress. Profile lives in the top bar; Journey is in the sheet. */
const TABS: (NavItem | "sections")[] = [PRIMARY[HOME], MY_CARDS, "sections", PRIMARY[EXAMS], PRIMARY[PROGRESS]];

/** Loaded only when the Profile sheet first opens. */
const ProfileContent = dynamic(() => import("@/components/ProfileContent"), {
  ssr: false,
  loading: () => <p className="py-10 text-center font-semibold text-muted">Loading…</p>,
});

/** The learner's initial on a firuze disc, or a person icon before they've set a name. */
function Avatar({ name }: { name: string }) {
  const initial = (name.trim()[0] ?? "").toUpperCase();
  return (
    <span className="grid size-8 place-items-center rounded-full bg-firuze text-base font-bold text-on-accent" aria-hidden>
      {initial || <CircleUserRound className="size-5" strokeWidth={2} />}
    </span>
  );
}

/**
 * Groups in the Sections sheet (and the desktop sidebar), by what the learner wants to do:
 * learn something new, practise daily, or go on adventures with real Persian. Listed in display order.
 * My cards, SAMFA and Placement are reached from their tabs instead.
 */
const MENU_GROUPS: { title: string; items: NavItem[] }[] = [
  { title: "Learn", hrefs: ["/app/path/", "/app/lessons/", "/app/grammar/", "/app/alphabet/", "/app/sounds/"] },
  { title: "Practise", hrefs: ["/app/practice/", "/app/words/", "/app/speak/", "/app/listen/"] },
  { title: "Adventures", hrefs: ["/app/missions/", "/app/scenes/", "/app/reading/", "/app/poetry/", "/app/tutor/"] },
].map((g) => ({ title: g.title, items: g.hrefs.flatMap((h) => [...PRIMARY, ...SECONDARY].filter((l) => l.href === h)) }));

function SectionsList({ isActive }: { isActive: (href: string) => boolean }) {
  const s = useProgress();
  const due = buildDeck("today", s).ids.length;
  const badges: Record<string, number | undefined> = { "/app/words/": due || undefined };
  return MENU_GROUPS.map((g, gi) => (
    <section key={g.title} aria-labelledby={`menu-${g.title}`}>
      <h3 id={`menu-${g.title}`} className={cx("eyebrow mb-2 text-muted", gi > 0 && "mt-5")}>
        {g.title}
      </h3>
      <ul className="grid grid-cols-2 gap-2">
        {g.items.map((l) => {
          const on = isActive(l.href);
          if (l.featured)
            return (
              <li key={l.href} className="col-span-2">
                <Link
                  href={l.href}
                  aria-current={on ? "page" : undefined}
                  data-state={on ? "current" : undefined}
                  className="tile flex min-h-16 items-center gap-3 px-3 py-2.5"
                >
                  <span className={cx("grid size-10 shrink-0 place-items-center rounded-xl", l.tone ? `${TONE[l.tone].soft} ${TONE[l.tone].ink}` : "bg-paper text-muted")}>
                    <l.icon className="size-6" strokeWidth={2.2} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[17px] font-extrabold">{l.label}</span>
                    {l.hint && <span className="block truncate text-[13px] text-muted">{l.hint}</span>}
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-faint" aria-hidden />
                </Link>
              </li>
            );
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={on ? "page" : undefined}
                data-state={on ? "current" : undefined}
                className="tile flex min-h-12 items-center gap-2.5 px-3 py-2 text-[15px] font-semibold"
              >
                <l.icon className={cx("size-[22px] shrink-0", l.tone ? TONE[l.tone].ink : "text-muted")} strokeWidth={2} aria-hidden />
                <span className="min-w-0 flex-1 truncate">{l.label}</span>
                {badges[l.href] && (
                  <span className={cx("chip shrink-0", l.tone ? `${TONE[l.tone].soft} ${TONE[l.tone].ink}` : "bg-paper")} aria-label={`${badges[l.href]} due today`}>
                    {badges[l.href]}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  ));
}

/**
 * Bottom sheet on phones, centred dialog on wider screens (modal): grabber, a title bar that stays put while the
 * content scrolls, and a close button. Escape, the backdrop and any link inside close it;
 * focus returns to whatever opened it. `grouped` uses the canvas colour so cards inside read as cards.
 */
function Sheet({ title, grouped, onClose, children }: { title: string; grouped?: boolean; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  useEffect(() => {
    const d = ref.current;
    opener.current = document.activeElement;
    if (d && !d.open) d.showModal();
  }, []);
  const bg = grouped ? "bg-canvas" : "bg-card";

  return createPortal(
    <dialog
      ref={ref}
      onClose={() => {
        onClose();
        if (opener.current instanceof HTMLElement) opener.current.focus();
      }}
      onClick={(e) => {
        const t = e.target as Element;
        if (t === ref.current || t.closest("a[href]")) ref.current?.close();
      }}
      className={cx(
        "mx-auto mb-0 mt-auto max-h-[90dvh] w-full max-w-lg animate-slide-up overflow-y-auto overscroll-contain rounded-t-[1.75rem] border border-b-0 border-line-strong p-0 text-ink shadow-[0_-8px_40px_rgb(0_0_0/0.18)] backdrop:bg-black/40",
        // Wider screens: a centred dialog instead of a bottom sheet.
        "lg:my-auto lg:max-h-[85dvh] lg:w-[min(36rem,calc(100vw-4rem))] lg:max-w-none lg:animate-pop lg:rounded-[1.75rem] lg:border-b",
        bg,
      )}
      aria-labelledby="sheet-heading"
    >
      <div className={cx("sticky top-0 z-10 px-4 pb-3 pt-2 lg:pt-4", bg)}>
        <span aria-hidden className="mx-auto block h-1.5 w-9 rounded-full bg-line-strong lg:hidden" />
        <div className="mt-2 flex items-center justify-between">
          <h2 id="sheet-heading" className="text-xl font-extrabold">
            {title}
          </h2>
          <button type="button" className="btn-ghost btn-icon -mr-2" onClick={() => ref.current?.close()} aria-label="Close">
            <X className="size-6" aria-hidden />
          </button>
        </div>
      </div>
      <div className="px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">{children}</div>
    </dialog>,
    document.body,
  );
}

function SideLink({ item: l, on }: { item: NavItem; on: boolean }) {
  return (
    <Link
      href={l.href}
      aria-current={on ? "page" : undefined}
      className={cx(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] transition-colors active:scale-[0.98]",
        l.featured ? "font-extrabold" : "font-semibold",
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

