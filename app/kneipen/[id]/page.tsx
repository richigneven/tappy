import { createClient } from "@/lib/supabase/server";
import RatingForm from "@/components/RatingForm";
import { notFound } from "next/navigation";

export default async function KneipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: kneipe } = await supabase
    .from("kneipen")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!kneipe) notFound();

  const { data: bewertungen } = await supabase
    .from("bewertungen")
    .select("*, profiles(display_name)")
    .eq("kneipe_id", params.id)
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ratings = (bewertungen ?? []).map((b: any) => b.rating);
  const durchschnitt =
    ratings.length > 0
      ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
      : null;

  const eigeneBewertung = (bewertungen ?? []).find(
    (b: any) => b.user_id === user?.id
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display font-bold text-3xl text-brass-500 mb-1">
        {kneipe.name}
      </h1>
      {kneipe.adresse && (
        <p className="text-sm opacity-70 mb-3">{kneipe.adresse}</p>
      )}
      <p className="mb-6">
        {durchschnitt ? (
          <span className="text-brass-400 font-semibold">
            {durchschnitt} ★
          </span>
        ) : (
          <span className="opacity-70">Noch keine Bewertungen</span>
        )}{" "}
        <span className="opacity-70">
          ({ratings.length} Bewertung{ratings.length !== 1 ? "en" : ""})
        </span>
      </p>

      {kneipe.beschreibung && (
        <p className="mb-8 opacity-90">{kneipe.beschreibung}</p>
      )}

      <div className="border-t border-bar-700 pt-6 mb-8">
        <h2 className="font-display font-bold text-xl mb-4">Bewerten</h2>
        {user ? (
          <RatingForm
            kneipeId={kneipe.id}
            bestehendeBewertung={
              eigeneBewertung
                ? { rating: eigeneBewertung.rating, kommentar: eigeneBewertung.kommentar }
                : undefined
            }
          />
        ) : (
          <p className="text-sm opacity-80">
            Melde dich an, um diese Kneipe zu bewerten.
          </p>
        )}
      </div>

      <div className="border-t border-bar-700 pt-6">
        <h2 className="font-display font-bold text-xl mb-4">Bewertungen</h2>
        {bewertungen && bewertungen.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {bewertungen.map((b: any) => (
              <li key={b.id} className="bg-bar-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-brass-400">
                    {b.profiles?.display_name ?? "Anonym"}
                  </span>
                  <span className="text-sm">{b.rating} ★</span>
                </div>
                {b.kommentar && (
                  <p className="text-sm opacity-90">{b.kommentar}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm opacity-70">
            Sei die erste Person, die diese Kneipe bewertet.
          </p>
        )}
      </div>
    </div>
  );
}
