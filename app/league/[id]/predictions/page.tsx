"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function PredictionsPage() {
  const params = useParams();
  const leagueId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingMatch, setSavingMatch] = useState<number | null>(null);

  const [predictions, setPredictions] = useState<{
    [key: number]: { home: number; away: number };
  }>({});

  useEffect(() => {
    loadPage();

    // Supabase Realtime pour mise à jour automatique du classement
    const channel = supabase
      .channel(`league-${leagueId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "predictions" },
        () => {
          loadStandings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadStandings() {
    const { data } = await supabase
      .from("league_standings")
      .select("*")
      .eq("league_id", leagueId)
      .order("calculated_points", { ascending: false });
    setStandings(data || []);
  }

  async function loadPage() {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    setUser(session.user);

    // MATCHS
    const { data: matchesData } = await supabase
      .from("matches")
      .select("*")
      .order("match_date", { ascending: true });
    setMatches(matchesData || []);

    // MES PRONOSTICS
    const { data: predictionsData } = await supabase
      .from("predictions")
      .select("*")
      .eq("league_id", leagueId)
      .eq("user_id", session.user.id);

    const predictionMap: any = {};
    predictionsData?.forEach((prediction) => {
      predictionMap[prediction.match_id] = {
        home: prediction.predicted_home,
        away: prediction.predicted_away,
      };
    });
    setPredictions(predictionMap);

    await loadStandings();
    setLoading(false);
  }

  async function savePrediction(matchId: number) {
    const prediction = predictions[matchId];

    if (prediction?.home === undefined || prediction?.away === undefined) {
      alert("Entre un score");
      return;
    }

    setSavingMatch(matchId);

    const { data: existingPrediction } = await supabase
      .from("predictions")
      .select("id")
      .eq("user_id", user.id)
      .eq("league_id", leagueId)
      .eq("match_id", matchId)
      .maybeSingle();

    if (existingPrediction) {
      await supabase
        .from("predictions")
        .update({ predicted_home: prediction.home, predicted_away: prediction.away })
        .eq("id", existingPrediction.id);
    } else {
      await supabase
        .from("predictions")
        .insert({
          user_id: user.id,
          league_id: leagueId,
          match_id: matchId,
          predicted_home: prediction.home,
          predicted_away: prediction.away,
        });
    }

    await loadStandings();
    setSavingMatch(null);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => (window.location.href = `/league/${leagueId}`)}
          className="mb-6 bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-lg"
        >
          ← Retour à la ligue
        </button>

        {/* MATCHS */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-6">⚽ Pronostics</h1>
          {matches.length === 0 ? <p>Aucun match disponible.</p> : (
            <div className="space-y-4">
              {matches.map((match) => {
                const matchStarted = new Date(match.match_date) <= new Date();
                return (
                  <div key={match.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h2 className="text-xl font-bold">{match.home_team} vs {match.away_team}</h2>
                        <p className="text-sm text-gray-500">
                          {new Date(match.match_date).toLocaleString("fr-FR")}
                        </p>
                      </div>
                      {match.home_score !== null && match.away_score !== null && (
                        <div className="font-bold text-blue-700">
                          Résultat : {match.home_score} - {match.away_score}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        disabled={matchStarted}
                        value={predictions[match.id]?.home ?? ""}
                        onChange={(e) =>
                          setPredictions({
                            ...predictions,
                            [match.id]: {
                              home: Number(e.target.value),
                              away: predictions[match.id]?.away ?? 0,
                            },
                          })
                        }
                        className="border rounded p-2 w-20 text-center"
                      />
                      <span className="font-bold">-</span>
                      <input
                        type="number"
                        min="0"
                        disabled={matchStarted}
                        value={predictions[match.id]?.away ?? ""}
                        onChange={(e) =>
                          setPredictions({
                            ...predictions,
                            [match.id]: {
                              home: predictions[match.id]?.home ?? 0,
                              away: Number(e.target.value),
                            },
                          })
                        }
                        className="border rounded p-2 w-20 text-center"
                      />
                      <button
                        disabled={savingMatch === match.id || matchStarted}
                        onClick={() => savePrediction(match.id)}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-bold"
                      >
                        {savingMatch === match.id ? "Enregistrement..." : "Enregistrer"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CLASSEMENT */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6">🏆 Classement en direct</h2>
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
                  <td className="p-3 font-bold text-blue-700">{player.calculated_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}