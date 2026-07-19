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

export type Preisklasse = "$" | "$$" | "$$$";

export type Kneipentyp =
  | "pub"
  | "bar"
  | "cocktailbar"
  | "sportsbar"
  | "biergarten"
  | "club"
  | "brauereigaststaette"
  | "weinbar"
  | "rooftop_bar"
  | "shisha_lounge"
  | "alkoholfreie_bar";

export type Getraenkeart =
  | "flaschenbier"
  | "gezapftes_bier"
  | "wein"
  | "cocktails"
  | "mocktails"
  | "tagesangebote"
  | "alkoholfrei";

export type Zahlungsoption =
  | "bargeld"
  | "kreditkarte"
  | "debitkarte"
  | "mobile_payment";

export type Annehmlichkeit = "sitzplaetze_draussen" | "barrierearm" | "wlan";

export type EntertainmentOption =
  | "live_musik"
  | "kicker"
  | "dart"
  | "billard"
  | "quiz_public_viewing";

export type Oeffnungstag = {
  geschlossen: boolean;
  von?: string;
  bis?: string;
};

export type Oeffnungszeiten = {
  montag?: Oeffnungstag;
  dienstag?: Oeffnungstag;
  mittwoch?: Oeffnungstag;
  donnerstag?: Oeffnungstag;
  freitag?: Oeffnungstag;
  samstag?: Oeffnungstag;
  sonntag?: Oeffnungstag;
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
  preisklasse: Preisklasse;
  kneipentyp: Kneipentyp;
  getraenkearten: Getraenkeart[];
  zahlungsoptionen: Zahlungsoption[];
  annehmlichkeiten: Annehmlichkeit[];
  snacks_vorhanden: boolean;
  entertainment_vorhanden: boolean;
  entertainment_optionen: EntertainmentOption[];
  entertainment_sonstiges: string | null;
  oeffnungszeiten: Oeffnungszeiten | null;
  webseite: string | null;
  instagram: string | null;
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
  positive_aspekte: string[];
  negative_aspekte: string[];
  created_at: string;
};
