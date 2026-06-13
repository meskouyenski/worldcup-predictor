import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";

export async function POST(req: NextRequest, { params }: any) {
  const id = params.id;
  const body = await req.json();

  await supabaseServer
    .from("matches")
    .update({
      home_score: body.home_score,
      away_score: body.away_score,
      status: "finished",
    })
    .eq("id", id);

  return NextResponse.json({ success: true });
}