-- Interzone Feed schema. Run this in your Supabase SQL editor.
-- Local-first by default; this is only needed if you want persistence across devices.

create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  updated_at timestamptz default now() not null,
  descent_level int default 1 not null,
  paranoia_score int default 10 not null,
  current_streak int default 0 not null,
  last_fix_at timestamptz,
  withdrawal_mode boolean default false not null,
  audio_enabled boolean default false not null,
  erotic_grotesque boolean default false not null,
  ending_slug text,
  bug_powder_dep int default 0 not null,
  black_meat_dep int default 0 not null,
  slow_speed_dep int default 0 not null,
  flesh_juice_dep int default 0 not null
);

create table if not exists mutations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  slug text not null,
  unlocked_at timestamptz default now() not null,
  unique(user_id, slug)
);

create table if not exists surveillance_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  severity text check (severity in ('LOW','MEDIUM','HIGH','CRITICAL')) default 'LOW',
  message text not null,
  created_at timestamptz default now() not null
);

create table if not exists hallucination_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  seed text not null,
  content jsonb not null,
  created_at timestamptz default now() not null
);

create table if not exists routines (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text,
  body text not null,
  created_at timestamptz default now() not null
);

-- RLS
alter table profiles enable row level security;
alter table mutations enable row level security;
alter table surveillance_logs enable row level security;
alter table hallucination_history enable row level security;
alter table routines enable row level security;

create policy "own profile select" on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);
create policy "own profile insert" on profiles for insert with check (auth.uid() = id);

create policy "own mutations all" on mutations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own surveillance all" on surveillance_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own hallucinations all" on hallucination_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own routines all" on routines for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create profile row on signup (including anonymous)
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
