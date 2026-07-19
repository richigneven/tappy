"use client";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TappyLogo from "@/components/TappyLogo";
import { useTranslation } from "@/lib/i18n/LocaleProvider";

export default function NavbarClient({ hasUser }: { hasUser: boolean }) {
  const { dict } = useTranslation();

  return (
    <header className="border-b border-bar-700 bg-bar-900">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-brass-500 hover:text-brass-400 transition-colors">
          <TappyLogo />
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-brass-400 transition-colors">
            {dict.nav.karte}
          </Link>
          {hasUser ? (
            <>
              <Link
                href="/kneipen/neu"
                className="hover:text-brass-400 transition-colors"
              >
                {dict.nav.kneipeEintragen}
              </Link>
              <Link
                href="/profil"
                className="hover:text-brass-400 transition-colors"
              >
                {dict.nav.profil}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-brass-400 transition-colors"
              >
                {dict.nav.anmelden}
              </Link>
              <Link
                href="/register"
                className="bg-brass-500 text-bar-950 px-3 py-1.5 rounded-full font-semibold hover:bg-brass-400 transition-colors"
              >
                {dict.nav.registrieren}
              </Link>
            </>
          )}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
