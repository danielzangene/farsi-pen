"use client";
// Keeps this device's settings and the learner's Supabase profile (see profile-row.ts) in step:
// - On sign-in, and whenever the tab comes back into view, the row is read and its values replace this
//   device's. Columns the row doesn't have yet (null) are filled in from this device instead.
// - Every local change (store.ts onSave) is sent up shortly after, only the columns that changed.
import { useSyncExternalStore } from "react";
import { AUTH_ENABLED, supabaseClient } from "./auth";
import { changedColumns, fromRow, PROFILE_COLUMNS, PROFILES_TABLE, toRow, type ProfileColumn, type ProfileRow } from "./profile-row";
import { getSettings, onSave, updateSettings } from "./store";

/** How long to wait after a change before sending it, so typing or quick taps go up as one update. */
const PUSH_DEBOUNCE_MS = 600;

let started = false;
let userId: string | null = null;
/** What the server holds, as far as this device knows; null until the first read for this sign-in finishes. */
let serverRow: ProfileRow | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let pushInFlight: Promise<void> | null = null;

// Whether the profile has been read since sign-in (or the read failed): until then, "hasn't answered the
// welcome questions" may only mean "not loaded yet". Builds without sign-in have nothing to load.
let ready = !AUTH_ENABLED;
const readyListeners = new Set<() => void>();

function setReady(next: boolean) {
  if (ready === next) return;
  ready = next;
  readyListeners.forEach((listener) => listener());
}

function subscribeReady(listener: () => void) {
  readyListeners.add(listener);
  return () => readyListeners.delete(listener);
}

/** True once the profile is loaded for this sign-in (always true without sign-in; false while rendering on the server). */
export function useProfileReady(): boolean {
  return useSyncExternalStore(
    subscribeReady,
    () => ready,
    () => false,
  );
}

async function pull() {
  const id = userId;
  if (!id) return;
  await flushPush();
  const before = toRow(getSettings());
  const table = supabaseClient().from(PROFILES_TABLE);
  const { data, error } = await table.select(PROFILE_COLUMNS.join(",")).eq("id", id).maybeSingle<ProfileRow>();
  if (error || id !== userId) return;

  if (!data) {
    // No row yet (it's normally made at sign-up): start it from this device.
    const row = toRow(getSettings());
    const { error: insertError } = await supabaseClient().from(PROFILES_TABLE).insert({ id, ...row });
    if (!insertError && id === userId) serverRow = row;
    return;
  }

  // Choices made while the read was on its way are newer than what it brought back: keep them.
  const editedMeanwhile = Object.keys(changedColumns(before, toRow(getSettings()))) as ProfileColumn[];
  const fromServer = fromRow({ ...data, ...Object.fromEntries(editedMeanwhile.map((column) => [column, null])) });
  // The server's values win; its null columns count as unsent, so this device's values fill them in.
  serverRow = data;
  if (Object.keys(fromServer).length) updateSettings(fromServer);
  schedulePush(0);
}

async function push() {
  const id = userId;
  if (!id || !serverRow) return;
  const patch = changedColumns(serverRow, toRow(getSettings()));
  if (!Object.keys(patch).length) return;
  const { error } = await supabaseClient().from(PROFILES_TABLE).update(patch).eq("id", id);
  // On failure `serverRow` is unchanged, so the same columns go up with the next change or tab focus.
  if (!error && id === userId) serverRow = { ...serverRow, ...patch };
}

/** Runs a push after any that is already on its way, so updates reach the server in order. */
function enqueuePush() {
  pushInFlight = (pushInFlight ?? Promise.resolve()).then(push).finally(() => (pushInFlight = null));
}

function schedulePush(delayMs = PUSH_DEBOUNCE_MS) {
  if (!userId || !serverRow) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    enqueuePush();
  }, delayMs);
}

/** Sends anything waiting right away (before a fresh read, so it isn't overwritten). */
async function flushPush() {
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
    enqueuePush();
  }
  await pushInFlight;
}

/** Keeps the profile in sync for this visit; returns the cleanup. Safe to call more than once. */
export function startProfileSync(): () => void {
  if (!AUTH_ENABLED || started) return () => {};
  started = true;

  const { data } = supabaseClient().auth.onAuthStateChange((_event, session) => {
    const id = session?.user.id ?? null;
    if (id === userId) return;
    userId = id;
    serverRow = null;
    setReady(false);
    // Supabase asks not to call it from inside this callback, so read on the next tick.
    // A failed read still counts as ready: the learner carries on with this device's values.
    if (id) setTimeout(() => void pull().finally(() => id === userId && setReady(true)), 0);
  });
  const stopOnSave = onSave(() => schedulePush());
  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") void pull();
    else void flushPush();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    started = false;
    data.subscription.unsubscribe();
    stopOnSave();
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}
