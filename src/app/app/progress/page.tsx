"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Flame, Star, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { dayKey } from "@/lib/gamification";
import { dayState, journey, monthGrid, soundTrends, xpByDay, xpByWeek, type Bar } from "@/lib/progress";
import { currentStreak, useHydrated, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa, PageHeader, ProgressBar, Segmented } from "@/components/ui";
import { BadgesCard, LevelCard } from "@/components/Achievements";

export default function ProgressPage() {
  const s = useProgress();
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const streak = currentStreak(s);
  const practisedDays = Object.keys(s.daily).filter((k) => dayState(s, k) !== "none").length;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Progress" subtitle="Everything you've done so far, kept in this browser." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile icon={<Flame className={cx("size-5", streak ? "fill-anar text-anar-ink" : "text-faint")} />} value={streak} label="day streak" />
        <Tile icon={<Flame className="size-5 text-muted" />} value={s.streak.record} label="best streak" />
        <Tile icon={<Zap className="size-5 fill-saffron text-saffron-shadow" />} value={s.xp} label="total XP" />
        <Tile icon={<Star className="size-5 fill-sky text-sky-ink" />} value={practisedDays} label="days practised" />
      </div>
      <LevelCard />
      <StreakCalendar />
      <XpChart />
      <SoundsOverTime />
      <Journey />
      <BadgesCard />
    </div>
  );
}

function Tile({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="card p-4">
      <span className="flex items-center gap-2 text-2xl font-extrabold">
        <span aria-hidden>{icon}</span>
        {value}
      </span>
      <span className="text-sm font-semibold text-muted">{label}</span>
    </div>
  );
}

