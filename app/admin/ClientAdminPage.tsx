"use client";

import { useEffect, useState } from "react";

interface Match {
  id: number;
  home_team: string;
  away_team: string;
  match_date: string;
  home_score?: number | null;
  away_score?: number | null;
  status: string;
}

export default function ClientAdminPage({ initialMatches }: { initialMatches: Match[] }) {
  const [matches, setMatches] = useState<Match[]>(initialMatches || []);
  const [loading, setLoading] = useState(false);

  // 🔥 LIVE SYNC (15s)
  useEffect(() => {
    let alive = true;

    const sync = async () => {
      try {
        await fetch("/api/fetch-scores");

        const res = await fetch("/api/import-worldcup");
        const json = await res.json();

        if (alive && json.success) {
          setMatches(json.data || []);
        }
      } catch (e) {
        console.error(e);
      }
    };

    sync();
    const interval = setInterval(sync, 15000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        ⚙️ Live Admin Dashboard
      </h1>

      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            {/* LEFT */}
            <div>
              <div className="font-bold text-lg">
                {match.home_team} vs {match.away_team}
              </div>
              <div className="text-gray-500 text-sm">
                {new Date(match.match_date).toLocaleString()}
              </div>
            </div>

            {/* RIGHT SCORE LIVE */}
            <div className="text-right min-w-[120px]">
              <div className="text-2xl font-bold text-blue-700">
                {match.home_score ?? 0} - {match.away_score ?? 0}
              </div>

              <div
                className={
                  match.status === "finished"
                    ? "text-green-600 text-sm"
                    : "text-orange-500 text-sm"
                }
              >
                {match.status === "finished" ? "✔ terminé" : "⏳ live"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}