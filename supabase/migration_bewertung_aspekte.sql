-- ============================================================
-- Migration: Pro/Contra-Stichpunkte bei Bewertungen (Phase C)
-- Im Supabase SQL Editor ausführen
-- ============================================================

alter table bewertungen add column if not exists positive_aspekte text[]
  not null default '{}'
  check (array_length(positive_aspekte, 1) is null or array_length(positive_aspekte, 1) <= 3);

alter table bewertungen add column if not exists negative_aspekte text[]
  not null default '{}'
  check (array_length(negative_aspekte, 1) is null or array_length(negative_aspekte, 1) <= 3);
