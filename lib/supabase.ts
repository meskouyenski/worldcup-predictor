"use client"; // garantit que le client fonctionne côté navigateur

import { createClient } from "@supabase/supabase-js";

// Récupère les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Vérifie que les variables existent
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL ou clé introuvable. Vérifie ton fichier .env.local"
  );
}

// Crée le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);