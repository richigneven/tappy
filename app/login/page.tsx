"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "E-Mail oder Passwort ist falsch."
          : error.message
      );
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display font-bold text-3xl text-brass-500 mb-6">
        Anmelden
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {loading ? "Wird geprüft …" : "Anmelden"}
        </button>
      </form>

      <p className="text-sm mt-6 opacity-80">
        Noch kein Konto?{" "}
        <Link href="/register" className="text-brass-500 underline">
          Jetzt registrieren
        </Link>
      </p>
    </div>
  );
}
