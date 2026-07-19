"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { renderToStaticMarkup } from "react-dom/server";
import type { Kneipe } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import BeerMugIcon from "@/components/BeerMugIcon";

// Standardmäßig Berlin - später durch Geolocation des Nutzers ersetzbar
const DEFAULT_CENTER: [number, number] = [52.52, 13.405];

function tappyIcon(rating?: number) {
  const label = rating ? rating.toFixed(1) : "–";
  const html = renderToStaticMarkup(
    <div className="tappy-marker">{label}</div>
  );
  return L.divIcon({
    html,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

export default function MapView({ kneipen }: { kneipen: Kneipe[] }) {
  const { dict } = useTranslation();

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={13}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {kneipen.map((kneipe) => (
        <Marker
          key={kneipe.id}
          position={[kneipe.lat, kneipe.lng]}
          icon={tappyIcon(kneipe.durchschnitts_rating)}
        >
          <Popup>
            <div className="font-display font-semibold text-base mb-1">
              {kneipe.name}
            </div>
            {kneipe.adresse && (
              <div className="text-xs opacity-80 mb-2">{kneipe.adresse}</div>
            )}
            <div className="text-xs mb-2 flex items-center gap-1.5">
              {kneipe.anzahl_bewertungen ? (
                <>
                  <BeerMugIcon gefuellt size={14} />
                  {kneipe.durchschnitts_rating?.toFixed(1)} (
                  {kneipe.anzahl_bewertungen})
                </>
              ) : (
                dict.map.keineBewertungen
              )}
            </div>
            <Link
              href={`/kneipen/${kneipe.id}`}
              className="text-brass-500 underline text-xs"
            >
              {dict.map.detailsAnsehen}
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
