"use client";
import { useState } from "react";
import type { Word } from "@/content/words";
import { useProgress } from "@/lib/store";
import { AudioButtons, BookmarkButton, Fa, RegisterTag } from "./ui";

/** Word card for the lesson preview, library and bookmarks. */
export function WordCard({ word, isNew, hideMeaning, extra }: { word: Word; isNew?: boolean; hideMeaning?: boolean; extra?: React.ReactNode }) {
  const { settings } = useProgress();
  const [shown, setShown] = useState(!hideMeaning);
  const farsiFirst = settings.scriptOnly || settings.script === "farsi";
  return (
    <div className="card flex flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {farsiFirst ? (
            <>
              <Fa className="block text-left text-2xl font-semibold leading-relaxed">{word.fa}</Fa>
              {!settings.scriptOnly && <p className="text-sm text-muted">{word.tr}</p>}
            </>
          ) : (
            <>
              <p className="font-display text-xl font-semibold">{word.tr}</p>
              <Fa className="block text-left text-xl text-muted">{word.fa}</Fa>
            </>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {isNew && <span className="chip bg-saffron-soft text-saffron">NEW</span>}
          <RegisterTag register={word.register} />
        </div>
      </div>
      {!settings.scriptOnly && <p className="mt-1 text-xs text-muted">sounds like “{word.soundsLike}”</p>}
      {shown ? (
        <>
          <p className="mt-2 font-semibold">{word.en}</p>
          <div className="mt-2 rounded-xl bg-paper p-3 text-sm">
            <Fa className="block">{word.example.fa}</Fa>
            {!settings.scriptOnly && <p className="text-muted">{word.example.tr}</p>}
            <p>{word.example.en}</p>
          </div>
        </>
      ) : (
        <button type="button" className="btn-secondary mt-3 self-start !py-1.5" onClick={() => setShown(true)}>
          Show translation
        </button>
      )}
      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="flex items-center">
          <AudioButtons text={word.fa} />
          <BookmarkButton wordId={word.id} />
        </div>
        {extra}
      </div>
    </div>
  );
}
