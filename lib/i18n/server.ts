import { cookies } from "next/headers";
import { LOCALE_COOKIE, type Locale, getDictionary } from "./translations";

export function getServerLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : "de";
}

export function getServerDictionary() {
  return getDictionary(getServerLocale());
}
