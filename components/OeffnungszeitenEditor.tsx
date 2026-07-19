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

  return (
    <div className="flex flex-col gap-2">
      {TAGE.map((tag) => {
        const eintrag: Oeffnungstag = value[tag] ?? {
          geschlossen: true,
          von: "",
          bis: "",
        };
        return (
          <div key={tag} className="flex items-center gap-2 text-sm">
            <span className="w-24 shrink-0 opacity-80">
              {dict.oeffnungszeiten[tag]}
            </span>
            <label className="flex items-center gap-1 text-xs shrink-0">
              <input
                type="checkbox"
                checked={eintrag.geschlossen}
                onChange={(e) =>
                  tagAendern(tag, { ...eintrag, geschlossen: e.target.checked })
                }
                className="accent-brass-500"
              />
              {dict.oeffnungszeiten.geschlossen}
            </label>
            {!eintrag.geschlossen && (
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
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
