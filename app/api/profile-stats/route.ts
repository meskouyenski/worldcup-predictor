import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: "user_id manquant",
    });
  }

  const { data: predictions, error } = await supabaseServer
    .from("predictions")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }

  const totalPredictions = predictions?.length || 0;
  const totalPoints =
    predictions?.reduce((sum, p) => sum + (p.points || 0), 0) || 0;

  const exactScores =
    predictions?.filter((p) => p.points === 5).length || 0;

  const goodResults =
    predictions?.filter((p) => p.points === 3 || p.points === 1).length || 0;

  const successRate =
    totalPredictions > 0
      ? Math.round(((exactScores + goodResults) / totalPredictions) * 100)
      : 0;

  return NextResponse.json({
    success: true,
    data: {
      totalPredictions,
      totalPoints,
      exactScores,
      goodResults,
      successRate,
    },
  });
}