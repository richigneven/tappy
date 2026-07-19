"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import BeerMugIcon from "@/components/BeerMugIcon";

function AspektEingabe({
  werte,
  onChange,
  label,
  placeholder,
  entfernenLabel,
}: {
  werte: string[];
  onChange: (neu: string[]) => void;
  label: string;
  placeholder: string;
  entfernenLabel: string;
}) {
  const [eingabe, setEingabe] = useState("");

  function hinzufuegen() {
    const wert = eingabe.trim();
    if (!wert || werte.length >= 3 || werte.includes(wert)) return;
    onChange([...werte, wert]);
    setEingabe("");
  }

  return (
    <div>
      <span className="block mb-1.5 text-xs opacity-80">{label}</span>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {werte.map((w) => (
          <span
            key={w}
            className="inline-flex items-center gap-1 bg-bar-700 border border-bar-700 rounded-full pl-2.5 pr-1 py-1 text-xs"
          >
            {w}
            <button
              type="button"
              onClick={() => onChange(werte.filter((x) => x !== w))}
              aria-label={entfernenLabel}
              className="opacity-60 hover:opacity-100 px-1"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      {werte.length < 3 && (
        <input
          value={eingabe}
          onChange={(e) => setEingabe(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              hinzufuegen();
            }
          }}
          onBlur={hinzufuegen}
          placeholder={placeholder}
          className="w-full bg-bar-800 border border-bar-700 rounded-lg px-3 py-1.5 text-xs focus-visible:border-brass-500"
        />
      )}
    </div>
  );
}

export default function RatingForm({
  kneipeId,
  bestehendeBewertung,
}: {
  kneipeId: string;
  bestehendeBewertung?: {
    rating: number;
    kommentar: string | null;
    positive_aspekte?: string[];
    negative_aspekte?: string[];
  };
}) {
  const router = useRouter();
  const supabase = createClient();
  const { dict } = useTranslation();

  const [rating, setRating] = useState(bestehendeBewertung?.rating ?? 0);
  const [kommentar, setKommentar] = useState(
    bestehendeBewertung?.kommentar ?? ""
  );
  const [positiveAspekte, setPositiveAspekte] = useState<string[]>(
    bestehendeBewertung?.positive_aspekte ?? []
  );
  const [negativeAspekte, setNegativeAspekte] = useState<string[]>(
    bestehendeBewertung?.negative_aspekte ?? []
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError(dict.ratingForm.fehlerKeineAuswahl);
      return;
    }
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(dict.ratingForm.fehlerNichtAngemeldet);
      setLoading(false);
      return;
    }

    // upsert: legt neu an oder überschreibt die eigene Bewertung
    const { error } = await supabase.from("bewertungen").upsert(
      {
        kneipe_id: kneipeId,
        user_id: user.id,
        rating,
        kommentar,
        positive_aspekte: positiveAspekte,
        negative_aspekte: negativeAspekte,
      },
      { onConflict: "kneipe_id,user_id" }
    );

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-1" role="radiogroup" aria-label="Bewertung">
        {[1, 2, 3, 4, 5].map((wert) => (
          <button
            key={wert}
            type="button"
            role="radio"
            aria-checked={rating === wert}
            onClick={() => setRating(wert)}
            title={`${wert} / 5`}
            className={`transition-colors ${
              wert <= rating
                ? "text-brass-500"
                : "text-cream/30 hover:text-brass-400"
            }`}
          >
            <BeerMugIcon gefuellt={wert <= rating} />
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <AspektEingabe
          werte={positiveAspekte}
          onChange={setPositiveAspekte}
          label={dict.ratingForm.positiveAspekteLabel}
          placeholder={dict.ratingForm.aspektPlaceholder}
          entfernenLabel={dict.ratingForm.aspektEntfernen}
        />
        <AspektEingabe
          werte={negativeAspekte}
          onChange={setNegativeAspekte}
          label={dict.ratingForm.negativeAspekteLabel}
          placeholder={dict.ratingForm.aspektPlaceholder}
          entfernenLabel={dict.ratingForm.aspektEntfernen}
        />
      </div>

      <textarea
        value={kommentar}
        onChange={(e) => setKommentar(e.target.value)}
        rows={2}
        placeholder={dict.ratingForm.kommentarPlaceholder}
        className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 text-sm focus-visible:border-brass-500"
      />

      {error && <p className="text-warn text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start bg-brass-500 text-bar-950 font-semibold rounded-full px-4 py-1.5 text-sm hover:bg-brass-400 transition-colors disabled:opacity-50"
      >
        {loading
          ? dict.ratingForm.buttonLoading
          : bestehendeBewertung
          ? dict.ratingForm.buttonAktualisieren
          : dict.ratingForm.buttonNeu}
      </button>
    </form>
  );
}
