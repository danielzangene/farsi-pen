-- Learner profiles: one row per Google user with their name, photo and learning choices, shared by every
-- device they sign in on (src/lib/profile-row.ts maps it, src/lib/profile-sync.ts keeps it in step).
-- Theme is deliberately absent: it stays per device. A null column means "not chosen yet": the app fills
-- it in from the device. Enum values are UPPER_SNAKE_CASE; the app converts them to its own ("FA_EN" ↔ "fa-en").

create schema if not exists private;

-- Enums -------------------------------------------------------------------------------------------------

create type public.learning_goal as enum ('TRAVEL', 'FAMILY', 'HERITAGE', 'CURIOUS');
create type public.script_reading as enum ('YES', 'SOME', 'NO');
create type public.card_direction as enum ('FA_EN', 'EN_FA');
create type public.card_script as enum ('LATIN', 'FARSI');

-- Table -------------------------------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text check (char_length(name) <= 255),
  avatar_url text check (char_length(avatar_url) <= 2048),
  goal public.learning_goal,
  reads public.script_reading,
  daily_goal smallint check (daily_goal between 1 and 100),
  direction public.card_direction,
  script public.card_script,
  script_only boolean,
  show_keyboard boolean,
  checklist_hidden boolean,
  onboarded boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One per learner: name, photo and learning choices synced across their devices.';
comment on column public.profiles.reads is 'Whether the learner can read Persian script.';
comment on column public.profiles.onboarded is 'Answered (or skipped) the two welcome questions.';

-- Access: each learner reads and writes only their own row; signed-out visitors get nothing --------------

alter table public.profiles enable row level security;

create policy "Learners read their own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Learners create their own profile" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "Learners update their own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- No delete: the row goes with the account (on delete cascade).
revoke all on public.profiles from anon, authenticated;
grant select, insert, update on public.profiles to authenticated;

-- updated_at ------------------------------------------------------------------------------------------------

create function private.touch_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function private.touch_updated_at();

-- New sign-ups get a profile named after, and pictured with, their Google account ---------------------------

create function private.handle_new_user() returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), 255),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- Learners who signed up before this table existed ---------------------------------------------------------

insert into public.profiles (id, name, avatar_url)
select
  id,
  left(coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name'), 255),
  coalesce(raw_user_meta_data ->> 'avatar_url', raw_user_meta_data ->> 'picture')
from auth.users
on conflict (id) do nothing;
