"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Download, Mic, Pencil, Play, Square, Trash2, Volume2 } from "lucide-react";
import { CATEGORY_LABEL, reviewItems, type ReviewCategory, type ReviewExport, type Verdict } from "@/lib/review";
import { allRecordingIds, blobToDataUrl, deleteRecording, getRecording, loadVerdicts, putRecording, saveVerdicts } from "@/lib/review-store";
import { speak, stopSpeaking } from "@/lib/speech";
import { useHydrated } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa, PageHeader, ProgressBar } from "@/components/ui";

type Filter = "todo" | "flagged" | "all";

export default function ReviewPage() {
  const hydrated = useHydrated();
  const items = useMemo(() => reviewItems(), []);
  const [reviewer, setReviewer] = useState("");
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
  const [category, setCategory] = useState<ReviewCategory | "all">("all");
  const [filter, setFilter] = useState<Filter>("todo");
  const [i, setI] = useState(0);
  const [editing, setEditing] = useState(false);
  const [fixFa, setFixFa] = useState("");
  const [note, setNote] = useState("");
  const [recording, setRecording] = useState(false);
  const [clip, setClip] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const rec = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    const v = loadVerdicts();
    setReviewer(v.reviewer);
    setVerdicts(v.verdicts);
  }, []);

  const list = items.filter((x) => (category === "all" || x.category === category) && (filter === "all" || (filter === "todo" ? !verdicts[x.id] : verdicts[x.id] && !verdicts[x.id].ok)));
  const item = list[Math.min(i, Math.max(0, list.length - 1))];
  const checked = items.filter((x) => verdicts[x.id]).length;
  const flagged = items.filter((x) => verdicts[x.id] && !verdicts[x.id].ok).length;

  // Load this item's recording, if any.
  useEffect(() => {
    let url: string | null = null;
    setClip(null);
    setEditing(false);
    if (!item) return;
    getRecording(item.id)
      .then((b) => {
        if (b) {
          url = URL.createObjectURL(b);
          setClip(url);
        }
      })
      .catch(() => {});
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [item?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (next: Record<string, Verdict>) => {
    setVerdicts(next);
    saveVerdicts(reviewer, next);
  };
  const decide = (ok: boolean, fa?: string, n?: string) => {
    if (!item) return;
    update({ ...verdicts, [item.id]: { ok, fa: fa && fa !== item.fa ? fa : undefined, note: n || undefined, recorded: verdicts[item.id]?.recorded, at: new Date().toISOString() } });
    setEditing(false);
    // In "to do", the list shrinks by one, so the same index shows the next item.
    if (filter !== "todo") setI((x) => Math.min(x + 1, list.length - 1));
  };

  const startRecording = async () => {
    if (!item) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: mr.mimeType });
        await putRecording(item.id, blob);
        setClip(URL.createObjectURL(blob));
        update({ ...verdicts, [item.id]: { ...(verdicts[item.id] ?? { ok: true, at: new Date().toISOString() }), recorded: true } });
      };
      rec.current = mr;
      mr.start();
      setRecording(true);
    } catch {
      alert("Microphone access is needed to record.");
    }
  };
  const stopRecording = () => {
    rec.current?.stop();
    rec.current = null;
    setRecording(false);
  };

  const exportAll = async () => {
    setExporting(true);
    const recordings: Record<string, string> = {};
    for (const id of await allRecordingIds()) {
      const b = await getRecording(String(id));
      if (b) recordings[String(id)] = await blobToDataUrl(b);
    }
    const byId = Object.fromEntries(items.map((x) => [x.id, x]));
    const data: ReviewExport = {
      app: "farsi-pen-review",
      exportedAt: new Date().toISOString(),
      reviewer,
      verdicts: Object.fromEntries(Object.entries(verdicts).map(([id, v]) => [id, { ...v, text: byId[id]?.fa ?? "" }])),
      recordings,
    };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" }));
    a.download = `farsi-pen-review-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    setExporting(false);
  };

  if (!hydrated) return null;
  const counts = Object.fromEntries((Object.keys(CATEGORY_LABEL) as ReviewCategory[]).map((c) => [c, items.filter((x) => x.category === c).length]));
  const v = item ? verdicts[item.id] : undefined;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/app/settings/" className="btn-ghost btn-sm -ms-3">
        <ArrowLeft className="size-4" /> Profile
      </Link>
      <PageHeader
        title="Check the content"
        subtitle="For native Persian speakers: go through each item, mark it correct or suggest a fix, and record it in your own voice if you can. Your work is saved in this browser until you download it."
      />

      <section className="card space-y-4 p-5">
        <label className="block">
          <span className="text-sm font-semibold">Your name (shown with your corrections)</span>
          <input className="input mt-1.5" value={reviewer} onChange={(e) => (setReviewer(e.target.value), saveVerdicts(e.target.value, verdicts))} placeholder="Optional" />
        </label>
        <div>
          <div className="flex justify-between text-sm">
            <span>
              {checked} of {items.length} checked · {flagged} need a fix
            </span>
            <span className="text-muted">{Math.round((checked / items.length) * 100)}%</span>
          </div>
          <ProgressBar value={checked / items.length} tone="pista" size="sm" className="mt-1.5" />
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="select min-w-0 flex-1" value={category} onChange={(e) => (setCategory(e.target.value as ReviewCategory | "all"), setI(0))} aria-label="Category">
            <option value="all">All content ({items.length})</option>
            {(Object.keys(CATEGORY_LABEL) as ReviewCategory[]).map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]} ({counts[c]})
              </option>
            ))}
          </select>
          <select className="select min-w-0 flex-1" value={filter} onChange={(e) => (setFilter(e.target.value as Filter), setI(0))} aria-label="Show">
            <option value="todo">Not checked yet</option>
            <option value="flagged">Needs a fix</option>
            <option value="all">Everything</option>
          </select>
        </div>
      </section>

      {item ? (
        <section className="card p-5 sm:p-6" aria-live="polite">
          <div className="flex items-center justify-between gap-2 text-sm text-muted">
            <span className="min-w-0 truncate">
              {CATEGORY_LABEL[item.category]} · {item.context}
            </span>
            <span className="shrink-0">
              {Math.min(i, list.length - 1) + 1} / {list.length}
            </span>
          </div>
          <div className="mt-4 flex items-start gap-2">
            <p dir="rtl" lang="fa" className="flex-1 text-2xl leading-loose">
              {item.fa}
            </p>
            <button type="button" className="btn-sky btn-icon shrink-0" onClick={() => (stopSpeaking(), void speak(item.fa))} aria-label="Play the current audio">
              <Volume2 className="size-5" />
            </button>
          </div>
          {item.tr && <p className="mt-1 text-muted">{item.tr}</p>}
          {item.en && <p className="mt-1 font-semibold">{item.en}</p>}
          {v && (
            <p className={cx("mt-3 text-sm font-semibold", v.ok ? "text-pista-ink" : "text-anar-ink")}>
              {v.ok ? "Marked correct" : `Needs a fix${v.fa ? `: ${v.fa}` : ""}${v.note ? ` — ${v.note}` : ""}`}
            </p>
          )}

          {editing ? (
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="text-sm font-semibold">Corrected Persian</span>
                <textarea className="input mt-1.5 min-h-20 resize-y" dir="rtl" lang="fa" value={fixFa} onChange={(e) => setFixFa(e.target.value)} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Note (transliteration, translation or what's wrong)</span>
                <textarea className="input mt-1.5 min-h-16 resize-y" value={note} onChange={(e) => setNote(e.target.value)} />
              </label>
              <div className="flex gap-2">
                <button type="button" className="btn-danger flex-1" onClick={() => decide(false, fixFa.trim(), note.trim())}>
                  Save fix
                </button>
                <button type="button" className="btn-ghost" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" className="btn-success" onClick={() => decide(true)}>
                <Check className="size-5" /> Correct
              </button>
              <button type="button" className="btn-secondary" onClick={() => (setFixFa(v?.fa ?? item.fa), setNote(v?.note ?? ""), setEditing(true))}>
                <Pencil className="size-4" /> Needs a fix
              </button>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
            <span className="me-auto text-sm font-semibold">Your recording</span>
            {clip && (
              <>
                <button type="button" className="btn-ghost btn-sm" onClick={() => new Audio(clip).play()}>
                  <Play className="size-4" /> Play
                </button>
                <button
                  type="button"
                  className="btn-ghost btn-sm"
                  onClick={async () => {
                    await deleteRecording(item.id);
                    setClip(null);
                    update({ ...verdicts, [item.id]: { ...(verdicts[item.id] ?? { ok: true, at: new Date().toISOString() }), recorded: false } });
                  }}
                  aria-label="Delete recording"
                >
                  <Trash2 className="size-4" />
                </button>
              </>
            )}
            <button type="button" className={recording ? "btn-danger btn-sm" : "btn-secondary btn-sm"} onClick={recording ? stopRecording : startRecording}>
              {recording ? <Square className="size-4 fill-current" /> : <Mic className="size-4" />} {recording ? "Stop" : clip ? "Record again" : "Record"}
            </button>
          </div>

          <div className="mt-4 flex justify-between">
            <button type="button" className="btn-ghost btn-sm" disabled={i === 0} onClick={() => setI(Math.max(0, i - 1))}>
              <ChevronLeft className="size-4" /> Previous
            </button>
            <button type="button" className="btn-ghost btn-sm" disabled={i >= list.length - 1} onClick={() => setI(i + 1)}>
              Next <ChevronRight className="size-4" />
            </button>
          </div>
        </section>
      ) : (
        <section className="card p-6 text-center">
          <p className="text-lg font-extrabold">Nothing left here</p>
          <p className="mt-1 text-muted">Pick another category or show everything.</p>
        </section>
      )}

      <section className="card p-5">
        <p className="font-semibold">When you're done (or want to stop for now)</p>
        <p className="mt-1 text-sm text-muted">Download the review file and send it to the Farsi Pen team. It includes your marks, fixes and recordings.</p>
        <button type="button" className="btn-primary mt-3 w-full" onClick={exportAll} disabled={exporting || checked === 0}>
          <Download className="size-4" /> {exporting ? "Preparing…" : "Download review file"}
        </button>
      </section>
    </div>
  );
}
