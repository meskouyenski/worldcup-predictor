"use client";

import { supabase } from "../../lib/supabaseClient";

export default function JoinLeagueButton() {
  const joinLeague = async () => {
    try {
      const code = prompt("🔑 Code de la ligue ?");

      if (!code) return;

      const { data } = await supabase.auth.getUser();

      const userId = data?.user?.id;

      if (!userId) {
        alert("❌ Tu dois être connecté");
        return;
      }

      const res = await fetch("/api/leagues/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          user_id: userId,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        alert("❌ " + json.error);
      } else {
        alert("✅ " + json.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur serveur");
    }
  };

  return (
    <button
      onClick={joinLeague}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      ⚽ Rejoindre une ligue
    </button>
  );
}