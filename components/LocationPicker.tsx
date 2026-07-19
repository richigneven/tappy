"use client";

import { useState, useCallback, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useTranslation } from "@/lib/i18n/LocaleProvider";

const DEFAULT_CENTER: [number, number] = [52.52, 13.405];

const pinIcon = L.divIcon({
  html: '<div style="font-size: 28px; line-height: 1;">📍</div>',
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data?.display_name ?? null;
  } catch {
    return null;
  }
}

function KlickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Zentriert die Karte NUR, wenn sich "position" wirklich ändert (z.B. nach
// einer Suche) - nicht bei jedem Render, sonst "kämpft" die Karte gegen
// manuelle Klicks/Verschieben des Pins.
function MapZentrieren({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position?.[0], position?.[1]]);
  return null;
}

export default function LocationPicker({
  lat,
  lng,
  onChange,
  onAdresseChange,
}: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  onAdresseChange?: (adresse: string) => void;
}) {
  const { dict } = useTranslation();
  const [suchbegriff, setSuchbegriff] = useState("");
  const [ergebnisse, setErgebnisse] = useState<NominatimResult[]>([]);
  const [suchtLaeuft, setSuchtLaeuft] = useState(false);
  const [ladeAdresse, setLadeAdresse] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const position: [number, number] | null =
    lat !== null && lng !== null ? [lat, lng] : null;

  const [zentrum, setZentrum] = useState<[number, number] | null>(null);

  async function handleSuche(e: React.FormEvent) {
    e.preventDefault();
    if (!suchbegriff.trim()) return;
    setSuchtLaeuft(true);
    setFehler(null);
    setErgebnisse([]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(
          suchbegriff
        )}`
      );
      const data: NominatimResult[] = await res.json();
      setErgebnisse(data);
      if (data.length === 0) {
        setFehler(dict.locationPicker.keineErgebnisse);
      }
    } catch {
      setFehler(dict.locationPicker.suchfehler);
    } finally {
      setSuchtLaeuft(false);
    }
  }

  function ergebnisAuswaehlen(r: NominatimResult) {
    const neueLat = parseFloat(r.lat);
    const neueLng = parseFloat(r.lon);
    onChange(neueLat, neueLng);
    setZentrum([neueLat, neueLng]);
    setErgebnisse([]);
    setSuchbegriff(r.display_name);
    onAdresseChange?.(r.display_name);
  }

  // Nach Klick/Drag auf der Karte: Adresse automatisch per Reverse-Geocoding
  // nachschlagen und ins Adressfeld übernehmen.
  async function positionAendern(neueLat: number, neueLng: number) {
    onChange(neueLat, neueLng);
    if (onAdresseChange) {
      setLadeAdresse(true);
      const adresse = await reverseGeocode(neueLat, neueLng);
      setLadeAdresse(false);
      if (adresse) {
        onAdresseChange(adresse);
        setSuchbegriff(adresse);
      }
    }
  }

  const meinStandort = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const neueLat = pos.coords.latitude;
      const neueLng = pos.coords.longitude;
      setZentrum([neueLat, neueLng]);
      positionAendern(neueLat, neueLng);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSuche} className="flex gap-2">
        <input
          value={suchbegriff}
          onChange={(e) => setSuchbegriff(e.target.value)}
          placeholder={dict.locationPicker.adressePlaceholder}
          className="flex-1 bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 text-sm focus-visible:border-brass-500"
        />
        <button
          type="submit"
          disabled={suchtLaeuft}
          className="bg-brass-500 text-bar-950 font-semibold rounded-lg px-4 text-sm hover:bg-brass-400 transition-colors disabled:opacity-50 shrink-0"
        >
          {suchtLaeuft ? "…" : dict.locationPicker.suchen}
        </button>
      </form>

      {ergebnisse.length > 0 && (
        <ul className="bg-bar-800 border border-bar-700 rounded-lg overflow-hidden text-sm">
          {ergebnisse.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => ergebnisAuswaehlen(r)}
                className="block w-full text-left px-3 py-2 hover:bg-bar-700 transition-colors"
              >
                {r.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {fehler && <p className="text-warn text-xs">{fehler}</p>}
      {ladeAdresse && (
        <p className="text-xs opacity-60">{dict.locationPicker.adresseWirdGeladen}</p>
      )}

      <button
        type="button"
        onClick={meinStandort}
        className="text-xs text-brass-400 underline text-left"
      >
        {dict.locationPicker.standortVerwenden}
      </button>

      <div className="h-64 rounded-lg overflow-hidden border border-bar-700">
        <MapContainer
          center={position ?? DEFAULT_CENTER}
          zoom={position ? 16 : 12}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <KlickHandler onSelect={positionAendern} />
          <MapZentrieren position={zentrum} />
          {position && (
            <Marker
              position={position}
              icon={pinIcon}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const pos = marker.getLatLng();
                  positionAendern(pos.lat, pos.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <p className="text-xs opacity-60">{dict.locationPicker.hinweis}</p>
    </div>
  );
}
