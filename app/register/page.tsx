"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

   const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { display_name: displayName },
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },
});

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 text-center">
        <h1 className="font-display font-bold text-2xl text-brass-500 mb-3">
          Fast geschafft
        </h1>
        <p className="opacity-90">
          Bitte bestätige deine E-Mail-Adresse über den Link, den wir dir
          gerade geschickt haben. Danach kannst du dich anmelden.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display font-bold text-3xl text-brass-500 mb-6">
        Registrieren
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Anzeigename
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          E-Mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Passwort
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
          />
        </label>

        {error && <p className="text-warn text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-brass-500 text-bar-950 font-semibold rounded-full py-2 mt-2 hover:bg-brass-400 transition-colors disabled:opacity-50"
        >
          {loading ? "Wird angelegt …" : "Konto erstellen"}
        </button>
      </form>

      <p className="text-sm mt-6 opacity-80">
        Schon registriert?{" "}
        <Link href="/login" className="text-brass-500 underline">
          Anmelden
        </Link>
      </p>
    </div>
  );
}
