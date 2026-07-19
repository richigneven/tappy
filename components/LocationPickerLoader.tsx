"use client";

import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-64 rounded-lg border border-bar-700 bg-bar-800 flex items-center justify-center text-sm text-brass-400">
      …
    </div>
  ),
});

export default function LocationPickerLoader(props: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  return <LocationPicker {...props} />;
}
