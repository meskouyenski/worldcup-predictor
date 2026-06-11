"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = "/";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      window.location.href = "/";
    }
  }

  async function signInEmail() {
    if (!email) {
      alert("Entre ton email");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000",
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Email envoyé. Vérifie ta boîte mail.");
  }

  async function signInGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000",
      },
    });

    if (error) {
      alert(error.message);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">

        <h1 className="text-4xl font-bold text-center mb-8 text-black">
          Connexion
        </h1>

        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 border-gray-300 p-4 rounded-lg text-lg text-black mb-4"
        />

        <button
          onClick={signInEmail}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg p-4 rounded-lg transition"
        >
          ✉️ Recevoir un lien de connexion
        </button>

        <div className="text-center my-6 text-gray-500 font-semibold">
          OU
        </div>

        <button
          onClick={signInGoogle}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xl p-4 rounded-lg shadow-lg transition"
        >
          🔴 Continuer avec Google
        </button>

      </div>
    </main>
  );
}