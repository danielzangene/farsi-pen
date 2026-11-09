"use client";
import { useEffect, useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { ApiError, hasBackend } from "@/lib/backend";
import {
  formatCode,
  joinSync,
  normaliseCode,
  startSync,
  stopSync,
  syncInfo,
  type SyncInfo,
} from "@/lib/sync";

const message = (e: unknown) =>
  e instanceof ApiError && e.code === "network"
    ? "Couldn't reach the server. Check your connection and try again."
    : "Something went wrong. Try again in a minute.";

/** Profile: keep progress in step across devices with a private code. */
export function SyncCard() {
  const [info, setInfo] = useState<SyncInfo | null>(null);
  const [mode, setMode] = useState<"idle" | "join">("idle");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const read = () => setInfo(syncInfo());
    read();
    window.addEventListener("farsipen:sync", read);
    return () => window.removeEventListener("farsipen:sync", read);
  }, []);

  if (!hasBackend) return null;

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
    } catch (e) {
      setMsg({ ok: false, text: message(e) });
    } finally {
      setBusy(false);
    }
  };

  const turnOn = () =>
    run(async () => {
      await startSync();
      setMsg({
        ok: true,
        text: "Sync is on. Enter this code on your other device.",
      });
    });

  const join = () => {
    const code = normaliseCode(input);
    if (!code)
      return setMsg({
        ok: false,
        text: "That doesn't look like a sync code: it's 26 letters and numbers.",
      });
    if (
      !window.confirm(
        "Replace the progress on this device with the synced progress?",
      )
    )
      return;
    run(async () => {
      const r = await joinSync(code);
      if (r === "missing")
        setMsg({ ok: false, text: "No progress is saved under that code." });
      else {
        setMode("idle");
        setInput("");
        setMsg({
          ok: true,
          text: "Linked. This device now has your synced progress.",
        });
      }
    });
  };

  const copy = async () => {
    if (!info) return;
    try {
      await navigator.clipboard.writeText(formatCode(info.code));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <section className="card p-5" aria-labelledby="sync-heading">
      <h2 id="sync-heading" className="eyebrow text-muted">
        Sync across devices
      </h2>
      {info ? (
        <>
          <p className="mt-2 text-sm text-muted">
            Your progress saves to this code automatically. Enter it on another
            phone or computer to continue there. Keep it private: anyone with
            the code can see your progress.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-paper p-3">
            <code className="min-w-0 flex-1 break-all font-mono text-base font-semibold tracking-wide">
              {formatCode(info.code)}
            </code>
            <button
              type="button"
              className="btn-ghost btn-icon shrink-0"
              onClick={copy}
              aria-label="Copy sync code"
            >
              {copied ? (
                <Check className="size-5 text-pista-ink" />
              ) : (
                <Copy className="size-5" />
              )}
            </button>
          </div>
          <p className="mt-2 text-sm text-muted">
            {info.syncedAt
              ? `Last synced ${new Date(info.syncedAt).toLocaleString()}`
              : "Not synced yet"}
          </p>
          <button
            type="button"
            className="btn-ghost btn-sm mt-2 -ms-2"
            onClick={() =>
              window.confirm(
                "Stop syncing on this device? Your progress stays here, and the code keeps working on other devices.",
              ) && stopSync()
            }
          >
            Stop syncing on this device
          </button>
        </>
      ) : mode === "join" ? (
        <>
          <label htmlFor="sync-code" className="mt-2 block text-sm text-muted">
            Enter the code shown on your other device (Profile → Sync across
            devices).
          </label>
          <input
            id="sync-code"
            className="input mt-3 font-mono"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="abcd-efgh-…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-primary btn-sm"
              disabled={busy || !input.trim()}
              onClick={join}
            >
              {busy && <RefreshCw className="size-4 animate-spin" />} Link this
              device
            </button>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => {
                setMode("idle");
                setMsg(null);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">
            Use Farsi Pen on your phone and your computer with the same streak
            and reviews. No email or account: you get a private code.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-secondary btn-sm"
              disabled={busy}
              onClick={turnOn}
            >
              {busy && <RefreshCw className="size-4 animate-spin" />} Turn on
              sync
            </button>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => {
                setMode("join");
                setMsg(null);
              }}
            >
              I have a code
            </button>
          </div>
        </>
      )}
      {msg && (
        <p
          role="status"
          className={
            msg.ok
              ? "mt-3 text-sm font-semibold text-pista-ink"
              : "mt-3 text-sm font-semibold text-anar-ink"
          }
        >
          {msg.text}
        </p>
      )}
    </section>
  );
}
