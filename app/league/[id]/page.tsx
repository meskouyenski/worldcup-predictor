"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function LeaguePage() {
  const params = useParams();

  const [league, setLeague] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeague();
  }, []);

  async function loadLeague() {
    setLoading(true);

    const { data: leagueData } = await supabase
      .from("leagues")
      .select("*")
      .eq("id", params.id)
      .single();

    setLeague(leagueData);

    // Membres
    const { data: membersData } = await supabase
      .from("league_members")
      .select("*")
      .eq("league_id", params.id);

    setMembers(membersData || []);

    // Classement
    const { data: standingsData } = await supabase
      .from("league_standings")
      .select("*")
      .eq("league_id", params.id)
      .order("calculated_points", { ascending: false });

    setStandings(standingsData || []);

    setLoading(false);
  }

  if (loading || !league) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Chargement...</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => (window.location.href = "/")}
          className="mb-6 bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-lg"
        >
          ← Retour aux ligues
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-5xl font-bold mb-6">🏆 {league.name}</h1>

          <p className="mb-2">
            <strong>ID :</strong> {league.id}
          </p>

          <p className="mb-2">
            <strong>Code :</strong> {league.invite_code}
          </p>

          <p>
            <strong>Créée le :</strong>{" "}
            {new Date(league.created_at).toLocaleDateString("fr-FR")}
          </p>

          {/* BOUTON PRONOSTIQUER */}
          <button
            onClick={() =>
              (window.location.href = `/league/${league.id}/predictions`)
            }
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg"
          >
            ⚽ Pronostiquer les matchs
          </button>

          {/* MEMBRES */}
          <h2 className="text-3xl font-bold mt-10 mb-4">
            👥 Membres ({members.length})
          </h2>

          {standings.length === 0 ? (
            <div className="bg-gray-100 p-4 rounded">Aucun membre</div>
          ) : (
            <div className="space-y-3">
              {standings.map((player, index) => (
                <div
                  key={player.user_id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold mr-3">#{index + 1}</span>
                    {player.username}
                  </div>
                  <div className="font-bold text-blue-700">
                    {player.calculated_points} pts
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CLASSEMENT */}
          <h2 className="text-3xl font-bold mt-10 mb-4">🏅 Classement</h2>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Rang</th>
                <th className="p-3 text-left">Joueur</th>
                <th className="p-3 text-left">Pronostics</th>
                <th className="p-3 text-left">Points</th>
              </tr>
            </thead>

            <tbody>
              {standings.map((player, index) => (
                <tr key={player.user_id} className="border-t">
                  <td className="p-3">#{index + 1}</td>
                  <td className="p-3">{player.username}</td>
                  <td className="p-3">{player.total_predictions}</td>
                  <td className="p-3 font-bold">{player.calculated_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}