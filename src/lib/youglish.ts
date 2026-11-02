"use client";
// YouGlish embed: real YouTube clips where a word is spoken, cued to the
// moment it is said. Videos play through YouGlish's official widget (which
// uses the YouTube embedded player), so nothing is re-hosted.
// Docs: https://youglish.com/api/doc/js-api
// YouGlish asks that "Powered by YouGlish.com" stays visible next to the widget.

export const YOUGLISH_LANG = "persian";

export type YGEvent = { totalResult?: number; trackNumber?: number };

export type YGWidget = {
  fetch: (query: string, lang: string, accent?: string) => void;
  next?: () => void;
  previous?: () => void;
  replay?: () => void;
  pause?: () => void;
  close?: () => void;
};

type YGNamespace = {
  Widget: new (
    id: string,
    opts: {
      width?: number;
      components?: number;
      autoStart?: 0 | 1;
      events?: Record<string, (e: YGEvent) => void>;
    },
  ) => YGWidget;
};

declare global {
  interface Window {
    YG?: YGNamespace;
    onYouglishAPIReady?: () => void;
  }
}

const SRC = "https://youglish.com/public/emb/widget.js";
let loading: Promise<YGNamespace> | null = null;

/** Loads widget.js once and resolves when YouGlish says it is ready. */
export function loadYouglish(timeoutMs = 15000): Promise<YGNamespace> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.YG?.Widget) return Promise.resolve(window.YG);
  if (loading) return loading;
  loading = new Promise<YGNamespace>((resolve, reject) => {
    const fail = (msg: string) => {
      loading = null;
      reject(new Error(msg));
    };
    const timer = setTimeout(() => fail("YouGlish took too long to load"), timeoutMs);
    const prev = window.onYouglishAPIReady;
    window.onYouglishAPIReady = () => {
      prev?.();
      clearTimeout(timer);
      if (window.YG?.Widget) resolve(window.YG);
      else fail("YouGlish loaded without its widget");
    };
    const tag = document.createElement("script");
    tag.src = SRC;
    tag.async = true;
    tag.onerror = () => {
      clearTimeout(timer);
      tag.remove();
      fail("Couldn't reach YouGlish");
    };
    document.head.appendChild(tag);
  });
  return loading;
}

/** Contains Persian/Arabic-script letters. */
export function hasPersianScript(text: string): boolean {
  return /[؀-ۿﭐ-﷿ﹰ-﻿]/.test(text);
}

export function youglishPageUrl(query: string): string {
  return `https://youglish.com/pronounce/${encodeURIComponent(query.trim())}/${YOUGLISH_LANG}`;
}

export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${query.trim()} تلفظ`)}`;
}
