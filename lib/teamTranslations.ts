const TEAM_TRANSLATIONS: Record<string, string> = {
  Brazil: "Brésil",
  Argentina: "Argentine",
  France: "France",
  Germany: "Allemagne",
  Spain: "Espagne",
  England: "Angleterre",
  Portugal: "Portugal",
  Italy: "Italie",
  Netherlands: "Pays-Bas",
  Belgium: "Belgique",

  Morocco: "Maroc",
  Senegal: "Sénégal",
  Tunisia: "Tunisie",
  Egypt: "Égypte",
  Algeria: "Algérie",

  USA: "États-Unis",
  Mexico: "Mexique",
  Canada: "Canada",

  Japan: "Japon",
  "South Korea": "Corée du Sud",
  Qatar: "Qatar",
  "Saudi Arabia": "Arabie Saoudite",

  Croatia: "Croatie",
  Switzerland: "Suisse",
  Serbia: "Serbie",
  Denmark: "Danemark",
  Poland: "Pologne",

  Uruguay: "Uruguay",
  Colombia: "Colombie",
  Peru: "Pérou",
  Chile: "Chili",

  Australia: "Australie",
};

export function translateTeam(name: string) {
  return TEAM_TRANSLATIONS[name] || name;
}