# Tappy 🍺

Kneipen in deiner Umgebung finden, eintragen und bewerten.

## Stack

- **Next.js 14** (App Router) – Frontend & Server-Logik
- **Supabase** – Datenbank (Postgres), Login/Registrierung
- **Leaflet** – Karte
- **Tailwind CSS** – Styling
- **Vercel** – Hosting (Live + automatische Test-Umgebungen)

## Setup

### 1. Supabase-Projekt einrichten

1. Auf [supabase.com](https://supabase.com) einloggen (per GitHub) und neues Projekt "tappy" anlegen.
2. Im Projekt: **SQL Editor** öffnen, neuen Query anlegen, den kompletten Inhalt von
   [`supabase/schema.sql`](./supabase/schema.sql) einfügen und ausführen.
   Das legt alle Tabellen (`profiles`, `kneipen`, `bewertungen`) und die
   Sicherheitsregeln (Row Level Security) an.
3. Unter **Project Settings > API** findest du:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Unter **Authentication > URL Configuration**: Die Site URL und
   `Redirect URLs` später auf deine Vercel-Domain(s) setzen (siehe unten),
   damit die Bestätigungs-Mail nach der Registrierung richtig weiterleitet.

### 2. Lokale Entwicklung

```bash
npm install
cp .env.local.example .env.local
# .env.local mit deinen echten Supabase-Werten befüllen
npm run dev
```

App läuft dann auf http://localhost:3000

### 3. GitHub

Dieses Projekt in dein bestehendes Repo (Branch `dev`) pushen:

```bash
git add .
git commit -m "Tappy Grundgerüst"
git push origin dev
```

### 4. Vercel verbinden

1. Auf [vercel.com](https://vercel.com) einloggen (per GitHub).
2. "Add New Project" → dein Tappy-Repo auswählen.
3. Unter **Environment Variables** die gleichen zwei Werte wie in `.env.local`
   eintragen (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Als **Production Branch** `main` einstellen.
5. Deployen. Danach gilt automatisch:
   - Push auf `main` → Live-URL
   - Push auf `dev` (oder jeder Pull Request) → eigene Vorschau-URL, die
     Vercel dir automatisch in GitHub verlinkt

### 5. Supabase Redirect URLs ergänzen

Sobald du die Vercel-URLs kennst, unter **Authentication > URL Configuration**
in Supabase ergänzen:
- `https://DEINE-LIVE-URL.vercel.app/auth/callback`
- `https://DEINE-PREVIEW-URL.vercel.app/auth/callback` (bzw. ein Wildcard-Muster)

## Projektstruktur

```
app/
  page.tsx              Startseite mit Karte
  login/                Login
  register/             Registrierung
  kneipen/neu/           Neue Kneipe eintragen
  kneipen/[id]/          Detailseite mit Bewertungen
  auth/callback/         E-Mail-Bestätigung
components/              UI-Bausteine (Karte, Formulare, Navbar)
lib/supabase/            Supabase-Clients (Browser/Server/Middleware)
supabase/schema.sql       Datenbank-Schema + Sicherheitsregeln
```

## Nächste sinnvolle Schritte

- Nutzer-Standort automatisch als Kartenmittelpunkt verwenden
- Fotos zu Kneipen hochladen (Supabase Storage)
- Auszahlungslogik für eingetragene Kneipen (separates Modul, rechtliche
  Prüfung vorher empfohlen: KYC, Steuerpflichten der Empfänger)
- Suche/Filter (z. B. nach Öffnungszeiten, Getränkeauswahl)
