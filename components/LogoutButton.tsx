"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LocaleProvider";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const { dict } = useTranslation();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="hover:text-warn transition-colors"
    >
      {dict.nav.abmelden}
    </button>
  );
}
