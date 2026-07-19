import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import KneipeForm from "@/components/KneipeForm";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function KneipeBearbeitenPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const dict = getServerDictionary();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: kneipe } = await supabase
    .from("kneipen")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!kneipe) notFound();

  // Nur der Ersteller darf bearbeiten (zusätzlich zur Datenbank-Regel,
  // damit die Person eine klare Meldung statt eines kryptischen Fehlers sieht)
  if (kneipe.erstellt_von !== user.id) {
    redirect(`/kneipen/${params.id}`);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="font-display font-bold text-3xl text-brass-500 mb-2">
        {dict.kneipeForm.bearbeitenTitel}
      </h1>
      <KneipeForm modus="bearbeiten" kneipeId={kneipe.id} initialData={kneipe} />
    </div>
  );
}
