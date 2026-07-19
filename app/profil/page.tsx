import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfilForm from "@/components/ProfilForm";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function ProfilPage() {
  const supabase = createClient();
  const dict = getServerDictionary();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="font-display font-bold text-3xl text-brass-500 mb-2">
        {dict.profil.titel}
      </h1>
      <p className="text-sm opacity-80 mb-8">
        {dict.profil.beschreibungstext}
      </p>
      <ProfilForm userId={user.id} profile={profile} email={user.email} />
    </div>
  );
}
