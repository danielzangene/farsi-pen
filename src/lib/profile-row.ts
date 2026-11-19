// The learner's profile as stored in Supabase (public.profiles), and the pure mapping between that row
// and this device's Settings. No I/O here: profile-sync.ts does the reading and writing.
//
// The row holds name, photo and learning choices, so every device the learner signs in on shows the same
// ones. Theme is left out on purpose: it stays per device. A null column means "not chosen yet".
import { NAME_MAX_LENGTH, type Goal, type Reads, type Settings } from "./store";

/** The table the profile lives in. */
export const PROFILES_TABLE = "profiles";

type SnakeCase<S extends string> = S extends `${infer Head}-${infer Tail}` ? `${Head}_${SnakeCase<Tail>}` : S;
/** How an app value is stored in its Postgres enum: UPPER_SNAKE_CASE ("fa-en" → "FA_EN"). */
export type DbEnum<T extends string> = Uppercase<SnakeCase<T>>;

export function toDbEnum<T extends string>(value: T): DbEnum<T> {
  return value.toUpperCase().replace(/-/g, "_") as DbEnum<T>;
}

export function fromDbEnum<T extends string>(value: DbEnum<T>): T {
  return value.toLowerCase().replace(/_/g, "-") as T;
}

/** The synced columns. Enums use the Postgres types learning_goal, script_reading, card_direction and card_script. */
export interface ProfileRow {
  name: string | null;
  avatar_url: string | null;
  goal: DbEnum<Goal> | null;
  reads: DbEnum<Reads> | null;
  daily_goal: number | null;
  direction: DbEnum<Settings["direction"]> | null;
  script: DbEnum<Settings["script"]> | null;
  script_only: boolean | null;
  show_keyboard: boolean | null;
  checklist_hidden: boolean | null;
  onboarded: boolean | null;
}

export type ProfileColumn = keyof ProfileRow;

export const PROFILE_COLUMNS: readonly ProfileColumn[] = [
  "name",
  "avatar_url",
  "goal",
  "reads",
  "daily_goal",
  "direction",
  "script",
  "script_only",
  "show_keyboard",
  "checklist_hidden",
  "onboarded",
];

/** This device's settings as a profile row. */
export function toRow(settings: Settings): ProfileRow {
  return {
    name: settings.name.trim().slice(0, NAME_MAX_LENGTH),
    avatar_url: settings.avatarUrl,
    goal: settings.goal && toDbEnum(settings.goal),
    reads: settings.reads && toDbEnum(settings.reads),
    daily_goal: settings.dailyGoal,
    direction: toDbEnum(settings.direction),
    script: toDbEnum(settings.script),
    script_only: settings.scriptOnly,
    show_keyboard: settings.showKeyboard,
    checklist_hidden: settings.checklistHidden,
    onboarded: settings.onboarded,
  };
}

/** The settings a stored row sets; null columns ("not chosen yet") are left out. */
export function fromRow(row: Partial<ProfileRow>): Partial<Settings> {
  const settings: Partial<Settings> = {};
  if (row.name != null) settings.name = row.name;
  if (row.avatar_url != null) settings.avatarUrl = row.avatar_url;
  if (row.goal != null) settings.goal = fromDbEnum<Goal>(row.goal);
  if (row.reads != null) settings.reads = fromDbEnum<Reads>(row.reads);
  if (row.daily_goal != null) settings.dailyGoal = row.daily_goal;
  if (row.direction != null) settings.direction = fromDbEnum<Settings["direction"]>(row.direction);
  if (row.script != null) settings.script = fromDbEnum<Settings["script"]>(row.script);
  if (row.script_only != null) settings.scriptOnly = row.script_only;
  if (row.show_keyboard != null) settings.showKeyboard = row.show_keyboard;
  if (row.checklist_hidden != null) settings.checklistHidden = row.checklist_hidden;
  // Answering the welcome questions on any device counts everywhere: the server never un-answers them.
  if (row.onboarded) settings.onboarded = true;
  return settings;
}

/** The columns where `next` differs from `prev`, with their `next` values (a null `prev` column always differs). */
export function changedColumns(prev: Partial<ProfileRow>, next: ProfileRow): Partial<ProfileRow> {
  const patch: Partial<Record<ProfileColumn, unknown>> = {};
  for (const column of PROFILE_COLUMNS) if (prev[column] !== next[column]) patch[column] = next[column];
  return patch as Partial<ProfileRow>;
}
