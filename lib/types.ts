export type GetraenkeVorliebe = "bier" | "cocktail" | "schnaps" | "alkoholfrei";

export type Profile = {
  id: string;
  display_name: string | null;
  payout_email: string | null;
  avatar_url: string | null;
  getraenke_vorliebe: GetraenkeVorliebe | null;
  profil_oeffentlich: boolean;
  created_at: string;
};

export type Kneipe = {
  id: string;
  name: string;
  adresse: string | null;
  lat: number;
  lng: number;
  beschreibung: string | null;
  erstellt_von: string | null;
  created_at: string;
  // Wird beim Laden berechnet, nicht in der DB gespeichert
  durchschnitts_rating?: number;
  anzahl_bewertungen?: number;
};

export type Bewertung = {
  id: string;
  kneipe_id: string;
  user_id: string;
  rating: number;
  kommentar: string | null;
  created_at: string;
};
