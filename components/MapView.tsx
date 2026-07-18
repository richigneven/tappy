"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { renderToStaticMarkup } from "react-dom/server";
import type { Kneipe } from "@/lib/types";

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
            <div className="text-xs mb-2">
              {kneipe.anzahl_bewertungen
                ? `${kneipe.durchschnitts_rating?.toFixed(1)} ★ (${
                    kneipe.anzahl_bewertungen
                  } Bewertungen)`
                : "Noch keine Bewertungen"}
            </div>
            <Link
              href={`/kneipen/${kneipe.id}`}
              className="text-brass-500 underline text-xs"
            >
              Details ansehen
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
