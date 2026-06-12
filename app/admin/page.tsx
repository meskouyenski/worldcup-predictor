"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [matchDate, setMatchDate] = useState("");

  useEffect(() => {
    checkAdmin();
    loadMatches();
  }, []);

  async function checkAdmin() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    if (session.user.email !== "meskouyenski@gmail.com") {
      alert("Accès refusé");
      window.location.href = "/";
      return;
    }

    setLoading(false);
  }

  async function loadMatches() {
    const { data } = await supabase
      .from("matches")
      .select("*")
      .order("match_date", { ascending: true });

    setMatches(data || []);
  }

  async function createMatch() {
    if (!homeTeam || !awayTeam || !matchDate) {
      alert("Remplis tous les champs");
      return;
    }

    const { error } = await supabase.from("matches").insert({
      home_team: homeTeam,
      away_team: awayTeam,
      match_date: matchDate,
      status: "scheduled",
    });

    if (error) {
      alert(error.message);
      return;
    }

    setHomeTeam("");
    setAwayTeam("");
    setMatchDate("");

    loadMatches();
  }

  async function deleteMatch(id: number) {
    if (!confirm("Supprimer ce match ?")) return;

    await supabase
      .from("matches")
      .delete()
      .eq("id", id);

    loadMatches();
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-3xl font-bold">Chargement...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* En-tête Admin */}
        <div className="bg-blue-700 text-white p-6 rounded-2xl shadow-xl mb-8">
          <h1 className="text-4xl font-bold">⚙️ Administration</h1>
          <p className="mt-2 text-blue-100">Gestion des matchs</p>
        </div>

        {/* Formulaire ajout match */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black">➕ Ajouter un match</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Équipe domicile"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              className="border-2 border-gray-300 p-4 rounded-lg text-black"
            />
            <input
              type="text"
              placeholder="Équipe extérieure"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              className="border-2 border-gray-300 p-4 rounded-lg text-black"
            />
            <input
              type="datetime-local"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="border-2 border-gray-300 p-4 rounded-lg text-black"
            />
          </div>
          <button
            onClick={createMatch}
            className="mt-5 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-lg"
          >
            ✅ Ajouter le match
          </button>
        </div>

        {/* Liste des matchs */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-black">🏆 Matchs enregistrés</h2>
          {matches.length === 0 ? (
            <div className="text-gray-500">Aucun match enregistré.</div>
          ) : (
            matches.map((match) => (
              <div
                key={match.id}
                className="border rounded-xl p-4 mb-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-xl text-black">
                    {match.home_team} vs {match.away_team}
                  </div>
                  <div className="text-gray-500">
                    {new Date(match.match_date).toLocaleString()}
                  </div>
                  <div className="font-semibold text-blue-700 mt-2">
                    Score : {match.home_score ?? "-"} - {match.away_score ?? "-"}
                  </div>
                </div>
                <button
                  onClick={() => deleteMatch(match.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-bold"
                >
                  🗑️ Supprimer
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}