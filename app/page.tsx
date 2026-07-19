import { createClient } from "@/lib/supabase/server";
import MapLoader from "@/components/MapLoader";
import type { Kneipe } from "@/lib/types";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function HomePage() {
  const supabase = createClient();
  const dict = getServerDictionary();

  // Kneipen + zugehörige Bewertungen in einem Rutsch laden
  const { data, error } = await supabase
    .from("kneipen")
    .select("*, bewertungen(rating)");

  const kneipen: Kneipe[] = (data ?? []).map((k: any) => {
    const ratings: number[] = (k.bewertungen ?? []).map((b: any) => b.rating);
    const durchschnitt =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : undefined;

    return {
      ...k,
      durchschnitts_rating: durchschnitt,
      anzahl_bewertungen: ratings.length,
    };
  });

  return (
    <div className="h-[calc(100vh-57px)] relative">
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-warn text-cream px-4 py-2 rounded-lg text-sm">
          {dict.map.ladefehler} {error.message}
        </div>
      )}
      <MapLoader kneipen={kneipen} />
    </div>
  );
}
