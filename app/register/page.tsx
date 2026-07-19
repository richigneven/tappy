"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/LocaleProvider";

export default function RegisterPage() {
  const supabase = createClient();
  const { dict } = useTranslation();
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
          {dict.register.fastGeschafft}
        </h1>
        <p className="opacity-90">{dict.register.bestaetigungstext}</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display font-bold text-3xl text-brass-500 mb-6">
        {dict.register.titel}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          {dict.register.anzeigename}
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {dict.register.email}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-bar-800 border border-bar-700 rounded-lg px-3 py-2 focus-visible:border-brass-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {dict.register.passwort}
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
          {loading ? dict.register.buttonLoading : dict.register.button}
        </button>
      </form>

      <p className="text-sm mt-6 opacity-80">
        {dict.register.schonRegistriert}{" "}
        <Link href="/login" className="text-brass-500 underline">
          {dict.login.titel}
        </Link>
      </p>
    </div>
  );
}
