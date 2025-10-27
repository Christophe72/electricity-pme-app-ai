"use client";

import { useState } from "react";
import Link from "next/link";

export default function AIPdfPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askAI() {
    if (!question.trim()) {
      setError("Veuillez poser une question");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const res = await fetch("/api/ai/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors du traitement de la question");
        return;
      }

      setAnswer(data.answer);
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-cyan-600 hover:text-cyan-700 mb-4 inline-block"
          >
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Assistant IA - Lecture de PDF
          </h1>
          <p className="text-gray-600">
            Posez des questions sur votre document de certification
          </p>
        </div>

        {/* Contenu principal */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            {/* Zone de question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey && !loading) {
                    askAI();
                  }
                }}
                placeholder="Exemple : Quelles sont les conditions de certification ?&#10;&#10;Appuyez sur Ctrl+Entrée pour envoyer"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                rows={4}
                disabled={loading}
              />
            </div>

            {/* Bouton */}
            <button
              onClick={askAI}
              disabled={loading || !question.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Poser la question
                </>
              )}
            </button>

            {/* Message d'erreur */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <strong className="text-red-800 font-medium">Erreur</strong>
                    <p className="text-red-700 mt-1">{error}</p>
                    {error.includes("non trouvé") && (
                      <p className="text-red-600 text-sm mt-2">
                        💡 Astuce : Placez votre fichier PDF dans le dossier{" "}
                        <code className="bg-red-100 px-2 py-1 rounded">
                          /public/certification.pdf
                        </code>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Réponse */}
            {answer && (
              <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-cyan-600 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <div className="flex-1">
                    <strong className="text-gray-800 font-semibold text-lg block mb-3">
                      Réponse :
                    </strong>
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {answer}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Exemples de questions */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              💡 Exemples de questions
            </h2>
            <div className="space-y-2">
              {[
                "Quelles sont les conditions de certification ?",
                "Quelle est la durée de validité du certificat ?",
                "Quelles sont les étapes d'inspection ?",
                "Quels sont les documents requis ?",
                "Quelles sont les normes de sécurité à respecter ?",
              ].map((exampleQuestion) => (
                <button
                  key={exampleQuestion}
                  onClick={() => setQuestion(exampleQuestion)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-cyan-50 border border-gray-200 hover:border-cyan-300 rounded-lg transition-colors text-gray-700 hover:text-cyan-700"
                  disabled={loading}
                >
                  <span className="text-cyan-600 mr-2">→</span>
                  {exampleQuestion}
                </button>
              ))}
            </div>
          </div>

          {/* Informations de sécurité */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-sm text-blue-800">
                <strong className="font-medium">
                  🔒 Sécurité & Confidentialité
                </strong>
                <p className="mt-1">
                  L&apos;IA traite uniquement le texte extrait du PDF. Aucun
                  fichier n&apos;est conservé après le traitement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
