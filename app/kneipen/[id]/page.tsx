import { createClient } from "@/lib/supabase/server";
import RatingForm from "@/components/RatingForm";
import { notFound } from "next/navigation";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function KneipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const dict = getServerDictionary();

  const { data: kneipe } = await supabase
    .from("kneipen")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!kneipe) notFound();

  const { data: bewertungen } = await supabase
    .from("bewertungen")
    .select("*, profiles(display_name, avatar_url, profil_oeffentlich)")
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
          <span className="opacity-70">{dict.kneipeDetail.keineBewertungen}</span>
        )}{" "}
        <span className="opacity-70">
          ({ratings.length}{" "}
          {ratings.length === 1
            ? dict.kneipeDetail.bewertungEinzahl
            : dict.kneipeDetail.bewertungMehrzahl}
          )
        </span>
      </p>

      {kneipe.beschreibung && (
        <p className="mb-8 opacity-90">{kneipe.beschreibung}</p>
      )}

      <div className="border-t border-bar-700 pt-6 mb-8">
        <h2 className="font-display font-bold text-xl mb-4">
          {dict.kneipeDetail.bewertenTitel}
        </h2>
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
          <p className="text-sm opacity-80">{dict.kneipeDetail.bitteAnmelden}</p>
        )}
      </div>

      <div className="border-t border-bar-700 pt-6">
        <h2 className="font-display font-bold text-xl mb-4">
          {dict.kneipeDetail.bewertungenTitel}
        </h2>
        {bewertungen && bewertungen.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {bewertungen.map((b: any) => {
              const istOeffentlich = b.profiles?.profil_oeffentlich === true;
              const anzeigeName = istOeffentlich
                ? b.profiles?.display_name ?? dict.kneipeDetail.anonym
                : dict.kneipeDetail.anonym;

              return (
                <li key={b.id} className="bg-bar-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-2 font-semibold text-brass-400">
                      {istOeffentlich && b.profiles?.avatar_url && (
                        <img
                          src={b.profiles.avatar_url}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      {anzeigeName}
                    </span>
                    <span className="text-sm">{b.rating} ★</span>
                  </div>
                  {b.kommentar && (
                    <p className="text-sm opacity-90">{b.kommentar}</p>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm opacity-70">{dict.kneipeDetail.ersteBewertung}</p>
        )}
      </div>
    </div>
  );
}
