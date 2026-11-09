"use client";
import Link from "next/link";
import { useState } from "react";
import { Bookmark, ChartColumn, ClipboardCheck, ChevronRight, CircleUserRound, Info, ShieldCheck } from "lucide-react";
import { levelFor } from "@/lib/gamification";
import { currentStreak, resetProgress, updateSettings, useProgress } from "@/lib/store";
import { CardControls } from "@/components/CardControls";
import { PageHeader, Segmented } from "@/components/ui";
import { RecognitionSetup, VoiceSetup } from "@/components/SpeechSetup";
import { ProgressTools } from "@/components/ProgressTools";
import { SyncCard } from "@/components/SyncCard";
import { FeedbackCard } from "@/components/FeedbackCard";

export default function SettingsPage() {
  const s = useProgress();
  const { settings } = s;
  const [confirming, setConfirming] = useState(false);
  const level = levelFor(s.xp);
  const initial = (settings.name.trim()[0] ?? "").toUpperCase();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="Profile" />

      <section className="card flex items-center gap-4 p-5" aria-label="You">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-firuze text-2xl font-bold text-on-accent" aria-hidden>
          {initial || <CircleUserRound className="size-9" strokeWidth={1.8} />}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xl font-extrabold">{settings.name || "Learner"}</p>
          <p className="text-sm text-muted">
            Level {level.number} · {level.current.name} · {s.xp} XP · {currentStreak(s)} day streak
          </p>
        </div>
      </section>

      <ul className="card divide-y divide-line overflow-hidden !p-0">
        {[
          { href: "/app/bookmarks/", title: "My cards", text: `${s.bookmarks.length} saved`, icon: Bookmark },
          { href: "/app/progress/", title: "Progress", text: "Calendar, charts and badges", icon: ChartColumn },
          { href: "/app/privacy/", title: "Privacy", text: "What's stored and where", icon: ShieldCheck },
          { href: "/app/review/", title: "Check the content", text: "For native speakers: review and record", icon: ClipboardCheck },
        ].map((x) => (
          <li key={x.href}>
            <Link href={x.href} className="flex min-h-[3.75rem] items-center gap-3 px-4 py-2.5 hover:bg-paper active:bg-paper">
              <x.icon className="size-5 shrink-0 text-muted" strokeWidth={2} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{x.title}</span>
                <span className="block text-sm text-muted">{x.text}</span>
              </span>
              <ChevronRight className="size-4 text-faint" />
            </Link>
          </li>
        ))}
      </ul>

      <section className="card space-y-4 p-5">
        <label className="block">
          <span className="font-bold">Your name</span>
          <input
            className="input mt-1.5 !text-base"
            value={settings.name}
            maxLength={30}
            onChange={(e) => updateSettings({ name: e.target.value })}
            placeholder="So we can greet you"
          />
        </label>
        <p className="flex gap-2.5 rounded-2xl bg-sky-soft p-3 text-sm font-semibold text-sky-ink">
          <Info className="size-5 shrink-0" strokeWidth={2.5} />
          <span>
            <strong className="font-extrabold">No sign-up needed.</strong> Your progress is saved in this browser. Use “Save backup” below to keep it safe or
            move it to another device.
          </span>
        </p>
      </section>

      <section className="card p-5">
        <h2 className="eyebrow text-muted">Appearance</h2>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <span className="font-bold">Theme</span>
          <Segmented
            label="Theme"
            value={settings.theme}
            onChange={(theme) => updateSettings({ theme })}
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
              { value: "system", label: "Auto" },
            ]}
          />
        </div>
      </section>

      <section className="card p-5">
        <h2 className="eyebrow text-muted">Learning</h2>
        <div className="divide-y divide-line">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <span className="font-bold">Why you&apos;re learning</span>
            <Segmented
              label="Why you're learning"
              value={settings.goal ?? "curious"}
              onChange={(goal) => updateSettings({ goal, onboarded: true })}
              options={[
                { value: "travel", label: "Travel" },
                { value: "family", label: "Family" },
                { value: "heritage", label: "Heritage" },
                { value: "curious", label: "Curious" },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <span className="font-bold">I can read Persian script</span>
            <Segmented
              label="Reading Persian"
              value={settings.reads ?? "some"}
              onChange={(reads) => updateSettings({ reads, onboarded: true })}
              options={[
                { value: "no", label: "Not yet" },
                { value: "some", label: "A little" },
                { value: "yes", label: "Yes" },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <span className="font-bold">Daily goal</span>
            <Segmented
              label="Daily goal"
              value={String(settings.dailyGoal)}
              onChange={(v) => updateSettings({ dailyGoal: Number(v) })}
              options={[
                { value: "5", label: "5 words" },
                { value: "10", label: "10 words" },
                { value: "20", label: "20 words" },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <span className="font-bold">Cards</span>
            <CardControls />
          </div>
          <label className="flex cursor-pointer items-center justify-between gap-3 py-4 font-bold">
            On-screen Persian keyboard when typing in Farsi
            <input
              type="checkbox"
              className="size-5 shrink-0 cursor-pointer accent-firuze"
              checked={settings.showKeyboard}
              onChange={(e) => updateSettings({ showKeyboard: e.target.checked })}
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-3 pt-4 font-bold">
            Show “Getting started” checklist
            <input
              type="checkbox"
              className="size-5 shrink-0 cursor-pointer accent-firuze"
              checked={!settings.checklistHidden}
              onChange={(e) => updateSettings({ checklistHidden: !e.target.checked })}
            />
          </label>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="eyebrow text-muted">Voice &amp; speech</h2>
        <div className="divide-y divide-line">
          <div className="py-4">
            <VoiceSetup />
          </div>
          <div className="pt-4">
            <RecognitionSetup />
          </div>
        </div>
      </section>

      <SyncCard />

      <section className="card p-5">
        <h2 className="eyebrow mb-4 text-muted">Your progress</h2>
        <ProgressTools />
        <div className="mt-4 border-t border-line pt-4">
          <p className="font-bold">Placement test</p>
          <p className="mt-1 text-sm font-semibold text-muted">Find your level (A1 to B2) so Today skips what you already know.</p>
          <Link href="/app/placement/" className="btn-secondary btn-sm mt-3">
            Take the test
          </Link>
        </div>
      </section>

      <FeedbackCard />

      <section className="card p-5">
        <h2 className="eyebrow text-anar-ink">Reset progress</h2>
        <p className="mt-2 text-sm font-semibold text-muted">Removes XP, streaks, lessons, reviews, bookmarks and badges from this browser. Settings are kept.</p>
        {confirming ? (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                resetProgress();
                setConfirming(false);
              }}
            >
              Yes, reset everything
            </button>
            <button type="button" className="btn-secondary" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className="btn-secondary mt-4" onClick={() => setConfirming(true)}>
            Reset progress…
          </button>
        )}
      </section>
      <section className="card p-5">
        <h2 className="eyebrow text-muted">Made with open sources</h2>
        <p className="mt-2 text-sm font-semibold text-muted">
          Poems: Ganjoor (ganjoor-data). Dictionary: EnglishToPersianDictionaries by VahidN (Apache-2.0). Spelling: Persian-Words-Database and
          Persian-Spell-Corrector by shahind, after Peter Norvig (MIT). Voice: Piper (MIT). Speech recognition: Whisper via transformers.js (Apache-2.0).
          Real-video pronunciation: YouGlish.
        </p>
      </section>

      <p className="pb-4 text-center text-xs font-semibold text-muted">
        Version {process.env.NEXT_PUBLIC_BUILD_COMMIT} · built{" "}
        {(process.env.NEXT_PUBLIC_BUILD_TIME ?? "").slice(0, 16).replace("T", " ")} UTC
      </p>
    </div>
  );
}
