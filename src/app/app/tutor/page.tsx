"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Lightbulb, Mic, RotateCcw, Square } from "lucide-react";
import {
  ApiError,
  askTutor,
  hasBackend,
  type TutorReply,
  type TutorScenario,
} from "@/lib/backend";
import { markActivity, useProgress } from "@/lib/store";
import { listen, resolveEngine, type Listening } from "@/lib/stt";
import { cx } from "@/lib/util";
import { AudioButtons, Fa, PageHeader } from "@/components/ui";

const SCENES: {
  id: TutorScenario;
  title: string;
  text: string;
  emoji: string;
  opener: string;
}[] = [
  {
    id: "chat",
    title: "Free chat",
    text: "Talk about your day",
    emoji: "💬",
    opener: "سلام!",
  },
  {
    id: "cafe",
    title: "At a café",
    text: "Order something",
    emoji: "☕",
    opener: "سلام، ببخشید.",
  },
  {
    id: "taxi",
    title: "Shared taxi",
    text: "Get across town",
    emoji: "🚕",
    opener: "سلام آقا.",
  },
  {
    id: "bazaar",
    title: "In the bazaar",
    text: "Buy and bargain",
    emoji: "🧺",
    opener: "سلام، خسته نباشید.",
  },
  {
    id: "guest",
    title: "Visiting a family",
    text: "Ta'ârof at the door",
    emoji: "🫖",
    opener: "سلام، ببخشید دیر کردم.",
  },
  {
    id: "pharmacy",
    title: "At the pharmacy",
    text: "Say what's wrong",
    emoji: "💊",
    opener: "سلام.",
  },
  {
    id: "directions",
    title: "Lost in the city",
    text: "Ask the way",
    emoji: "🧭",
    opener: "ببخشید آقا.",
  },
];

type Turn =
  | { role: "user"; text: string }
  | { role: "assistant"; reply: TutorReply };

const ERR: Record<string, string> = {
  limit:
    "That's today's limit for the tutor. Come back tomorrow — or keep practising with missions and scenes.",
  busy: "The tutor is very busy today. Please try again later.",
  "tutor-off": "The tutor isn't switched on yet.",
  network: "Couldn't reach the tutor. Check your connection.",
};

