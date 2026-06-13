export const TEAM_NAMES: Record<string, { name: string; flag: string }> = {
  France: { name: "France", flag: "🇫🇷" },
  Brazil: { name: "Brésil", flag: "🇧🇷" },
  Argentina: { name: "Argentine", flag: "🇦🇷" },
  Germany: { name: "Allemagne", flag: "🇩🇪" },
  Spain: { name: "Espagne", flag: "🇪🇸" },
  England: { name: "Angleterre", flag: "🏴" },
  Portugal: { name: "Portugal", flag: "🇵🇹" },
  Netherlands: { name: "Pays-Bas", flag: "🇳🇱" },
  Italy: { name: "Italie", flag: "🇮🇹" },
  Belgium: { name: "Belgique", flag: "🇧🇪" },

  Morocco: { name: "Maroc", flag: "🇲🇦" },
  Tunisia: { name: "Tunisie", flag: "🇹🇳" },
  Egypt: { name: "Égypte", flag: "🇪🇬" },
  Senegal: { name: "Sénégal", flag: "🇸🇳" },
  Ghana: { name: "Ghana", flag: "🇬🇭" },
  Cameroon: { name: "Cameroun", flag: "🇨🇲" },
  "Côte d'Ivoire": { name: "Côte d’Ivoire", flag: "🇨🇮" },

  USA: { name: "États-Unis", flag: "🇺🇸" },
  Mexico: { name: "Mexique", flag: "🇲🇽" },
  Canada: { name: "Canada", flag: "🇨🇦" },

  Japan: { name: "Japon", flag: "🇯🇵" },
  "South Korea": { name: "Corée du Sud", flag: "🇰🇷" },
  Australia: { name: "Australie", flag: "🇦🇺" },

  Qatar: { name: "Qatar", flag: "🇶🇦" },
  SaudiArabia: { name: "Arabie Saoudite", flag: "🇸🇦" },
  Iran: { name: "Iran", flag: "🇮🇷" },

  Croatia: { name: "Croatie", flag: "🇭🇷" },
  Uruguay: { name: "Uruguay", flag: "🇺🇾" },
  Switzerland: { name: "Suisse", flag: "🇨🇭" },
  Denmark: { name: "Danemark", flag: "🇩🇰" },
  Sweden: { name: "Suède", flag: "🇸🇪" },
  Norway: { name: "Norvège", flag: "🇳🇴" },
  Poland: { name: "Pologne", flag: "🇵🇱" },
  Serbia: { name: "Serbie", flag: "🇷🇸" },
  Ukraine: { name: "Ukraine", flag: "🇺🇦" },
  Czechia: { name: "Tchéquie", flag: "🇨🇿" },

  Panama: { name: "Panama", flag: "🇵🇦" },
  CostaRica: { name: "Costa Rica", flag: "🇨🇷" },
  Honduras: { name: "Honduras", flag: "🇭🇳" },
  Jamaica: { name: "Jamaïque", flag: "🇯🇲" },
  Haiti: { name: "Haïti", flag: "🇭🇹" },

  default: { name: "Inconnu", flag: "🏳️" },
};

export function getTeam(name: string) {
  return TEAM_NAMES[name] || TEAM_NAMES.default;
}