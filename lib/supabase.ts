// lib/supabase.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Les variables d'environnement Supabase sont manquantes !");
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);