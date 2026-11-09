"use client";
import { useEffect, useRef, useState } from "react";
import { BellOff, BellRing, CalendarPlus, CheckCircle2, Download, Upload } from "lucide-react";
import { reminderIcs } from "@/lib/reminder";
import { importProgress, updateSettings, useProgress } from "@/lib/store";
import { downloadBackup } from "./TodayPlan";

/** Settings: back up / restore progress and a daily reminder. */
export function ProgressTools() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const s = useProgress();
  const on = !!s.settings.reminder;
  const [time, setTime] = useState(s.settings.reminder ?? "19:00");
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");
  useEffect(() => setPerm(typeof Notification === "undefined" ? "unsupported" : Notification.permission), []);
  useEffect(() => {
    if (s.settings.reminder) setTime(s.settings.reminder);
  }, [s.settings.reminder]);

  const changeTime = (t: string) => {
    setTime(t);
    if (on) updateSettings({ reminder: t, remindedOn: null });
  };
  const toggleNotify = async () => {
    if (on) return updateSettings({ reminder: null });
    let p = perm;
    if (p === "default") {
      p = await Notification.requestPermission();
      setPerm(p);
    }
    if (p === "granted") updateSettings({ reminder: time, remindedOn: null });
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    const text = await f.text();
    if (!window.confirm("Replace the progress in this browser with the backup file?")) return;
    const ok = importProgress(text);
    setMsg(ok ? { ok, text: "Progress restored." } : { ok, text: "That file isn't a Farsi Pen backup." });
    if (fileRef.current) fileRef.current.value = "";
  };

  const addReminder = () => {
    const url = `${window.location.origin}${window.location.pathname.replace(/settings\/?$/, "")}`;
    const blob = new Blob([reminderIcs(time, url)], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "farsi-pen-daily-reminder.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <div className="divide-y divide-line">
      <div className="pb-4">
        <p className="font-bold">Back up your progress</p>
        <p className="mt-1 text-sm font-semibold text-muted">
          Progress is saved in this browser. Save a file to keep your streak and reviews safe, or to move to another device.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn-secondary btn-sm" onClick={downloadBackup}>
            <Download className="size-4" /> Save backup
          </button>
          <button type="button" className="btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" /> Restore from file
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" aria-label="Backup file" onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
        {msg && (
          <p role="status" className={msg.ok ? "mt-2 flex items-center gap-1.5 text-sm font-bold text-pista-ink" : "mt-2 text-sm font-bold text-anar-ink"}>
            {msg.ok && <CheckCircle2 className="size-4" />} {msg.text}
          </p>
        )}
      </div>

      <div className="pt-4">
        <p className="font-bold">Daily reminder</p>
        <p className="mt-1 text-sm font-semibold text-muted">
          Pick a time. A calendar event reminds you even when the app is closed; a notification works while Farsi Pen is open in the background, and only if you haven&apos;t practised yet that day.
        </p>
        <label className="mt-3 flex items-center gap-2 text-sm font-bold">
          At
          <input type="time" className="input !w-auto !py-1.5 !text-base" value={time} onChange={(e) => changeTime(e.target.value || "19:00")} />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn-secondary btn-sm" onClick={addReminder}>
            <CalendarPlus className="size-4" /> Add to calendar
          </button>
          {perm !== "unsupported" && perm !== "denied" && (
            <button type="button" className={on ? "btn-ghost btn-sm" : "btn-secondary btn-sm"} onClick={toggleNotify} aria-pressed={on}>
              {on ? <BellOff className="size-4" /> : <BellRing className="size-4" />} {on ? "Turn off notifications" : "Notify me in this browser"}
            </button>
          )}
        </div>
        {on && perm === "granted" && (
          <p role="status" className="mt-2 flex items-center gap-1.5 text-sm font-bold text-pista-ink">
            <CheckCircle2 className="size-4" /> Notifications on for {s.settings.reminder}.
          </p>
        )}
        {perm === "denied" && <p className="mt-2 text-sm font-semibold text-muted">Notifications are blocked for this site in your browser settings. The calendar reminder still works.</p>}
      </div>
    </div>
  );
}
