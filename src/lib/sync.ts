// Device sync without accounts: progress is stored under a random code. Anyone
// with the code can read it, so it's long (130 bits) and shown only to its owner.
import { api, ApiError, hasBackend } from "./backend";
import { currentProgress, importProgress, onSave, type ProgressState } from "./store";

const KEY = "farsipen:sync";
const ALPHABET = "abcdefghijklmnopqrstuvwxyz234567";

export interface SyncInfo {
  code: string;
  /** When this device last pushed or pulled. */
  syncedAt: string | null;
}

interface Remote {
  updatedAt: string;
  state: ProgressState;
}

export function newCode(rand: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n))): string {
  return [...rand(26)].map((b) => ALPHABET[b % 32]).join("");
}

/** Accepts the code with spaces, dashes or capitals, as people type it. */
export function normaliseCode(input: string): string | null {
  const c = input.toLowerCase().replace(/[\s-]/g, "");
  return /^[a-z2-7]{26}$/.test(c) ? c : null;
}

/** Groups of four for reading aloud or copying by hand. */
export function formatCode(code: string): string {
  return code.match(/.{1,4}/g)?.join("-") ?? code;
}

export function syncInfo(): SyncInfo | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return v && typeof v.code === "string" ? v : null;
  } catch {
    return null;
  }
}

function setInfo(info: SyncInfo | null) {
  try {
    if (info) localStorage.setItem(KEY, JSON.stringify(info));
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event("farsipen:sync"));
}

async function push(code: string) {
  const at = new Date().toISOString();
  await api(`/sync/${code}`, { method: "PUT", body: JSON.stringify({ updatedAt: at, state: currentProgress() }) });
  setInfo({ code, syncedAt: at });
}

async function pull(code: string): Promise<Remote | null> {
  try {
    return await api<Remote>(`/sync/${code}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

/** Turn sync on with a new code, uploading this device's progress. */
export async function startSync(): Promise<string> {
  const code = newCode();
  await push(code);
  return code;
}

/**
 * Link this device to an existing code. Returns "replaced" after loading the
 * synced progress, or "missing" if nothing is stored under the code.
 */
export async function joinSync(code: string): Promise<"replaced" | "missing"> {
  const remote = await pull(code);
  if (!remote) return "missing";
  importProgress(JSON.stringify(remote.state));
  setInfo({ code, syncedAt: remote.updatedAt });
  return "replaced";
}

export function stopSync() {
  setInfo(null);
}

/** Whether a remote copy should replace this device's progress on start-up. */
export function shouldPull(remoteAt: string, syncedAt: string | null): boolean {
  return !syncedAt || remoteAt > syncedAt;
}

let started = false;

/** On app start: pull newer progress, then push local changes (debounced). */
export function startAutoSync(): () => void {
  if (!hasBackend || started) return () => {};
  started = true;
  let timer: number | undefined;
  let pulling = true;
  const info = syncInfo();
  if (info) {
    pull(info.code)
      .then((remote) => {
        if (remote && shouldPull(remote.updatedAt, info.syncedAt)) {
          importProgress(JSON.stringify(remote.state));
          setInfo({ code: info.code, syncedAt: remote.updatedAt });
        }
      })
      .catch(() => {})
      .finally(() => (pulling = false));
  } else pulling = false;

  const off = onSave(() => {
    const cur = syncInfo();
    if (!cur || pulling) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => push(cur.code).catch(() => {}), 4000);
  });
  const flush = () => {
    const cur = syncInfo();
    if (cur && timer !== undefined && document.visibilityState === "hidden") {
      window.clearTimeout(timer);
      timer = undefined;
      push(cur.code).catch(() => {});
    }
  };
  document.addEventListener("visibilitychange", flush);
  return () => {
    off();
    document.removeEventListener("visibilitychange", flush);
    started = false;
  };
}
