-- ============================================================
-- Migration: Kneipen-Erweiterung (Phase A)
-- Im Supabase SQL Editor ausführen
-- ============================================================

alter table kneipen add column if not exists preisklasse text
  not null default '$$' check (preisklasse in ('$', '$$', '$$$'));

alter table kneipen add column if not exists kneipentyp text
  check (kneipentyp in (
    'pub', 'bar', 'cocktailbar', 'sportsbar', 'biergarten',
    'club', 'brauereigaststaette', 'weinbar', 'rooftop_bar', 'shisha_lounge'
  ));

alter table kneipen add column if not exists getraenkearten text[]
  not null default '{}'
  check (getraenkearten <@ array[
    'flaschenbier', 'gezapftes_bier', 'wein', 'cocktails',
    'mocktails', 'tagesangebote', 'alkoholfrei'
  ]::text[]);

alter table kneipen add column if not exists zahlungsoptionen text[]
  not null default '{}'
  check (zahlungsoptionen <@ array[
    'bargeld', 'kreditkarte', 'debitkarte', 'mobile_payment'
  ]::text[]);

alter table kneipen add column if not exists annehmlichkeiten text[]
  not null default '{}'
  check (annehmlichkeiten <@ array[
    'sitzplaetze_draussen', 'barrierearm', 'wlan'
  ]::text[]);

alter table kneipen add column if not exists snacks_vorhanden boolean not null default false;

alter table kneipen add column if not exists entertainment_vorhanden boolean not null default false;

alter table kneipen add column if not exists entertainment_optionen text[]
  not null default '{}'
  check (entertainment_optionen <@ array[
    'live_musik', 'kicker', 'dart', 'billard', 'quiz_public_viewing'
  ]::text[]);

alter table kneipen add column if not exists entertainment_sonstiges text;

-- Öffnungszeiten als flexibles JSON: { "montag": {"geschlossen": false, "von": "17:00", "bis": "01:00"}, ... }
alter table kneipen add column if not exists oeffnungszeiten jsonb;

alter table kneipen add column if not exists webseite text;
alter table kneipen add column if not exists instagram text;

-- Fehlende Regel nachtragen: bisher konnte niemand seine eigene Kneipe
-- bearbeiten (es gab nur eine INSERT-Regel, keine UPDATE-Regel).
drop policy if exists "kneipen_update_own" on kneipen;
create policy "kneipen_update_own" on kneipen
  for update using (auth.uid() = erstellt_von);
