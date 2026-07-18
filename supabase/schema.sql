-- ============================================================
-- Tappy Datenbank-Schema
-- Diesen Code im Supabase SQL Editor ausführen (Projekt > SQL Editor > New query)
-- ============================================================

-- 1. Profiles: erweitert die eingebaute auth.users Tabelle
-- (payout_email ist für die spätere Auszahlungsfunktion vorbereitet)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  payout_email text,
  created_at timestamptz default now()
);

-- Automatisch ein Profil anlegen, sobald sich jemand registriert
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Kneipen
create table if not exists kneipen (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  adresse text,
  lat double precision not null,
  lng double precision not null,
  beschreibung text,
  erstellt_von uuid references profiles(id),
  created_at timestamptz default now()
);

-- 3. Bewertungen (ein Rating pro User pro Kneipe)
create table if not exists bewertungen (
  id uuid default gen_random_uuid() primary key,
  kneipe_id uuid references kneipen(id) on delete cascade,
  user_id uuid references profiles(id),
  rating int not null check (rating between 1 and 5),
  kommentar text,
  created_at timestamptz default now(),
  unique (kneipe_id, user_id)
);

-- ============================================================
-- Row Level Security: wer darf was sehen/ändern
-- ============================================================
alter table profiles enable row level security;
alter table kneipen enable row level security;
alter table bewertungen enable row level security;

-- Profiles: öffentlich lesbar, nur selbst bearbeitbar
create policy "profiles_select_all" on profiles
  for select using (true);
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- Kneipen: öffentlich lesbar, nur eingeloggt anlegbar
create policy "kneipen_select_all" on kneipen
  for select using (true);
create policy "kneipen_insert_own" on kneipen
  for insert with check (auth.uid() = erstellt_von);

-- Bewertungen: öffentlich lesbar, nur eingeloggt anlegbar/änderbar
create policy "bewertungen_select_all" on bewertungen
  for select using (true);
create policy "bewertungen_insert_own" on bewertungen
  for insert with check (auth.uid() = user_id);
create policy "bewertungen_update_own" on bewertungen
  for update using (auth.uid() = user_id);
