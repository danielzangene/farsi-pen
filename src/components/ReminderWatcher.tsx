"use client";
import { useEffect } from "react";
import { dayKey } from "@/lib/gamification";
import { reminderDelay } from "@/lib/reminder";
import { today, updateSettings, useProgress } from "@/lib/store";

/**
 * Shows the daily reminder as a system notification while the app is open
 * (an installed app or a tab in the background). Without a push server this
 * can't fire when the app is closed; the calendar reminder covers that.
 */
export function ReminderWatcher() {
  const s = useProgress();
  const { reminder, remindedOn } = s.settings;
  const practised = today(s).xp > 0;
  useEffect(() => {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    const day = dayKey();
    const ms = reminderDelay(reminder, remindedOn, practised, day);
    if (ms === null || ms > 2 ** 31 - 1) return;
    const t = window.setTimeout(() => {
      try {
        const n = new Notification("Time for Persian", { body: "Ten minutes today keeps your streak going.", icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon-192.png`, tag: "farsi-pen-daily" });
        n.onclick = () => {
          window.focus();
          n.close();
        };
      } catch {
        // Some browsers (Android Chrome) only allow notifications from a service worker.
      }
      updateSettings({ remindedOn: day });
    }, ms);
    return () => window.clearTimeout(t);
  }, [reminder, remindedOn, practised]);
  return null;
}
