export type Team = {
  name: string;
  flag: string;
};

export const FIFA_TEAMS: Record<string, Team> = {
  // 🇺🇸 Hosts
  USA: { name: "États-Unis", flag: "🇺🇸" },
  Mexico: { name: "Mexique", flag: "🇲🇽" },
  Canada: { name: "Canada", flag: "🇨🇦" },

  // 🇪🇺 Europe
  France: { name: "France", flag: "🇫🇷" },
  Germany: { name: "Allemagne", flag: "🇩🇪" },
  Spain: { name: "Espagne", flag: "🇪🇸" },
  England: { name: "Angleterre", flag: "🇬🇧" },
  Portugal: { name: "Portugal", flag: "🇵🇹" },
  Italy: { name: "Italie", flag: "🇮🇹" },
  Netherlands: { name: "Pays-Bas", flag: "🇳🇱" },
  Belgium: { name: "Belgique", flag: "🇧🇪" },
  Croatia: { name: "Croatie", flag: "🇭🇷" },
  Scotland: { name: "Écosse", flag: "🇬🇧" },
  Switzerland: { name: "Suisse", flag: "🇨🇭" },
  Austria: { name: "Autriche", flag: "🇦🇹" },
  Norway: { name: "Norvège", flag: "🇳🇴" },
  Sweden: { name: "Suède", flag: "🇸🇪" },
  Czechia: { name: "Tchéquie", flag: "🇨🇿" },
  Turkey: { name: "Turquie", flag: "🇹🇷" },

  // 🌍 Afrique
  Morocco: { name: "Maroc", flag: "🇲🇦" },
  Senegal: { name: "Sénégal", flag: "🇸🇳" },
  Tunisia: { name: "Tunisie", flag: "🇹🇳" },
  Egypt: { name: "Égypte", flag: "🇪🇬" },
  Algeria: { name: "Algérie", flag: "🇩🇿" },
  Ghana: { name: "Ghana", flag: "🇬🇭" },
  Cameroon: { name: "Cameroun", flag: "🇨🇲" },
  "Ivory Coast": { name: "Côte d’Ivoire", flag: "🇨🇮" },
  SouthAfrica: { name: "Afrique du Sud", flag: "🇿🇦" },

  // 🌎 Amérique du Sud
  Brazil: { name: "Brésil", flag: "🇧🇷" },
  Argentina: { name: "Argentine", flag: "🇦🇷" },
  Uruguay: { name: "Uruguay", flag: "🇺🇾" },
  Colombia: { name: "Colombie", flag: "🇨🇴" },
  Ecuador: { name: "Équateur", flag: "🇪🇨" },
  Paraguay: { name: "Paraguay", flag: "🇵🇾" },

  // 🌎 CONCACAF
  Panama: { name: "Panama", flag: "🇵🇦" },
  Haiti: { name: "Haïti", flag: "🇭🇹" },

  // 🌏 Asie
  Japan: { name: "Japon", flag: "🇯🇵" },
  "South Korea": { name: "Corée du Sud", flag: "🇰🇷" },
  Australia: { name: "Australie", flag: "🇦🇺" },
  Iran: { name: "Iran", flag: "🇮🇷" },
  Qatar: { name: "Qatar", flag: "🇶🇦" },
  "Saudi Arabia": { name: "Arabie Saoudite", flag: "🇸🇦" },

  // 🌊 Océanie
  NewZealand: { name: "Nouvelle-Zélande", flag: "🇳🇿" },
};

export function getTeam(code: string): Team {
  const normalized = code?.replace(/\s/g, "");
  return FIFA_TEAMS[normalized] || { name: code, flag: "🏳️" };
}