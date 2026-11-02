"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Eye,
  PartyPopper,
  RotateCcw,
  Target,
  Zap,
} from "lucide-react";
import { getWord } from "@/lib/words";
import { rate, startQueue, type Deck, type QueueState } from "@/lib/flashcards";
import { speak } from "@/lib/speech";
import {
  completeFlashcards,
  toggleBookmark,
  useProgress,
  type Outcome,
} from "@/lib/store";
import { cx } from "@/lib/util";
import { SayItButton } from "./SayItButton";
import { ReportButton } from "./ReportButton";
import {
  AudioButtons,
  Fa,
  FocusMode,
  RegisterTag,
  SessionHeader,
  StatCard,
} from "./ui";
import { YouglishButton } from "./YouglishPlayer";

const RATINGS: {
  outcome: Outcome;
  label: string;
  sub: string;
  className: string;
  key: string;
}[] = [
  {
    outcome: "again",
    label: "Didn't know",
    sub: "See it again soon",
    className: "btn-danger",
    key: "1",
  },
  {
    outcome: "hard",
    label: "Almost",
    sub: "Knew it, with effort",
    className: "btn-sky",
    key: "2",
  },
  {
    outcome: "good",
    label: "Knew it",
    sub: "Got it right away",
    className: "btn-success",
    key: "3",
  },
];

/**
 * Flip-card study session: see the word, guess, flip, then hear it, see it in a
 * sentence, watch it in real videos, say it — and rate how well you knew it.
 * "Didn't know" brings the card back a few cards later in this same session.
 */
