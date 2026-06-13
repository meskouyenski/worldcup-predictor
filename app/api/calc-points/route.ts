import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    // 1. matchs terminés
    const { data: matches, error: matchError } = await supabaseServer
      .from("matches")
      .select("*")
      .eq("status", "FINISHED"); // ⚠️ important: FINISHED en MAJ

    if (matchError) {
      return NextResponse.json({
        success: false,
        error: matchError.message,
      });
    }

    if (!matches || matches.length === 0) {
      return NextResponse.json({
        success: true,
        updated: 0,
        message: "No finished matches",
      });
    }

    // 2. predictions
    const { data: predictions, error: predError } = await supabaseServer
      .from("predictions")
      .select("*");

    if (predError) {
      return NextResponse.json({
        success: false,
        error: predError.message,
      });
    }

    if (!predictions) {
      return NextResponse.json({
        success: true,
        updated: 0,
        message: "No predictions",
      });
    }

    let updated = 0;

    // 3. calcul des points FIFA
    for (const p of predictions) {
      const match = matches.find((m) => m.id === p.match_id);
      if (!match) continue;

      const realHome = match.home_score ?? 0;
      const realAway = match.away_score ?? 0;

      const predHome = p.predicted_home ?? 0;
      const predAway = p.predicted_away ?? 0;

      const realDiff = realHome - realAway;
      const predDiff = predHome - predAway;

      const realWinner =
        realHome > realAway
          ? "home"
          : realHome < realAway
          ? "away"
          : "draw";

      const predWinner =
        predHome > predAway
          ? "home"
          : predHome < predAway
          ? "away"
          : "draw";

      let points = 0;

      // 🎯 5 pts - score exact
      if (realHome === predHome && realAway === predAway) {
        points = 5;
      }

      // 🟡 3 pts - bon résultat + écart exact
      else if (realWinner === predWinner && realDiff === predDiff) {
        points = 3;
      }

      // 🔵 1 pt - bon résultat
      else if (realWinner === predWinner) {
        points = 1;
      }

      // 🔴 0 pt sinon

      const { error: updateError } = await supabaseServer
        .from("predictions")
        .update({ points })
        .eq("id", p.id);

      if (!updateError) {
        updated++;
      }
    }

    return NextResponse.json({
      success: true,
      updated,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    });
  }
}