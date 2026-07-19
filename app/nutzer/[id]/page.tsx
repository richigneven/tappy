import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function OeffentlichesProfilPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const dict = getServerDictionary();

  const { data: profil } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  // Kein Ergebnis heißt entweder: existiert nicht, ODER: ist privat.
  // Wir unterscheiden das bewusst nicht (keine Info-Preisgabe über Existenz).
  if (!profil) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="opacity-80">{dict.nutzerProfil.privat}</p>
      </div>
    );
  }

  const { data: kneipen } = await supabase
    .from("kneipen")
    .select("id, name, adresse")
    .eq("erstellt_von", params.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-bar-800 border border-bar-700 overflow-hidden flex items-center justify-center shrink-0">
          {profil.avatar_url ? (
            <img
              src={profil.avatar_url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">🍺</span>
          )}
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-brass-500">
            {profil.display_name ?? dict.kneipeDetail.anonym}
          </h1>
          {profil.getraenke_vorliebe && (
            <p className="text-sm opacity-70">
              {dict.profil[profil.getraenke_vorliebe as "bier" | "cocktail" | "schnaps" | "alkoholfrei"]}
            </p>
          )}
        </div>
      </div>

      <h2 className="font-display font-bold text-xl mb-4">
        {dict.nutzerProfil.eingetrageneKneipen}
      </h2>
      {kneipen && kneipen.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {kneipen.map((k) => (
            <li key={k.id}>
              <Link
                href={`/kneipen/${k.id}`}
                className="block bg-bar-800 border border-bar-700 rounded-lg px-4 py-3 hover:border-brass-500 transition-colors"
              >
                <span className="font-semibold text-brass-400">{k.name}</span>
                {k.adresse && (
                  <span className="block text-xs opacity-70">{k.adresse}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm opacity-70">{dict.nutzerProfil.keineKneipen}</p>
      )}
    </div>
  );
}