export function FlashcardSession({
  deck,
  title,
  onExit,
}: {
  deck: Deck;
  title: string;
  onExit: () => void;
}) {
  const { settings, bookmarks, customWords } = useProgress();
  const [q, setQ] = useState<QueueState>(() => startQueue(deck.ids));
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState<{ xp: number; q: QueueState } | null>(
    null,
  );

  const id = q.queue[0];
  const word = id ? getWord(id, customWords) : undefined;
  const toFarsi = settings.direction === "en-fa";
  const done = deck.ids.length - new Set(q.queue).size;
  const seenBefore = id ? id in q.outcomes : false;

  const flip = useCallback(() => {
    setFlipped(true);
    if (word && toFarsi) void speak(word.fa);
  }, [word, toFarsi]);

  const onRate = useCallback(
    (o: Outcome) => {
      const next = rate(q, o);
      setFlipped(false);
      if (next.queue.length === 0) {
        setResult({
          xp: completeFlashcards(next.outcomes, deck.eligible),
          q: next,
        });
      }
      setQ(next);
    },
    [q, deck.eligible],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        result ||
        !word ||
        (e.target as HTMLElement)?.closest("input, textarea, dialog")
      )
        return;
      if (!flipped && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        flip();
      } else if (flipped) {
        const r = RATINGS.find((x) => x.key === e.key);
        if (r) onRate(r.outcome);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, flip, onRate, result, word]);

  if (result)
    return (
      <FlashcardResult
        result={result}
        total={deck.ids.length}
        onAgain={onExit}
      />
    );
  if (!word) return null;

  const inDeck = bookmarks.includes(word.id);

  return (
    <div className="mx-auto max-w-2xl">
      <SessionHeader
        exitHref="/app/words/"
        onExit={onExit}
        progress={done / deck.ids.length}
        right={
          <span className="eyebrow text-muted">
            {Math.min(done + 1, deck.ids.length)}/{deck.ids.length}
          </span>
        }
      />
      <p className="eyebrow text-firuze-ink">
        {title}
        {seenBefore && <span className="text-anar-ink"> · again</span>}
      </p>

      <div className="card mt-3 flex min-h-[22rem] flex-col items-center p-6 text-center sm:p-8">
        {/* Front */}
        {toFarsi ? (
          <>
            <p className="eyebrow text-muted">How do you say…</p>
            <p className="mt-4 text-3xl font-extrabold sm:text-4xl">
              {word.en}
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow text-muted">What does it mean?</p>
            <Fa className="mt-4 block text-5xl font-bold leading-relaxed">
              {word.fa}
            </Fa>
            {!settings.scriptOnly && word.tr && (
              <p className="mt-1 text-xl font-bold text-muted">{word.tr}</p>
            )}
            <div className="mt-4">
              <AudioButtons text={word.fa} big />
            </div>
          </>
        )}

        {/* Back */}
        {flipped ? (
          <div className="mt-6 w-full animate-pop border-t-2 border-line pt-6">
            {toFarsi ? (
              <>
                <Fa className="block text-5xl font-bold leading-relaxed">
                  {word.fa}
                </Fa>
                {!settings.scriptOnly && word.tr && (
                  <p className="mt-1 text-xl font-bold text-muted">{word.tr}</p>
                )}
                <div className="mt-3 flex justify-center">
                  <AudioButtons text={word.fa} big />
                </div>
              </>
            ) : (
              <p className="text-3xl font-extrabold">{word.en}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              {!settings.scriptOnly && word.soundsLike && (
                <span className="text-sm font-semibold text-muted">
                  sounds like “{word.soundsLike}”
                </span>
              )}
              <RegisterTag register={word.register} />
            </div>
            {word.alt && word.alt.length > 0 && !toFarsi && (
              <p className="mt-1 text-sm font-semibold text-muted">
                also: {word.alt.join(", ")}
              </p>
            )}

            {word.example.fa && (
              <div className="mt-5 rounded-2xl bg-paper p-4 text-left">
                <div className="flex items-start justify-between gap-2">
                  <Fa className="block text-xl font-bold leading-relaxed">
                    {word.example.fa}
                  </Fa>
                  <AudioButtons text={word.example.fa} compact />
                </div>
                {!settings.scriptOnly && word.example.tr && (
                  <p className="font-semibold text-muted">{word.example.tr}</p>
                )}
                <p className="font-semibold">{word.example.en}</p>
              </div>
            )}
            {word.note && (
              <p className="mt-3 text-sm font-semibold text-muted">
                {word.note}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
              <span className="flex items-center gap-1 rounded-xl px-1 text-sm font-bold text-muted">
                <SayItButton word={word} /> Say it
              </span>
              <span className="flex items-center gap-1 rounded-xl px-1 text-sm font-bold text-muted">
                <YouglishButton query={word.fa} label={word.en} /> Videos
              </span>
              <button
                type="button"
                className={cx(
                  "btn-ghost btn-sm",
                  inDeck && "!text-saffron-ink",
                )}
                onClick={() => toggleBookmark(word.id)}
                aria-pressed={inDeck}
              >
                <Bookmark className={cx("size-4", inDeck && "fill-current")} />{" "}
                {inDeck ? "In my cards" : "Add to my cards"}
              </button>
              <ReportButton
                itemId={word.id}
                context={`${word.fa} (${word.tr}) = ${word.en}`}
                align="right"
              />
            </div>
          </div>
        ) : (
          <p className="mt-auto pt-8 text-sm font-semibold text-muted">
            Think of the answer, then flip the card.
          </p>
        )}
      </div>

      {/* Spacer for the fixed bar */}
      <div className="h-40" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-line bg-card pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-2xl px-4 py-4">
          {flipped ? (
            <div className="grid grid-cols-3 gap-2">
              {RATINGS.map((r) => (
                <button
                  key={r.outcome}
                  type="button"
                  className={cx(
                    r.className,
                    "!h-auto flex-col !gap-0 !px-2 !py-2.5",
                  )}
                  onClick={() => onRate(r.outcome)}
                >
                  <span className="text-sm sm:text-base">{r.label}</span>
                  <span className="hidden text-[11px] font-semibold normal-case tracking-normal opacity-90 sm:block">
                    {r.sub}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <button
              type="button"
              className="btn-primary btn-lg w-full"
              onClick={flip}
              autoFocus
            >
              <Eye className="size-5" /> Show answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FlashcardResult({
  result,
  total,
  onAgain,
}: {
  result: { xp: number; q: QueueState };
  total: number;
  onAgain: () => void;
}) {
  const o = Object.values(result.q.outcomes);
  const knew = o.filter((x) => x === "good").length;
  const almost = o.filter((x) => x === "hard").length;
  const missed = o.filter((x) => x === "again").length;
  return (
    <div className="mx-auto max-w-xl py-8 text-center">
      <FocusMode />
      <span className="mx-auto grid size-24 animate-pop place-items-center rounded-full bg-saffron text-on-accent">
        <PartyPopper className="size-12" />
      </span>
      <h1 className="mt-5 text-3xl font-extrabold text-saffron-ink sm:text-4xl">
        Deck done!
      </h1>
      <p className="mt-2 font-semibold text-muted">
        {total} card{total === 1 ? "" : "s"}
        {missed > 0 && ` · ${missed} relearned in this session`}. They&apos;ll
        come back right before you&apos;d forget them.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatCard
          label="Knew it"
          tone="pista"
          value={knew}
          icon={<Target className="size-5" />}
        />
        <StatCard label="Almost" tone="sky" value={almost} />
        <StatCard
          label="Again"
          tone="anar"
          value={missed}
          icon={<RotateCcw className="size-5" />}
        />
      </div>
      {result.xp > 0 && (
        <p className="mt-4">
          <span className="chip animate-pop bg-saffron-soft text-saffron-ink">
            <Zap className="mr-1 inline size-4 fill-current" />+{result.xp} XP
          </span>
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:justify-center">
        <Link href="/app/" className="btn-primary btn-lg" autoFocus>
          Done for today
        </Link>
        <button
          type="button"
          className="btn-secondary btn-lg"
          onClick={onAgain}
        >
          Choose another deck
        </button>
      </div>
    </div>
  );
}
