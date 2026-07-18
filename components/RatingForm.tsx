"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RatingForm({
  kneipeId,
  bestehendeBewertung,
}: {
  kneipeId: string;
  bestehendeBewertung?: { rating: number; kommentar: string | null };
}) {
  const router = useRouter();
  const supabase = createClient();

  const [rating, setRating] = useState(bestehendeBewertung?.rating ?? 0);
  const [kommentar, setKommentar] = useState(
    bestehendeBewertung?.kommentar ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Bitte wähl eine Bewertung von 1 bis 5 Zapfhähnen.");
      return;
    }
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Du musst angemeldet sein.");
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-1" role="radiogroup" aria-label="Bewertung">
        {[1, 2, 3, 4, 5].map((wert) => (
          <button
            key={wert}
            type="button"
            role="radio"
            aria-checked={rating === wert}
            onClick={() => setRating(wert)}
            className={`w-9 h-9 rounded-full border text-sm font-semibold transition-colors ${
              wert <= rating
                ? "bg-brass-500 border-brass-500 text-bar-950"
                : "bg-transparent border-bar-700 text-cream/60 hover:border-brass-500"
            }`}
            title={`${wert} von 5`}
          >
            {wert}
          </button>
        ))}
      </div>

      <textarea
        value={kommentar}
        onChange={(e) => setKommentar(e.target.value)}
        rows={2}
        placeholder="Was macht diese Kneipe aus? (optional)"
        className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 text-sm focus-visible:border-brass-500"
      />

      {error && <p className="text-warn text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start bg-brass-500 text-bar-950 font-semibold rounded-full px-4 py-1.5 text-sm hover:bg-brass-400 transition-colors disabled:opacity-50"
      >
        {loading
          ? "Wird gespeichert …"
          : bestehendeBewertung
          ? "Bewertung aktualisieren"
          : "Bewertung abgeben"}
      </button>
    </form>
  );
}
