import { createClient } from "@/lib/supabase/server";
import RatingForm from "@/components/RatingForm";
import RouteButton from "@/components/RouteButton";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerDictionary } from "@/lib/i18n/server";

const WOCHENTAGE = [
  "montag",
  "dienstag",
  "mittwoch",
  "donnerstag",
  "freitag",
  "samstag",
  "sonntag",
] as const;

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

  const istEigentuemer = user?.id === kneipe.erstellt_von;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between gap-4 mb-1">
        <h1 className="font-display font-bold text-3xl text-brass-500">
          {kneipe.name}
        </h1>
        {istEigentuemer && (
          <Link
            href={`/kneipen/${kneipe.id}/bearbeiten`}
            className="text-xs text-brass-400 underline shrink-0 mt-2"
          >
            {dict.kneipeDetailExtra.bearbeiten}
          </Link>
        )}
      </div>
      {kneipe.adresse && (
        <p className="text-sm opacity-70 mb-3">{kneipe.adresse}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm bg-bar-800 border border-bar-700 rounded-full px-3 py-1">
          {dict.optionen.preisklasse[kneipe.preisklasse as "$" | "$$" | "$$$"]}
        </span>
        {kneipe.kneipentyp && (
          <span className="text-sm bg-bar-800 border border-bar-700 rounded-full px-3 py-1">
            {dict.optionen.kneipentyp[kneipe.kneipentyp as keyof typeof dict.optionen.kneipentyp]}
          </span>
        )}
        <RouteButton lat={kneipe.lat} lng={kneipe.lng} />
      </div>

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

      <div className="grid sm:grid-cols-2 gap-6 mb-8 text-sm">
        {kneipe.getraenkearten?.length > 0 && (
          <div>
            <h3 className="opacity-60 text-xs uppercase tracking-wide mb-1">
              {dict.kneipeForm.getraenkeLabel}
            </h3>
            <p>
              {kneipe.getraenkearten
                .map((g: string) => dict.optionen.getraenkearten[g as keyof typeof dict.optionen.getraenkearten])
                .join(", ")}
            </p>
          </div>
        )}

        {kneipe.zahlungsoptionen?.length > 0 && (
          <div>
            <h3 className="opacity-60 text-xs uppercase tracking-wide mb-1">
              {dict.kneipeForm.zahlungLabel}
            </h3>
            <p>
              {kneipe.zahlungsoptionen
                .map((z: string) => dict.optionen.zahlungsoptionen[z as keyof typeof dict.optionen.zahlungsoptionen])
                .join(", ")}
            </p>
          </div>
        )}

        {kneipe.annehmlichkeiten?.length > 0 && (
          <div>
            <h3 className="opacity-60 text-xs uppercase tracking-wide mb-1">
              {dict.kneipeForm.annehmlichkeitenLabel}
            </h3>
            <p>
              {kneipe.annehmlichkeiten
                .map((a: string) => dict.optionen.annehmlichkeiten[a as keyof typeof dict.optionen.annehmlichkeiten])
                .join(", ")}
            </p>
          </div>
        )}

        {(kneipe.snacks_vorhanden || kneipe.entertainment_vorhanden) && (
          <div>
            <h3 className="opacity-60 text-xs uppercase tracking-wide mb-1">
              {dict.kneipeDetailExtra.entertainment}
            </h3>
            <p>
              {kneipe.snacks_vorhanden && <>🍿 {dict.kneipeDetailExtra.snacksVorhanden}<br /></>}
              {kneipe.entertainment_vorhanden && (
                <>
                  🎮{" "}
                  {[
                    ...(kneipe.entertainment_optionen ?? []).map(
                      (o: string) => dict.optionen.entertainmentOptionen[o as keyof typeof dict.optionen.entertainmentOptionen]
                    ),
                    kneipe.entertainment_sonstiges,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </>
              )}
            </p>
          </div>
        )}

        {kneipe.oeffnungszeiten &&
          Object.keys(kneipe.oeffnungszeiten).length > 0 && (
            <div>
              <h3 className="opacity-60 text-xs uppercase tracking-wide mb-1">
                {dict.kneipeForm.oeffnungszeitenLabel}
              </h3>
              <ul>
                {WOCHENTAGE.map((tag) => {
                  const eintrag = kneipe.oeffnungszeiten?.[tag];
                  if (!eintrag) return null;
                  return (
                    <li key={tag} className="flex justify-between gap-4">
                      <span className="opacity-70">
                        {dict.oeffnungszeiten[tag]}
                      </span>
                      <span>
                        {eintrag.geschlossen
                          ? dict.oeffnungszeiten.geschlossen
                          : `${eintrag.von ?? "?"} – ${eintrag.bis ?? "?"}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

        {(kneipe.webseite || kneipe.instagram) && (
          <div>
            <h3 className="opacity-60 text-xs uppercase tracking-wide mb-1">
              Links
            </h3>
            <div className="flex flex-col gap-1">
              {kneipe.webseite && (
                <a
                  href={kneipe.webseite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brass-400 underline"
                >
                  {dict.kneipeForm.webseiteLabel}
                </a>
              )}
              {kneipe.instagram && (
                <a
                  href={kneipe.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brass-400 underline"
                >
                  {dict.kneipeForm.instagramLabel}
                </a>
              )}
            </div>
          </div>
        )}
      </div>

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
