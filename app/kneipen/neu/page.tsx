"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/LocaleProvider";

export default function NeueKneipePage() {
  const router = useRouter();
  const supabase = createClient();
  const { dict } = useTranslation();

  const [name, setName] = useState("");
  const [adresse, setAdresse] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function useMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setLat(pos.coords.latitude.toFixed(6));
      setLng(pos.coords.longitude.toFixed(6));
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

    const { error } = await supabase.from("kneipen").insert({
      name,
      adresse,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      beschreibung,
      erstellt_von: user.id,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="font-display font-bold text-3xl text-brass-500 mb-2">
        {dict.kneipeNeu.titel}
      </h1>
      <p className="text-sm opacity-80 mb-6">
        {dict.kneipeNeu.beschreibungstext}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          {dict.kneipeNeu.name}
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          {dict.kneipeNeu.adresse}
          <input
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder={dict.kneipeNeu.adressePlaceholder}
            className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm">
            {dict.kneipeNeu.lat}
            <input
              required
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="52.5200"
              className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            {dict.kneipeNeu.lng}
            <input
              required
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="13.4050"
              className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={useMyLocation}
          className="text-xs text-brass-400 underline text-left"
        >
          {dict.kneipeNeu.standortVerwenden}
        </button>

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
          {loading ? dict.kneipeNeu.buttonLoading : dict.kneipeNeu.button}
        </button>
      </form>
    </div>
  );
}
