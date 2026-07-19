"use client";

import { useTranslation } from "@/lib/i18n/LocaleProvider";
import type { Oeffnungszeiten, Oeffnungstag } from "@/lib/types";

const TAGE = [
  "montag",
  "dienstag",
  "mittwoch",
  "donnerstag",
  "freitag",
  "samstag",
  "sonntag",
] as const;

const STANDARD_ZEITEN: Oeffnungstag = {
  geschlossen: false,
  von: "17:00",
  bis: "23:00",
};

export default function OeffnungszeitenEditor({
  value,
  onChange,
}: {
  value: Oeffnungszeiten;
  onChange: (neu: Oeffnungszeiten) => void;
}) {
  const { dict } = useTranslation();

  function tagAendern(tag: (typeof TAGE)[number], neu: Oeffnungstag) {
    onChange({ ...value, [tag]: neu });
  }

  function fuerAlleUebernehmen(tag: (typeof TAGE)[number]) {
    const vorlage = value[tag] ?? STANDARD_ZEITEN;
    const neu: Oeffnungszeiten = {};
    TAGE.forEach((t) => {
      neu[t] = { ...vorlage };
    });
    onChange(neu);
  }

  return (
    <div className="flex flex-col gap-2">
      {TAGE.map((tag) => {
        const eintrag: Oeffnungstag = value[tag] ?? STANDARD_ZEITEN;
        const istGeoeffnet = !eintrag.geschlossen;

        return (
          <div key={tag} className="flex items-center gap-2 text-sm flex-wrap">
            <span className="w-24 shrink-0 opacity-80">
              {dict.oeffnungszeiten[tag]}
            </span>

            <label className="flex items-center gap-1.5 text-xs shrink-0">
              <input
                type="checkbox"
                checked={istGeoeffnet}
                onChange={(e) =>
                  tagAendern(tag, {
                    ...eintrag,
                    geschlossen: !e.target.checked,
                    von: eintrag.von || STANDARD_ZEITEN.von,
                    bis: eintrag.bis || STANDARD_ZEITEN.bis,
                  })
                }
                className="accent-brass-500"
              />
              {istGeoeffnet
                ? dict.oeffnungszeiten.geoeffnet
                : dict.oeffnungszeiten.geschlossen}
            </label>

            {istGeoeffnet && (
              <>
                <input
                  type="time"
                  value={eintrag.von ?? ""}
                  onChange={(e) =>
                    tagAendern(tag, { ...eintrag, von: e.target.value })
                  }
                  className="bg-bar-800 border border-bar-700 rounded px-2 py-1 text-xs"
                />
                <span className="opacity-50">–</span>
                <input
                  type="time"
                  value={eintrag.bis ?? ""}
                  onChange={(e) =>
                    tagAendern(tag, { ...eintrag, bis: e.target.value })
                  }
                  className="bg-bar-800 border border-bar-700 rounded px-2 py-1 text-xs"
                />
                {tag === "montag" && (
                  <button
                    type="button"
                    onClick={() => fuerAlleUebernehmen(tag)}
                    className="text-xs text-brass-400 underline"
                  >
                    {dict.oeffnungszeiten.fuerAlleTageUebernehmen}
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
