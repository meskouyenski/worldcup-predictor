import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const body = await req.json();

  const { error } = await supabaseServer.from("predictions").insert({
    user_id: body.user_id,
    match_id: body.match_id,
    predicted_home: body.predicted_home,
    predicted_away: body.predicted_away,
    points: 0,
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message });
  }

  return NextResponse.json({ success: true });
}