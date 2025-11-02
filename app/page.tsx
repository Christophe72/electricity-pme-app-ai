import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-cyan-600 rounded-full mb-6">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Gestion Électricité PME
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Gérez efficacement votre stock de matériel électrique avec
            l&apos;aide de l&apos;intelligence artificielle
          </p>
        </div>

        {/* Cartes de navigation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-stretch">
          {/* Assistant IA Stock */}
          <Link href="/ai-stock" className="block h-full">
            <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-cyan-500 dark:hover:border-cyan-400 min-h-[220px]">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-cyan-600"
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
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Assistant IA Stock
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Posez des questions sur votre stock et obtenez des réponses
                instantanées
              </p>
            </div>
          </Link>

          {/* Assistant IA PDF */}
          <Link href="/ai-pdf" className="block h-full">
            <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500 dark:hover:border-purple-400 min-h-[220px]">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Assistant IA PDF
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Posez des questions sur vos documents de certification
              </p>
            </div>
          </Link>

          {/* Gestion du stock */}
          <Link href="/gestion" className="block h-full">
            <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-cyan-500 dark:hover:border-cyan-400 min-h-[220px]">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Gestion des données
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ajoutez, modifiez et supprimez vos installations et articles de
                stock
              </p>
            </div>
          </Link>

          {/* Module RGIE */}
          <Link href="/rgie" className="block h-full">
            <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-400 min-h-[220px]">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6l4 2"
                  />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Module RGIE
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Testez vos connaissances réglementaires grâce au module de formation interne.
              </p>
            </div>
          </Link>

          {/* Statistiques */}
          <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-cyan-500 dark:hover:border-cyan-400 min-h-[220px]">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Statistiques
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualisez les rapports et statistiques de votre activité
            </p>
            <span className="inline-block mt-3 text-sm text-gray-500 italic">
              Bientôt disponible
            </span>
          </div>
        </div>

        {/* Section statistiques rapides */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
              Aperçu rapide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-600 mb-2">50+</div>
                <div className="text-gray-600 dark:text-gray-300">
                  Articles en stock
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
                <div className="text-gray-600 dark:text-gray-300">
                  Installations actives
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  IA
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Assistant intelligent
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
