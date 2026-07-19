"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/LocaleProvider";

export type KneipenFoto = { id: string; url: string };

export default function KneipenFotos({
  kneipeId,
  fotos,
  eingeloggt,
}: {
  kneipeId: string;
  fotos: KneipenFoto[];
  eingeloggt: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const { dict } = useTranslation();

  const [hochladen, setHochladen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    if (!datei) return;

    setHochladen(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(dict.ratingForm.fehlerNichtAngemeldet);
      setHochladen(false);
      return;
    }

    const endung = datei.name.split(".").pop();
    const pfad = `${kneipeId}/${user.id}/${crypto.randomUUID()}.${endung}`;

    const { error: uploadError } = await supabase.storage
      .from("kneipen-fotos")
      .upload(pfad, datei);

    if (uploadError) {
      setError(uploadError.message);
      setHochladen(false);
      return;
    }

    const { error: insertError } = await supabase.from("kneipen_fotos").insert({
      kneipe_id: kneipeId,
      hochgeladen_von: user.id,
      storage_path: pfad,
    });

    setHochladen(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    e.target.value = "";
    router.refresh();
  }

  return (
    <div>
      {fotos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {fotos.map((foto) => (
            <a
              key={foto.id}
              href={foto.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-square rounded-lg overflow-hidden border border-bar-700"
            >
              <img
                src={foto.url}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm opacity-70 mb-3">{dict.kneipeDetailExtra.keineFotos}</p>
      )}

      {eingeloggt && (
        <label className="inline-block text-xs">
          <span className="bg-brass-500 text-bar-950 font-semibold rounded-full px-3 py-1.5 cursor-pointer hover:bg-brass-400 transition-colors inline-block">
            {hochladen
              ? dict.kneipeDetailExtra.fotoWirdHochgeladen
              : dict.kneipeDetailExtra.fotoHochladen}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={hochladen}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="text-warn text-xs mt-2">{error}</p>}
    </div>
  );
}
