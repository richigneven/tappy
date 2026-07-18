import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-bar-700 bg-bar-900">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-black text-2xl tracking-tight text-brass-500"
        >
          Tappy
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-brass-400 transition-colors">
            Karte
          </Link>
          {user ? (
            <>
              <Link
                href="/kneipen/neu"
                className="hover:text-brass-400 transition-colors"
              >
                Kneipe eintragen
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-brass-400 transition-colors"
              >
                Anmelden
              </Link>
              <Link
                href="/register"
                className="bg-brass-500 text-bar-950 px-3 py-1.5 rounded-full font-semibold hover:bg-brass-400 transition-colors"
              >
                Registrieren
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