export default function TutorPage() {
  const s = useProgress();
  const level =
    s.placement?.level && s.placement.level !== "A0" ? s.placement.level : "A1";
  const [scene, setScene] = useState<(typeof SCENES)[number] | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEn, setShowEn] = useState(false);
  const [rec, setRec] = useState<Listening | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const engine = resolveEngine(s.settings.speechEngine);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns, waiting]);

  if (!hasBackend)
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Talk with the tutor" subtitle="Coming soon" />
        <p className="card p-5 text-muted">
          A conversation partner that answers in Persian is on its way.
          Meanwhile, missions and scenes let you practise real conversations.
        </p>
      </div>
    );

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || waiting || !scene) return;
    const next: Turn[] = [...turns, { role: "user", text: t }];
    setTurns(next);
    setDraft("");
    setError(null);
    setWaiting(true);
    try {
      const messages = next.map((x) =>
        x.role === "user"
          ? { role: "user" as const, content: x.text }
          : { role: "assistant" as const, content: x.reply.fa },
      );
      const reply = await askTutor(messages, scene.id, level);
      setTurns([...next, { role: "assistant", reply }]);
      if (next.filter((x) => x.role === "user").length === 3)
        markActivity("speak");
    } catch (e) {
      setError(
        ERR[e instanceof ApiError ? e.code : ""] ??
          "The tutor couldn't answer. Try again.",
      );
    } finally {
      setWaiting(false);
    }
  };

  const talk = async () => {
    if (rec) return rec.stop();
    if (!engine) return;
    const l = listen(engine, 8000);
    setRec(l);
    try {
      const [best] = await l.result;
      if (best) setDraft((d) => (d ? `${d} ${best}` : best));
    } catch {
      setError("Couldn't hear that. Try again, or type instead.");
    } finally {
      setRec(null);
    }
  };

  if (!scene)
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader
          title="Talk with the tutor"
          subtitle={`An AI partner who answers in Persian at your level (${level}). Pick a situation.`}
        />
        <ul className="grid gap-3 sm:grid-cols-2">
          {SCENES.map((x) => (
            <li key={x.id}>
              <button
                type="button"
                className="tile flex w-full items-center gap-4 p-4 text-left"
                onClick={() => setScene(x)}
              >
                <span
                  className="grid size-12 shrink-0 place-items-center rounded-2xl bg-paper text-2xl"
                  aria-hidden
                >
                  {x.emoji}
                </span>
                <span>
                  <span className="block font-semibold">{x.title}</span>
                  <span className="block text-sm text-muted">{x.text}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          The tutor is an AI and can make mistakes — check anything important
          against your lessons. What you write is sent to the AI service to get
          an answer and isn&apos;t stored.{" "}
          <Link href="/app/privacy/" className="underline">
            Privacy
          </Link>
        </p>
      </div>
    );

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <button
            type="button"
            className="btn-ghost btn-sm -ms-3"
            onClick={() => {
              setScene(null);
              setTurns([]);
              setError(null);
            }}
          >
            ← Situations
          </button>
          <h1 className="mt-1 text-2xl font-extrabold">
            <span aria-hidden>{scene.emoji}</span> {scene.title}
          </h1>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-sm font-semibold text-muted">
          <input
            type="checkbox"
            className="size-5 accent-[var(--color-firuze)]"
            checked={showEn}
            onChange={(e) => setShowEn(e.target.checked)}
          />
          English
        </label>
      </div>

      <ol className="space-y-3" aria-live="polite">
        {turns.length === 0 && (
          <li className="card p-4 text-sm text-muted">
            Start the conversation in Persian — script or Finglish both work.
            Try:{" "}
            <button
              type="button"
              className="font-semibold text-firuze-ink underline"
              onClick={() => send(scene.opener)}
            >
              <Fa>{scene.opener}</Fa>
            </button>
          </li>
        )}
        {turns.map((t, i) =>
          t.role === "user" ? (
            <li key={i} className="flex justify-end">
              <p
                className="max-w-[85%] rounded-3xl rounded-br-lg bg-firuze px-4 py-2.5 text-on-accent"
                dir="auto"
              >
                {t.text}
              </p>
            </li>
          ) : (
            <li key={i} className="flex flex-col items-start gap-1.5">
              {t.reply.fix && (
                <p className="flex max-w-[85%] items-start gap-2 rounded-2xl bg-saffron-soft px-3 py-2 text-sm text-saffron-ink">
                  <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    <span className="sr-only">Tip: </span>
                    {t.reply.fix}
                  </span>
                </p>
              )}
              <div className="card max-w-[85%] rounded-bl-lg p-4">
                <div className="flex items-start gap-2">
                  <Fa className="flex-1 text-xl leading-loose">{t.reply.fa}</Fa>
                  <AudioButtons text={t.reply.fa} compact />
                </div>
                {t.reply.tr && (
                  <p className="mt-1 text-sm text-muted">{t.reply.tr}</p>
                )}
                {showEn && t.reply.en && (
                  <p className="mt-1 text-sm">{t.reply.en}</p>
                )}
              </div>
            </li>
          ),
        )}
        {waiting && (
          <li
            className="card w-20 p-4 text-center text-muted"
            aria-label="The tutor is typing"
          >
            …
          </li>
        )}
      </ol>
      {error && (
        <p
          role="alert"
          className="mt-3 rounded-2xl bg-anar-soft px-4 py-3 text-sm font-semibold text-anar-ink"
        >
          {error}
        </p>
      )}
      <div ref={endRef} />

      <form
        className="material sticky bottom-[calc(5.25rem+env(safe-area-inset-bottom))] mt-4 flex items-end gap-2 rounded-[1.75rem] p-2 lg:bottom-4"
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
      >
        {engine && (
          <button
            type="button"
            className={cx(
              "btn-icon shrink-0",
              rec ? "btn-danger" : "btn-ghost",
            )}
            onClick={talk}
            aria-label={rec ? "Stop recording" : "Speak your answer"}
          >
            {rec ? <Square className="size-5" /> : <Mic className="size-5" />}
          </button>
        )}
        <textarea
          className="input min-h-11 flex-1 resize-none !rounded-3xl !py-2.5"
          rows={1}
          dir="auto"
          aria-label="Your message"
          placeholder="Persian or Finglish…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(draft);
            }
          }}
          maxLength={600}
        />
        {turns.length > 0 && !draft && (
          <button
            type="button"
            className="btn-ghost btn-icon shrink-0"
            onClick={() => {
              setTurns([]);
              setError(null);
            }}
            aria-label="Start over"
          >
            <RotateCcw className="size-5" />
          </button>
        )}
        <button
          type="submit"
          className="btn-primary btn-icon shrink-0"
          disabled={!draft.trim() || waiting}
          aria-label="Send"
        >
          <ArrowUp className="size-5" />
        </button>
      </form>
    </div>
  );
}
