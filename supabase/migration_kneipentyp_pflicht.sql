-- ============================================================
-- Migration: Kneipentyp erweitern (Alkoholfreie Bar) + Pflichtfeld
-- Im Supabase SQL Editor ausführen
-- ============================================================

-- Alte Prüfregel entfernen (Name wurde von Postgres automatisch vergeben,
-- als die Spalte ursprünglich angelegt wurde)
alter table kneipen drop constraint if exists kneipen_kneipentyp_check;

-- Bestehende Kneipen ohne Kneipentyp brauchen einen Platzhalter-Wert,
-- damit die neue NOT-NULL-Regel nicht fehlschlägt. Du kannst das später
-- pro Kneipe über "Bearbeiten" korrigieren.
update kneipen set kneipentyp = 'bar' where kneipentyp is null;

alter table kneipen alter column kneipentyp set default 'bar';
alter table kneipen alter column kneipentyp set not null;

alter table kneipen add constraint kneipen_kneipentyp_check
  check (kneipentyp in (
    'pub', 'bar', 'cocktailbar', 'sportsbar', 'biergarten',
    'club', 'brauereigaststaette', 'weinbar', 'rooftop_bar',
    'shisha_lounge', 'alkoholfreie_bar'
  ));
