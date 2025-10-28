"use client";
import { useState } from "react";

export default function AIStockPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    setLoading(true);
    setAnswer("");
    const res = await fetch("/api/ai/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-cyan-50 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 border border-cyan-200">
        <h1 className="text-3xl font-bold text-cyan-700 text-center mb-6">
          Assistant IA - Gestion de stock
        </h1>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Exemple : Quels articles sont sous le seuil ?"
          className="w-full p-4 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition mb-4 text-amber-700"
          rows={3}
        />
        <button
          onClick={askAI}
          disabled={loading || !question}
          className={`w-full py-3 rounded-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition ${
            loading || !question ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Analyse en cours..." : "Poser la question"}
        </button>
        {answer && (
          <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
            <strong className="text-cyan-700">Réponse :</strong>
            <p className="mt-2 text-gray-800 whitespace-pre-line">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
