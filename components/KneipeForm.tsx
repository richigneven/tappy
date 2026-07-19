"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import LocationPickerLoader from "@/components/LocationPickerLoader";
import OeffnungszeitenEditor from "@/components/OeffnungszeitenEditor";
import type {
  Kneipe,
  Preisklasse,
  Kneipentyp,
  Getraenkeart,
  Zahlungsoption,
  Annehmlichkeit,
  EntertainmentOption,
  Oeffnungszeiten,
} from "@/lib/types";

const PREISKLASSEN: Preisklasse[] = ["$", "$$", "$$$"];
const KNEIPENTYPEN: Kneipentyp[] = [
  "pub",
  "bar",
  "cocktailbar",
  "sportsbar",
  "biergarten",
  "club",
  "brauereigaststaette",
  "weinbar",
  "rooftop_bar",
  "shisha_lounge",
  "alkoholfreie_bar",
];
const GETRAENKEARTEN: Getraenkeart[] = [
  "flaschenbier",
  "gezapftes_bier",
  "wein",
  "cocktails",
  "mocktails",
  "tagesangebote",
  "alkoholfrei",
];
const ZAHLUNGSOPTIONEN: Zahlungsoption[] = [
  "bargeld",
  "kreditkarte",
  "debitkarte",
  "mobile_payment",
];
const ANNEHMLICHKEITEN: Annehmlichkeit[] = [
  "sitzplaetze_draussen",
  "barrierearm",
  "wlan",
];
const ENTERTAINMENT_OPTIONEN: EntertainmentOption[] = [
  "live_musik",
  "kicker",
  "dart",
  "billard",
  "quiz_public_viewing",
];

function toggleInArray<T>(arr: T[], wert: T): T[] {
  return arr.includes(wert) ? arr.filter((w) => w !== wert) : [...arr, wert];
}

