import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { code, user_id } = await req.json();

    // find league
    const { data: league } = await supabaseServer
      .from("leagues")
      .select("*")
      .eq("code", code)
      .single();

    if (!league) {
      return NextResponse.json({
        success: false,
        error: "Ligue introuvable",
      });
    }

    // insert member
    const { error } = await supabaseServer
      .from("league_members")
      .insert([
        {
          league_id: league.id,
          user_id,
        },
      ]);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Rejoint avec succès",
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    });
  }
}