"use client";
import { useState } from "react";
import { Info } from "lucide-react";
import { resetProgress, updateSettings, useProgress } from "@/lib/store";
import { CardControls } from "@/components/CardControls";
import { PageHeader, Segmented } from "@/components/ui";

export default function SettingsPage() {
  const { settings } = useProgress();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="Settings" />

      <section className="card space-y-4 p-5">
        <h2 className="eyebrow text-muted">Profile</h2>
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
            <strong className="font-extrabold">Guest mode.</strong> Your progress is saved in this browser only. Accounts with sync across devices are coming
            next.
          </span>
        </p>
      </section>

      <section className="card p-5">
        <h2 className="eyebrow text-muted">Learning</h2>
        <div className="divide-y-2 divide-line">
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
    </div>
  );
}
