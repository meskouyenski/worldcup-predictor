"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      alert("❌ " + error.message);
    } else {
      alert("📩 Email de connexion envoyé !");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        🔐 Connexion
      </h1>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={login}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Envoyer le lien de connexion
      </button>
    </div>
  );
}