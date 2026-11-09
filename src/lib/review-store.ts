"use client";
// Where review results live: verdicts in localStorage, recordings (blobs)
// in IndexedDB, so a long review session survives reloads.
import type { Verdict } from "./review";

const KEY = "farsipen:review";
const DB = "farsipen-review";

export function loadVerdicts(): { reviewer: string; verdicts: Record<string, Verdict> } {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return { reviewer: v.reviewer ?? "", verdicts: v.verdicts ?? {} };
  } catch {
    return { reviewer: "", verdicts: {} };
  }
}

export function saveVerdicts(reviewer: string, verdicts: Record<string, Verdict>) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ reviewer, verdicts }));
  } catch {}
}

function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore("rec");
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const d = await db();
  return new Promise((resolve, reject) => {
    const req = fn(d.transaction("rec", mode).objectStore("rec"));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const putRecording = (id: string, blob: Blob) => tx("readwrite", (s) => s.put(blob, id));
export const getRecording = (id: string) => tx<Blob | undefined>("readonly", (s) => s.get(id));
export const deleteRecording = (id: string) => tx("readwrite", (s) => s.delete(id));
export const allRecordingIds = () => tx<IDBValidKey[]>("readonly", (s) => s.getAllKeys());

export function blobToDataUrl(b: Blob): Promise<string> {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.readAsDataURL(b);
  });
}
