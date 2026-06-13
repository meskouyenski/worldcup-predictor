import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST() {
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
      home_team: m.homeTeam?.name,
      away_team: m.awayTeam?.name,
      match_date: m.utcDate,
      status: m.status,
    }));

    const { error } = await supabaseServer
      .from("matches")
      .upsert(matches);

    if (error) {
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({
      success: true,
      inserted: matches.length,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    });
  }
}