import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function GET() {
  const res = await fetch(
    "https://api.football-data.org/v4/competitions/WC/matches",
    {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY!,
      },
    }
  );

  const data = await res.json();

  for (const match of data.matches) {
    await supabaseServer
      .from("matches")
      .update({
        home_score: match.score.fullTime.home,
        away_score: match.score.fullTime.away,
        status: match.status === "FINISHED" ? "finished" : "scheduled",
      })
      .eq("home_team", match.homeTeam.name)
      .eq("away_team", match.awayTeam.name);
  }

  return NextResponse.json({ success: true });
}