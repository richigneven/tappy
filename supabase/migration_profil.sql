-- ============================================================
-- Migration: Profil-Erweiterungen
-- Im Supabase SQL Editor ausführen (Projekt > SQL Editor > New query)
-- ============================================================

-- 1. Neue Spalten in profiles
alter table profiles add column if not exists avatar_url text;

alter table profiles add column if not exists getraenke_vorliebe text
  check (getraenke_vorliebe in ('bier', 'cocktail', 'schnaps', 'alkoholfrei'));

alter table profiles add column if not exists profil_oeffentlich boolean not null default true;

-- Wichtig: die bisherige Regel "profiles_select_all" erlaubte JEDEM das
-- Lesen ALLER Profile (auch payout_email!). Das ersetzen wir jetzt:
-- Profile sind nur für andere sichtbar, wenn sie öffentlich gestellt sind;
-- das eigene Profil kann man immer sehen.
drop policy if exists "profiles_select_all" on profiles;

create policy "profiles_select_public_or_own" on profiles
  for select using (profil_oeffentlich = true or auth.uid() = id);

-- 2. Storage Bucket für Profilbilder anlegen
-- Das geht NICHT per SQL, sondern im Supabase Dashboard:
--   Storage → New bucket → Name: "avatars" → Public bucket: AN (Häkchen setzen)
-- Erst danach die Policies unten ausführen (sonst existiert der Bucket noch nicht).

-- 3. Storage-Regeln: jeder darf Avatare sehen, aber nur der Besitzer darf
-- seinen eigenen hochladen/ändern/löschen.
-- Konvention: Datei wird gespeichert unter "<user-id>/avatar.<endung>"
create policy "avatare_oeffentlich_lesbar" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatare_insert_eigene" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatare_update_eigene" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatare_delete_eigene" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
