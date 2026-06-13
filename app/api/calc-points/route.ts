import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function GET() {
  // 1. matchs terminés
  const { data: matches } = await supabaseServer
    .from("matches")
    .select("*")
    .eq("status", "finished");

  if (!matches) {
    return NextResponse.json({ success: false });
  }

  // 2. predictions
  const { data: predictions } = await supabaseServer
    .from("predictions")
    .select("*");

  if (!predictions) {
    return NextResponse.json({ success: false });
  }

  let updated = 0;

  // 3. calcul des points
  for (const p of predictions) {
    const match = matches.find((m) => m.id === p.match_id);
    if (!match) continue;

    let points = 0;

    const realDiff = match.home_score - match.away_score;
    const predDiff = p.predicted_home - p.predicted_away;

    const realWinner =
      match.home_score > match.away_score ? "home" :
      match.home_score < match.away_score ? "away" : "draw";

    const predWinner =
      p.predicted_home > p.predicted_away ? "home" :
      p.predicted_home < p.predicted_away ? "away" : "draw";

    // 🎯 score exact
    if (
      match.home_score === p.predicted_home &&
      match.away_score === p.predicted_away
    ) {
      points = 5;
    }

    // 🎯 bon vainqueur + diff exact
    else if (realWinner === predWinner && realDiff === predDiff) {
      points = 3;
    }

    // 🎯 bon vainqueur
    else if (realWinner === predWinner) {
      points = 1;
    }

    await supabaseServer
      .from("predictions")
      .update({ points })
      .eq("id", p.id);

    updated++;
  }

  return NextResponse.json({
    success: true,
    updated,
  });
}