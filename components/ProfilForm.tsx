"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Profile, GetraenkeVorliebe } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LocaleProvider";

const VORLIEBEN_WERTE: GetraenkeVorliebe[] = [
  "bier",
  "cocktail",
  "schnaps",
  "alkoholfrei",
];

export default function ProfilForm({
  userId,
  profile,
  email,
}: {
  userId: string;
  profile: Profile | null;
  email?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const { dict } = useTranslation();

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [vorliebe, setVorliebe] = useState<GetraenkeVorliebe | "">(
    profile?.getraenke_vorliebe ?? ""
  );
  const [oeffentlich, setOeffentlich] = useState(
    profile?.profil_oeffentlich ?? true
  );
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gespeichert, setGespeichert] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGespeichert(false);

    let neueAvatarUrl = avatarUrl;

    // Falls ein neues Bild ausgewählt wurde: zuerst hochladen
    if (avatarFile) {
      const endung = avatarFile.name.split(".").pop();
      const pfad = `${userId}/avatar.${endung}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(pfad, avatarFile, { upsert: true });

      if (uploadError) {
        setError(`Bild-Upload fehlgeschlagen: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(pfad);

      // Cache-Buster anhängen, damit das neue Bild sofort angezeigt wird
      neueAvatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        getraenke_vorliebe: vorliebe || null,
        profil_oeffentlich: oeffentlich,
        avatar_url: neueAvatarUrl || null,
      })
      .eq("id", userId);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setAvatarUrl(neueAvatarUrl);
    setAvatarFile(null);
    setGespeichert(true);
    router.refresh();
  }

  const angezeigtesBild = previewUrl || avatarUrl;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {email && (
        <p className="text-sm opacity-70">
          {dict.profil.angemeldetAls}{" "}
          <span className="text-cream">{email}</span>
        </p>
      )}

      {/* Profilbild */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-bar-800 border border-bar-700 overflow-hidden flex items-center justify-center shrink-0">
          {angezeigtesBild ? (
            <Image
              src={angezeigtesBild}
              alt="Profilbild"
              width={64}
              height={64}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <span className="text-2xl">🍺</span>
          )}
        </div>
        <label className="text-sm">
          <span className="block mb-1 opacity-80">
            {dict.profil.profilbildAendern}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-brass-500 file:text-bar-950 file:font-semibold file:cursor-pointer"
          />
        </label>
      </div>

      {/* Anzeigename */}
      <label className="flex flex-col gap-1 text-sm">
        {dict.profil.anzeigename}
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
        />
      </label>

      {/* Getränke-Vorliebe */}
      <div>
        <span className="block mb-2 text-sm opacity-80">
          {dict.profil.getraenkeVorliebe}
        </span>
        <div className="flex flex-wrap gap-2">
          {VORLIEBEN_WERTE.map((wert) => (
            <button
              key={wert}
              type="button"
              onClick={() => setVorliebe(wert)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                vorliebe === wert
                  ? "bg-brass-500 border-brass-500 text-bar-950 font-semibold"
                  : "bg-transparent border-bar-700 text-cream/80 hover:border-brass-500"
              }`}
            >
              {dict.profil[wert]}
            </button>
          ))}
        </div>
      </div>

      {/* Sichtbarkeit */}
      <label className="flex items-start gap-3 text-sm bg-bar-800 border border-bar-700 rounded-lg p-3">
        <input
          type="checkbox"
          checked={oeffentlich}
          onChange={(e) => setOeffentlich(e.target.checked)}
          className="mt-0.5 accent-brass-500"
        />
        <span>
          <span className="block font-semibold">
            {dict.profil.oeffentlichTitel}
          </span>
          <span className="block opacity-70 text-xs mt-0.5">
            {dict.profil.oeffentlichText}
          </span>
        </span>
      </label>

      {error && <p className="text-warn text-sm">{error}</p>}
      {gespeichert && (
        <p className="text-felt text-sm">{dict.profil.gespeichert}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="self-start bg-brass-500 text-bar-950 font-semibold rounded-full px-5 py-2 hover:bg-brass-400 transition-colors disabled:opacity-50"
      >
        {loading ? dict.profil.buttonLoading : dict.profil.button}
      </button>
    </form>
  );
}
