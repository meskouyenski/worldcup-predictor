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

    if (!json.matches) {
      return NextResponse.json({
        success: false,
        error: "No matches returned from API",
      });
    }

    const matches = json.matches.map((m: any) => ({
      id: m.id,
      home_team: m.homeTeam?.name || "Unknown",
      away_team: m.awayTeam?.name || "Unknown",
      match_date: m.utcDate,
      status: m.status, // IMPORTANT
      score: {
        home: m.score?.fullTime?.home ?? null,
        away: m.score?.fullTime?.away ?? null,
      },
    }));

    return NextResponse.json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    });
  }
}