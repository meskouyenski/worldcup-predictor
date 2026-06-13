"use client";

import { useEffect, useState } from "react";

interface Row {
  user_id: string;
  points: number;
  profile?: {
    username?: string;
    display_name?: string;
    email?: string;
  };
}

export default function LeaderboardPage() {
  const [data, setData] = useState<Row[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/leaderboard");
      const json = await res.json();

      if (json.success) setData(json.data);
    };

    load();
  }, []);

  const getName = (row: Row) => {
    return (
      row.profile?.username ||
      row.profile?.display_name ||
      row.profile?.email ||
      "Joueur"
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        🏆 Classement
      </h1>

      <div className="space-y-3">
        {data.map((row, i) => (
          <div
            key={row.user_id}
            className="flex justify-between bg-white p-4 rounded shadow"
          >
            <div className="font-medium">
              {i === 0 && "🥇 "}
              {i === 1 && "🥈 "}
              {i === 2 && "🥉 "}
              {getName(row)}
            </div>

            <div className="font-bold text-blue-600">
              {row.points} points
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}