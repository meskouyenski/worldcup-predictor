import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches",
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY!,
        },
      }
    );

    const json = await res.json();

    const matches = (json.matches || []).map((m: any) => ({
      id: m.id,
      home_team: m.homeTeam?.name || "Unknown",
      away_team: m.awayTeam?.name || "Unknown",
      match_date: m.utcDate,
      status: m.status,
      score: {
        home: m.score?.fullTime?.home,
        away: m.score?.fullTime?.away,
      },
    }));

    return NextResponse.json({
      success: true,
      data: matches,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    });
  }
}