function StreakCalendar() {
  const s = useProgress();
  const [offset, setOffset] = useState(0);
  const today = new Date();
  const month = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const weeks = monthGrid(month);
  const todayKey = dayKey(today);
  const days = weeks.flat().filter((d): d is Date => !!d);
  const practised = days.filter((d) => dayState(s, dayKey(d)) !== "none").length;
  const goals = days.filter((d) => dayState(s, dayKey(d)) === "goal").length;
  return (
    <section className="card p-5" aria-labelledby="cal-heading">
      <div className="flex items-center justify-between gap-2">
        <h2 id="cal-heading" className="text-xl font-extrabold">
          {month.toLocaleDateString("en", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex gap-1">
          <button type="button" className="btn-ghost btn-icon" onClick={() => setOffset(offset - 1)} aria-label="Previous month">
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" className="btn-ghost btn-icon" onClick={() => setOffset(offset + 1)} disabled={offset >= 0} aria-label="Next month">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
      <p className="text-sm font-semibold text-muted">
        {practised} {practised === 1 ? "day" : "days"} practised · daily goal met on {goals}
      </p>
      <table className="mt-4 w-full table-fixed border-separate border-spacing-1 text-center">
        <thead>
          <tr>
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <th key={i} scope="col" className="text-xs font-extrabold text-muted">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((w, i) => (
            <tr key={i}>
              {w.map((d, j) => {
                if (!d) return <td key={j} />;
                const key = dayKey(d);
                const st = dayState(s, key);
                return (
                  <td key={j}>
                    <span
                      className={cx(
                        "mx-auto grid aspect-square w-full max-w-11 place-items-center rounded-full text-sm font-bold",
                        st === "goal" ? "bg-anar text-on-accent" : st === "practised" ? "bg-anar-soft text-anar-ink" : "text-muted",
                        key === todayKey && "ring-[3px] ring-sky",
                      )}
                      title={st === "goal" ? "Daily goal met" : st === "practised" ? "Practised" : undefined}
                    >
                      {d.getDate()}
                      <span className="sr-only">{st === "goal" ? ", goal met" : st === "practised" ? ", practised" : ""}</span>
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-anar" /> Daily goal met
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-anar-soft" /> Practised
        </span>
      </p>
    </section>
  );
}

function XpChart() {
  const s = useProgress();
  const [range, setRange] = useState<"week" | "weeks">("week");
  const bars = range === "week" ? xpByDay(s, 7) : xpByWeek(s, 8);
  const total = bars.reduce((n, b) => n + b.value, 0);
  const max = Math.max(10, ...bars.map((b) => b.value));
  return (
    <section className="card p-5" aria-labelledby="xp-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="xp-heading" className="text-xl font-extrabold">
            XP {range === "week" ? "this week" : "by week"}
          </h2>
          <p className="text-sm font-semibold text-muted">
            {total} XP {range === "week" ? "in the last 7 days" : "in the last 8 weeks"}
          </p>
        </div>
        <Segmented
          label="Range"
          value={range}
          onChange={setRange}
          options={[
            { value: "week", label: "7 days" },
            { value: "weeks", label: "8 weeks" },
          ]}
        />
      </div>
      <div className="relative mt-6" aria-hidden>
        <span className="absolute -top-4 start-0 text-xs font-bold text-muted">{max} XP</span>
        <div className="flex h-44 items-end gap-1.5 border-b border-line pt-2 sm:gap-3">
          {bars.map((b) => (
            <BarMark key={b.key} bar={b} max={max} />
          ))}
        </div>
        <div className="mt-1.5 flex gap-1.5 sm:gap-3">
          {bars.map((b) => (
            <span key={b.key} className={cx("min-w-0 flex-1 truncate text-center text-xs font-bold", b.current ? "text-ink" : "text-muted")}>
              {b.label}
            </span>
          ))}
        </div>
      </div>
      <table className="sr-only">
        <caption>XP {range === "week" ? "per day" : "per week"}</caption>
        <tbody>
          {bars.map((b) => (
            <tr key={b.key}>
              <th scope="row">{b.label}</th>
              <td>{b.value} XP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function BarMark({ bar, max }: { bar: Bar; max: number }) {
  const [hover, setHover] = useState(false);
  const h = bar.value ? Math.max(4, (bar.value / max) * 100) : 0;
  return (
    <div
      className="group relative flex h-full min-w-0 flex-1 items-end"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={cx("w-full rounded-t-[4px]", bar.current ? "bg-saffron" : "bg-saffron/60", hover && "bg-saffron")} style={{ height: `${h}%` }} />
      {hover && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-card px-2 py-1 text-xs font-extrabold shadow">
          {bar.label}: {bar.value} XP
        </span>
      )}
    </div>
  );
}

function Sparkline({ points }: { points: { day: string; value: number }[] }) {
  const w = 120;
  const h = 36;
  if (points.length < 2) return <span className="text-xs font-semibold text-muted">More days needed</span>;
  const x = (i: number) => 4 + (i / (points.length - 1)) * (w - 8);
  const y = (v: number) => 4 + (1 - v / 100) * (h - 8);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-28 shrink-0" role="img" aria-label={`From ${points[0].value} to ${points[points.length - 1].value}`}>
      <line x1="4" x2={w - 4} y1={y(85)} y2={y(85)} className="stroke-line" strokeWidth="1" strokeDasharray="3 3" />
      <polyline points={points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ")} className="fill-none stroke-firuze" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={p.day} cx={x(i)} cy={y(p.value)} r={i === points.length - 1 ? 4 : 8} className={i === points.length - 1 ? "fill-firuze stroke-card" : "fill-transparent"} strokeWidth="2">
          <title>
            {p.day}: {p.value}
          </title>
        </circle>
      ))}
    </svg>
  );
}

function SoundsOverTime() {
  const s = useProgress();
  const trends = soundTrends(s);
  return (
    <section className="card p-5" aria-labelledby="sounds-heading">
      <h2 id="sounds-heading" className="text-xl font-extrabold">
        Your sounds over time
      </h2>
      <p className="text-sm font-semibold text-muted">Score per sound from your spoken takes. The dashed line is 85, where a sound counts as solid.</p>
      {trends.length === 0 ? (
        <p className="mt-4 font-semibold text-muted">Say some words out loud in Speak, Sounds or Scenes and they'll show up here.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {trends.map((t) => (
            <li key={t.sound.id} className="flex items-center gap-3 py-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-paper">
                <Fa className="text-lg font-bold">{t.sound.letters.split(" ")[0]}</Fa>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold">{t.sound.name}</span>
                <span className={cx("flex items-center gap-1 text-sm font-bold", t.change > 0 ? "text-pista-ink" : t.change < 0 ? "text-anar-ink" : "text-muted")}>
                  {t.change > 0 ? <TrendingUp className="size-4" /> : t.change < 0 ? <TrendingDown className="size-4" /> : null}
                  {t.change > 0 ? `+${t.change}` : t.change < 0 ? t.change : "No change yet"}
                </span>
              </span>
              <Sparkline points={t.points} />
              <span className="w-10 shrink-0 text-end text-lg font-extrabold">{t.now}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Journey() {
  const s = useProgress();
  const rows = journey(s);
  return (
    <section className="card p-5" aria-labelledby="journey-heading">
      <h2 id="journey-heading" className="text-xl font-extrabold">
        Your journey
      </h2>
      <ul className="mt-4 space-y-4">
        {rows.map((r) => (
          <li key={r.id}>
            <p className="flex justify-between gap-2 text-sm font-bold">
              <span>{r.label}</span>
              <span className="text-muted">
                {r.have}/{r.total}
              </span>
            </p>
            <ProgressBar value={r.total ? r.have / r.total : 0} tone="firuze" size="sm" className="mt-1.5" />
          </li>
        ))}
      </ul>
    </section>
  );
}
