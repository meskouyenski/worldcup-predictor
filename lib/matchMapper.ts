import { getTeam } from "./fifaTeams";

export function mapMatch(m: any) {
  const homeRaw =
    m.homeTeam?.name ||
    m.homeTeam?.shortName ||
    m.homeTeam?.tla ||
    "Équipe inconnue";

  const awayRaw =
    m.awayTeam?.name ||
    m.awayTeam?.shortName ||
    m.awayTeam?.tla ||
    "Équipe inconnue";

  const home = getTeam(homeRaw);
  const away = getTeam(awayRaw);

  return {
    id: m.id,
    home_team: home.name,
    away_team: away.name,

    // 🇫🇷 heure française propre
    match_date: new Date(m.utcDate).toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      dateStyle: "full",
      timeStyle: "short",
    }),

    utc: m.utcDate,
    status: m.status,
  };
}