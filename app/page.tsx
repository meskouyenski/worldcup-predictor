"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leagueName, setLeagueName] = useState("");
  const [leagues, setLeagues] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    setUser(session.user);
    await loadLeagues();
    setLoading(false);
  }

  async function loadLeagues() {
    const { data, error } = await supabase
      .from("leagues")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setLeagues(data);
  }

  async function createLeague() {
    if (!leagueName.trim()) return alert("Entre un nom de ligue");

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data, error } = await supabase
      .from("leagues")
      .insert({
        name: leagueName,
        owner_id: user.id,
        invite_code: inviteCode,
      })
      .select()
      .single();

    if (error) return alert(error.message);

    const { error: memberError } = await supabase
      .from("league_members")
      .insert({
        league_id: data.id,
        user_id: user.id,
      });

    if (memberError) return alert(memberError.message);

    setLeagueName("");
    await loadLeagues();
    alert("✅ Ligue créée !");
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold text-black">Chargement...</h1>
    </main>
  );

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-blue-700 text-white p-6 shadow">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">🏆 Pronostics Coupe du Monde 2026</h1>
            <p className="mt-2">Connecté : {user.email}</p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg font-bold"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-3xl font-bold text-black mb-6">Créer une ligue</h2>

          <input
            type="text"
            placeholder="Nom de la ligue"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-4 text-black text-lg mb-4"
          />

          <button
            onClick={createLeague}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-lg"
          >
            ➕ Créer la ligue
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-black mb-6">Mes ligues</h2>

          {leagues.length === 0 ? (
            <p className="text-gray-500">Aucune ligue créée.</p>
          ) : (
            <div className="space-y-4">
              {leagues.map((league) => (
                <div
                  key={league.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-xl text-black">{league.name}</h3>
                    <p className="text-gray-500 text-sm">ID : {league.id}</p>
                    <p className="text-gray-500 text-sm">Code : {league.invite_code}</p>
                  </div>

                  <button
                    onClick={() => (window.location.href = `/league/${league.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg"
                  >
                    Ouvrir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}