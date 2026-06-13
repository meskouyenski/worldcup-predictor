"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import JoinLeagueButton from "@/components/JoinLeagueButton";

interface Match {
  id: number;
  home_team: string;
  away_team: string;
  match_date: string;
  status?: string;
  score?: {
    home: number | null;
    away: number | null;
  };
}

type ScoreState = {
  [key: number]: {
    home: string;
    away: string;
  };
};

export default function PredictionsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [scores, setScores] = useState<ScoreState>({});
  const [loading, setLoading] = useState(true);

  // 🕒 TIMER GLOBAL LIVE
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // LOAD MATCHS
  useEffect(() => {
    const loadMatches = async () => {
      try {
        const res = await fetch("/api/matches");
        const json = await res.json();

        if (json.success) {
          setMatches(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  // 🔒 LOCK 1H AVANT MATCH
  const isLocked = (matchDate: string) => {
    const matchTime = new Date(matchDate).getTime();
    const oneHour = 60 * 60 * 1000;
    return now > matchTime - oneHour;
  };

  // ⏳ COUNTDOWN
  const getTimeLeft = (matchDate: string) => {
    const matchTime = new Date(matchDate).getTime();
    const lockTime = matchTime - 60 * 60 * 1000;
    const diff = lockTime - now;

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // SAVE PREDICTION
  const savePrediction = async (matchId: number) => {
    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;

    if (!userId) {
      alert("❌ Connecte-toi");
      return;
    }

    const res = await fetch("/api/predictions/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        match_id: matchId,
        predicted_home: Number(scores[matchId]?.home || 0),
        predicted_away: Number(scores[matchId]?.away || 0),
        user_id: userId,
      }),
    });

    const json = await res.json();

    if (!json.success) {
      alert("❌ " + json.error);
    } else {
      alert("✅ Pronostic enregistré");
    }
  };

  if (loading) {
    return <div className="p-6">⏳ Chargement des matchs...</div>;
  }

  return (
    <div className="flex gap-6 p-6">

      {/* ================= LEFT ================= */}
      <div className="w-2/3">

        {/* 🏆 BOUTON LIGUE AJOUTÉ ICI */}
        <div className="mb-4">
          <JoinLeagueButton />
        </div>

        <h1 className="text-2xl font-bold mb-4">
          ⚽ Coupe du Monde 2026 - Pronostics
        </h1>

        {matches
          .filter((m) => m.status !== "FINISHED")
          .map((m) => {
            const locked = isLocked(m.match_date);
            const countdown = getTimeLeft(m.match_date);

            return (
              <div
                key={m.id}
                className="border p-4 mb-4 rounded bg-white shadow-sm"
              >
                {/* MATCH */}
                <div className="font-semibold text-lg">
                  {m.home_team} vs {m.away_team}
                </div>

                {/* DATE */}
                <div className="text-sm text-gray-600 mb-1">
                  📅{" "}
                  {new Date(m.match_date).toLocaleString("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>

                {/* COUNTDOWN */}
                {countdown ? (
                  <div className="text-sm text-orange-600 font-semibold mb-2">
                    ⏳ Fermeture dans : {countdown}
                  </div>
                ) : (
                  <div className="text-sm text-red-600 font-semibold mb-2">
                    🔒 Pronostics fermés
                  </div>
                )}

                {/* INPUTS */}
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="number"
                    disabled={locked}
                    className={`border w-14 px-2 py-1 ${
                      locked ? "bg-gray-200 cursor-not-allowed" : ""
                    }`}
                    value={scores[m.id]?.home || ""}
                    onChange={(e) =>
                      setScores((prev) => ({
                        ...prev,
                        [m.id]: {
                          home: e.target.value,
                          away: prev[m.id]?.away || "",
                        },
                      }))
                    }
                  />

                  <span>-</span>

                  <input
                    type="number"
                    disabled={locked}
                    className={`border w-14 px-2 py-1 ${
                      locked ? "bg-gray-200 cursor-not-allowed" : ""
                    }`}
                    value={scores[m.id]?.away || ""}
                    onChange={(e) =>
                      setScores((prev) => ({
                        ...prev,
                        [m.id]: {
                          home: prev[m.id]?.home || "",
                          away: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                {/* BUTTON */}
                <button
                  disabled={locked}
                  onClick={() => savePrediction(m.id)}
                  className={`px-4 py-2 rounded text-white ${
                    locked
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {locked ? "Fermé" : "Valider le pronostic"}
                </button>
              </div>
            );
          })}
      </div>

      {/* ================= RIGHT ================= */}
      <div className="w-1/3 border-l pl-4">
        <h2 className="text-xl font-bold mb-4">
          📊 Live & Résultats
        </h2>

        {matches.map((m) => (
          <div key={m.id} className="mb-3 p-3 border rounded bg-gray-50">
            <div className="font-semibold">
              {m.home_team} vs {m.away_team}
            </div>

            <div className="text-sm mt-1">
              {m.status === "FINISHED" && "✅ Terminé"}
              {m.status === "SCHEDULED" && "⏳ À venir"}
              {m.status === "IN_PLAY" && "🔴 LIVE"}
              {!m.status && "🟡 Inconnu"}
            </div>

            <div className="mt-2 text-sm">
              {m.status === "FINISHED" ? (
                <b>
                  {m.score?.home ?? 0} - {m.score?.away ?? 0}
                </b>
              ) : (
                <span className="text-gray-400">
                  Score non disponible
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}