export default function KneipeForm({
  modus,
  kneipeId,
  initialData,
}: {
  modus: "neu" | "bearbeiten";
  kneipeId?: string;
  initialData?: Partial<Kneipe>;
}) {
  const router = useRouter();
  const supabase = createClient();
  const { dict } = useTranslation();

  const [name, setName] = useState(initialData?.name ?? "");
  const [adresse, setAdresse] = useState(initialData?.adresse ?? "");
  const [lat, setLat] = useState<number | null>(initialData?.lat ?? null);
  const [lng, setLng] = useState<number | null>(initialData?.lng ?? null);
  const [beschreibung, setBeschreibung] = useState(
    initialData?.beschreibung ?? ""
  );
  const [preisklasse, setPreisklasse] = useState<Preisklasse>(
    initialData?.preisklasse ?? "$$"
  );
  const [kneipentyp, setKneipentyp] = useState<Kneipentyp | "">(
    initialData?.kneipentyp ?? ""
  );
  const [getraenkearten, setGetraenkearten] = useState<Getraenkeart[]>(
    initialData?.getraenkearten ?? []
  );
  const [zahlungsoptionen, setZahlungsoptionen] = useState<Zahlungsoption[]>(
    initialData?.zahlungsoptionen ?? []
  );
  const [annehmlichkeiten, setAnnehmlichkeiten] = useState<Annehmlichkeit[]>(
    initialData?.annehmlichkeiten ?? []
  );
  const [snacksVorhanden, setSnacksVorhanden] = useState(
    initialData?.snacks_vorhanden ?? false
  );
  const [entertainmentVorhanden, setEntertainmentVorhanden] = useState(
    initialData?.entertainment_vorhanden ?? false
  );
  const [entertainmentOptionen, setEntertainmentOptionen] = useState<
    EntertainmentOption[]
  >(initialData?.entertainment_optionen ?? []);
  const [entertainmentSonstiges, setEntertainmentSonstiges] = useState(
    initialData?.entertainment_sonstiges ?? ""
  );
  const [oeffnungszeiten, setOeffnungszeiten] = useState<Oeffnungszeiten>(
    initialData?.oeffnungszeiten ?? {}
  );
  const [webseite, setWebseite] = useState(initialData?.webseite ?? "");
  const [instagram, setInstagram] = useState(initialData?.instagram ?? "");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (lat === null || lng === null) {
      setError(dict.kneipeForm.fehlerStandort);
      return;
    }

    if (!kneipentyp) {
      setError(dict.kneipeForm.fehlerKneipentyp);
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(dict.ratingForm.fehlerNichtAngemeldet);
      setLoading(false);
      return;
    }

    const payload = {
      name,
      adresse,
      lat,
      lng,
      beschreibung,
      preisklasse,
      kneipentyp,
      getraenkearten,
      zahlungsoptionen,
      annehmlichkeiten,
      snacks_vorhanden: snacksVorhanden,
      entertainment_vorhanden: entertainmentVorhanden,
      entertainment_optionen: entertainmentVorhanden ? entertainmentOptionen : [],
      entertainment_sonstiges: entertainmentVorhanden
        ? entertainmentSonstiges
        : null,
      oeffnungszeiten,
      webseite,
      instagram,
    };

    const { data: gespeichert, error } =
      modus === "neu"
        ? await supabase
            .from("kneipen")
            .insert({ ...payload, erstellt_von: user.id })
            .select()
            .single()
        : await supabase
            .from("kneipen")
            .update(payload)
            .eq("id", kneipeId)
            .select()
            .single();

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(`/kneipen/${gespeichert.id}`);
    router.refresh();
  }

  function CheckboxGruppe<T extends string>({
    optionen,
    ausgewaehlt,
    onToggle,
    labels,
  }: {
    optionen: T[];
    ausgewaehlt: T[];
    onToggle: (wert: T) => void;
    labels: Record<string, string>;
  }) {
    return (
      <div className="flex flex-wrap gap-2">
        {optionen.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              ausgewaehlt.includes(opt)
                ? "bg-brass-500 border-brass-500 text-bar-950 font-semibold"
                : "bg-transparent border-bar-700 text-cream/80 hover:border-brass-500"
            }`}
          >
            {labels[opt]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Name */}
      <label className="flex flex-col gap-1 text-sm">
        {dict.kneipeNeu.name}
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
        />
      </label>

      {/* Standort */}
      <div>
        <span className="block mb-2 text-sm opacity-80">
          {dict.kneipeForm.standortLabel}
        </span>
        <LocationPickerLoader
          lat={lat}
          lng={lng}
          onChange={(neuLat, neuLng) => {
            setLat(neuLat);
            setLng(neuLng);
          }}
        />
      </div>

      {/* Adresse (Freitext, optional zusätzlich zur Karte) */}
      <label className="flex flex-col gap-1 text-sm">
        {dict.kneipeNeu.adresse}
        <input
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          placeholder={dict.kneipeNeu.adressePlaceholder}
          className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
        />
      </label>

      {/* Preisklasse */}
      <div>
        <span className="block mb-2 text-sm opacity-80">
          {dict.kneipeForm.preisklasseLabel}
        </span>
        <div className="flex gap-2">
          {PREISKLASSEN.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPreisklasse(p)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                preisklasse === p
                  ? "bg-brass-500 border-brass-500 text-bar-950 font-semibold"
                  : "bg-transparent border-bar-700 text-cream/80 hover:border-brass-500"
              }`}
            >
              {dict.optionen.preisklasse[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Kneipentyp */}
      <div>
        <span className="block mb-2 text-sm opacity-80">
          {dict.kneipeForm.kneipentypLabel}
        </span>
        <div className="flex flex-wrap gap-2">
          {KNEIPENTYPEN.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setKneipentyp(t)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                kneipentyp === t
                  ? "bg-brass-500 border-brass-500 text-bar-950 font-semibold"
                  : "bg-transparent border-bar-700 text-cream/80 hover:border-brass-500"
              }`}
            >
              {dict.optionen.kneipentyp[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Getränkearten */}
      <div>
        <span className="block mb-2 text-sm opacity-80">
          {dict.kneipeForm.getraenkeLabel}
        </span>
        <CheckboxGruppe
          optionen={GETRAENKEARTEN}
          ausgewaehlt={getraenkearten}
          onToggle={(w) => setGetraenkearten(toggleInArray(getraenkearten, w))}
          labels={dict.optionen.getraenkearten}
        />
      </div>

      {/* Zahlungsoptionen */}
      <div>
        <span className="block mb-2 text-sm opacity-80">
          {dict.kneipeForm.zahlungLabel}
        </span>
        <CheckboxGruppe
          optionen={ZAHLUNGSOPTIONEN}
          ausgewaehlt={zahlungsoptionen}
          onToggle={(w) =>
            setZahlungsoptionen(toggleInArray(zahlungsoptionen, w))
          }
          labels={dict.optionen.zahlungsoptionen}
        />
      </div>

      {/* Annehmlichkeiten */}
      <div>
        <span className="block mb-2 text-sm opacity-80">
          {dict.kneipeForm.annehmlichkeitenLabel}
        </span>
        <CheckboxGruppe
          optionen={ANNEHMLICHKEITEN}
          ausgewaehlt={annehmlichkeiten}
          onToggle={(w) =>
            setAnnehmlichkeiten(toggleInArray(annehmlichkeiten, w))
          }
          labels={dict.optionen.annehmlichkeiten}
        />
      </div>

      {/* Snacks */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={snacksVorhanden}
          onChange={(e) => setSnacksVorhanden(e.target.checked)}
          className="accent-brass-500"
        />
        {dict.kneipeForm.snacksLabel}
      </label>

      {/* Entertainment */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={entertainmentVorhanden}
            onChange={(e) => setEntertainmentVorhanden(e.target.checked)}
            className="accent-brass-500"
          />
          {dict.kneipeForm.entertainmentLabel}
        </label>

        {entertainmentVorhanden && (
          <div className="pl-6 flex flex-col gap-3">
            <CheckboxGruppe
              optionen={ENTERTAINMENT_OPTIONEN}
              ausgewaehlt={entertainmentOptionen}
              onToggle={(w) =>
                setEntertainmentOptionen(toggleInArray(entertainmentOptionen, w))
              }
              labels={dict.optionen.entertainmentOptionen}
            />
            <input
              value={entertainmentSonstiges}
              onChange={(e) => setEntertainmentSonstiges(e.target.value)}
              placeholder={dict.kneipeForm.entertainmentSonstigesPlaceholder}
              className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 text-sm focus-visible:border-brass-500"
            />
          </div>
        )}
      </div>

      {/* Öffnungszeiten */}
      <div>
        <span className="block mb-2 text-sm opacity-80">
          {dict.kneipeForm.oeffnungszeitenLabel}
        </span>
        <OeffnungszeitenEditor
          value={oeffnungszeiten}
          onChange={setOeffnungszeiten}
        />
      </div>

      {/* Webseite / Instagram */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          {dict.kneipeForm.webseiteLabel}
          <input
            type="url"
            value={webseite}
            onChange={(e) => setWebseite(e.target.value)}
            placeholder="https://…"
            className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {dict.kneipeForm.instagramLabel}
          <input
            type="url"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="https://instagram.com/…"
            className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
          />
        </label>
      </div>

      {/* Beschreibung */}
      <label className="flex flex-col gap-1 text-sm">
        {dict.kneipeNeu.beschreibung}
        <textarea
          value={beschreibung}
          onChange={(e) => setBeschreibung(e.target.value)}
          rows={3}
          className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
        />
      </label>

      {error && <p className="text-warn text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-brass-500 text-bar-950 font-semibold rounded-full py-2 mt-2 hover:bg-brass-400 transition-colors disabled:opacity-50"
      >
        {loading
          ? dict.kneipeNeu.buttonLoading
          : modus === "neu"
          ? dict.kneipeNeu.button
          : dict.kneipeForm.buttonAktualisieren}
      </button>
    </form>
  );
}
