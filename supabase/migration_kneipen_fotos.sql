-- ============================================================
-- Migration: Kneipen-Fotos (Phase B)
-- Im Supabase SQL Editor ausführen
-- ============================================================

create table if not exists kneipen_fotos (
  id uuid default gen_random_uuid() primary key,
  kneipe_id uuid references kneipen(id) on delete cascade not null,
  hochgeladen_von uuid references profiles(id),
  storage_path text not null,
  created_at timestamptz default now()
);

alter table kneipen_fotos enable row level security;

create policy "kneipen_fotos_select_all" on kneipen_fotos
  for select using (true);

create policy "kneipen_fotos_insert_eigene" on kneipen_fotos
  for insert with check (auth.uid() = hochgeladen_von);

create policy "kneipen_fotos_delete_eigene" on kneipen_fotos
  for delete using (auth.uid() = hochgeladen_von);

-- ============================================================
-- Storage Bucket "kneipen-fotos" manuell anlegen:
--   Storage → New bucket → Name: "kneipen-fotos" → Public bucket: AN
-- Danach erst die Policies unten ausführen.
-- ============================================================

create policy "kneipen_fotos_storage_select" on storage.objects
  for select using (bucket_id = 'kneipen-fotos');

create policy "kneipen_fotos_storage_insert" on storage.objects
  for insert with check (
    bucket_id = 'kneipen-fotos' and auth.uid() is not null
  );

create policy "kneipen_fotos_storage_delete" on storage.objects
  for delete using (
    bucket_id = 'kneipen-fotos'
    and auth.uid()::text = (storage.foldername(name))[2]
  );
