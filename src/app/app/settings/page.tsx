"use client";
import { useState } from "react";
import { resetProgress, updateSettings, useProgress } from "@/lib/store";
import { CardControls } from "@/components/CardControls";
import { PageHeader, Segmented } from "@/components/ui";

export default function SettingsPage() {
  const { settings } = useProgress();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <PageHeader title="Settings" />

      <section className="card space-y-4 p-5">
        <h2 className="font-semibold">Profile</h2>
        <label className="block">
          <span className="text-sm text-muted">Your name</span>
          <input
            className="input mt-1 !text-base"
            value={settings.name}
            maxLength={30}
            onChange={(e) => updateSettings({ name: e.target.value })}
            placeholder="So we can greet you"
          />
        </label>
        <p className="rounded-xl bg-saffron-soft p-3 text-sm">
          <strong>Guest mode.</strong> Your progress is saved in this browser only. Accounts with sync across devices are coming next.
        </p>
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="font-semibold">Learning</h2>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm">Daily goal</span>
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm">Cards</span>
          <CardControls />
        </div>
        <label className="flex items-center justify-between gap-3 text-sm">
          On-screen Persian keyboard when typing in Farsi
          <input
            type="checkbox"
            className="size-5 accent-firuze"
            checked={settings.showKeyboard}
            onChange={(e) => updateSettings({ showKeyboard: e.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          Show “Getting started” checklist
          <input
            type="checkbox"
            className="size-5 accent-firuze"
            checked={!settings.checklistHidden}
            onChange={(e) => updateSettings({ checklistHidden: !e.target.checked })}
          />
        </label>
      </section>

      <section className="card border-anar/40 p-5">
        <h2 className="font-semibold text-anar">Reset progress</h2>
        <p className="mt-1 text-sm text-muted">Removes XP, streaks, lessons, reviews, bookmarks and badges from this browser. Settings are kept.</p>
        {confirming ? (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="btn bg-anar text-white"
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
          <button type="button" className="btn-secondary mt-3" onClick={() => setConfirming(true)}>
            Reset progress…
          </button>
        )}
      </section>
    </div>
  );
}
