"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Question = {
  id: number;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
};

type AnswerMap = Record<number, number | null>;

const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt:
      "Quelle est la première étape à réaliser avant toute intervention sur une installation électrique selon le RGIE ?",
    choices: [
      "Couper l'alimentation générale et vérifier l'absence de tension",
      "Préparer le rapport d'intervention",
      "Identifier le matériel à remplacer",
      "Informer le client de la durée de l'intervention",
    ],
    answerIndex: 0,
    explanation:
      "Le RGIE impose de mettre l'installation hors tension et de vérifier l'absence de tension avant d'intervenir.",
  },
  {
    id: 2,
    prompt: "Quel document doit être fourni au client après une nouvelle installation domestique ?",
    choices: [
      "Un certificat de conformité RGIE",
      "La facture détaillée du matériel utilisé",
      "La liste complète des normes appliquées",
      "Un plan unifilaire et un schéma de position",
    ],
    answerIndex: 3,
    explanation:
      "Le RGIE exige la remise d'un plan unifilaire et d'un schéma de position pour toute nouvelle installation.",
  },
  {
    id: 3,
    prompt:
      "Quel est l'appareil indispensable pour protéger les personnes contre les contacts indirects ?",
    choices: [
      "Le disjoncteur différentiel",
      "Le contacteur modulaire",
      "Le relais thermique",
      "Le parafoudre",
    ],
    answerIndex: 0,
    explanation:
      "Les dispositifs différentiels à haute sensibilité sont obligatoires pour prévenir les contacts indirects.",
  },
  {
    id: 4,
    prompt:
      "Quelle périodicité de contrôle est recommandée pour les installations des PME à risque élevé ?",
    choices: [
      "Tous les ans",
      "Tous les deux ans",
      "Tous les cinq ans",
      "Uniquement lors d'une modification majeure",
    ],
    answerIndex: 0,
    explanation:
      "Pour les environnements à risque, une vérification annuelle est généralement requise pour rester conforme au RGIE.",
  },
  {
    id: 5,
    prompt:
      "Quel est le rôle principal du schéma unifilaire dans une installation électrique ?",
    choices: [
      "Décrire le câblage et les connexions de l'installation",
      "Indiquer la puissance totale installée",
      "Lister les équipements de protection individuelle",
      "Déterminer la couleur des fils utilisés",
    ],
    answerIndex: 0,
    explanation:
      "Le schéma unifilaire permet de visualiser l'ensemble du câblage et des connexions pour garantir la conformité et faciliter les contrôles.",
  },
  {
    id: 6,
    prompt:
      "Quel dispositif doit obligatoirement équiper les circuits de prises dans une installation domestique ?",
    choices: [
      "Un disjoncteur différentiel 30mA",
      "Un relais thermique",
      "Un contacteur jour/nuit",
      "Un parafoudre",
    ],
    answerIndex: 0,
    explanation:
      "Le RGIE impose la présence d'un disjoncteur différentiel 30mA sur les circuits de prises pour protéger les personnes contre les risques électriques.",
  },
  {
    id: 7,
    prompt:
      "Lors d'une modification d'une installation existante, que doit-on vérifier avant la remise en service ?",
    choices: [
      "La conformité des nouveaux éléments et l'absence de défaut d'isolement",
      "La couleur des gaines utilisées",
      "La présence d'un plan de masse",
      "Le nombre de prises installées",
    ],
    answerIndex: 0,
    explanation:
      "Avant toute remise en service, il est obligatoire de vérifier la conformité des modifications et l'absence de défaut d'isolement pour garantir la sécurité.",
  },
];

const DEFAULT_CREDENTIALS = {
  email: "formation@electricity-pme.fr",
  password: "rgie2025",
};

export default function QuizModule() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>(() =>
    Object.fromEntries(QUESTIONS.map((question) => [question.id, null]))
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const answeredCount = useMemo(
    () =>
      Object.values(answers).reduce(
        (count, value) => (value === null ? count : count + 1),
        0
      ),
    [answers]
  );

  const score = useMemo(() => {
    if (!isSubmitted) {
      return 0;
    }

    return QUESTIONS.reduce((total, question) => {
      const userAnswer = answers[question.id];
      return userAnswer === question.answerIndex ? total + 1 : total;
    }, 0);
  }, [answers, isSubmitted]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      email.trim().toLowerCase() === DEFAULT_CREDENTIALS.email &&
      password === DEFAULT_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError("Identifiants incorrects. Merci de vérifier vos accès.");
    }
  };

  const handleAnswerChange = (questionId: number, choiceIndex: number) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: choiceIndex,
    }));
  };

  const handleSubmitQuiz = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setAnswers(
      Object.fromEntries(QUESTIONS.map((question) => [question.id, null]))
    );
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-slate-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16 space-y-10">
        <div className="flex flex-col gap-4 text-center">
          <span className="text-sm uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
            Formation interne
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
            Module d&apos;évaluation RGIE
          </h1>
          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            Évaluez vos connaissances réglementaires et assurez-vous que vos
            équipes maîtrisent les fondamentaux du Règlement Général sur les
            Installations Électriques.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_minmax(280px,360px)] items-start">
          <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-emerald-100 dark:border-gray-800 p-8">
            {!isAuthenticated ? (
              <div className="space-y-6">
                <div className="space-y-3 text-left">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Connexion requise
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Accédez au module après vérification de vos identifiants de
                    formation interne. Contactez votre responsable si vous n&apos;avez
                    pas encore reçu vos accès.
                  </p>
                </div>
                <form className="space-y-5" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      E-mail professionnel
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="prenom.nom@electricity-pme.fr"
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Mot de passe
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>
                  {loginError ? (
                    <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
                  ) : null}
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 transition-colors"
                  >
                    Accéder au module
                  </button>
                </form>
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800 p-4 text-left">
                  <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">
                    Astuce
                  </h3>
                  <p className="text-sm text-emerald-700/80 dark:text-emerald-200/80">
                    Une fois connecté, vos réponses seront résumées avec les
                    rappels réglementaires associés pour favoriser la mémorisation.
                  </p>
                </div>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmitQuiz}>
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Questionnaire
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {answeredCount === QUESTIONS.length
                      ? "Toutes les questions sont renseignées. Validez pour obtenir votre score."
                      : `Questions répondues : ${answeredCount}/${QUESTIONS.length}.`}
                  </p>
                </div>

                <div className="space-y-6">
                  {QUESTIONS.map((question) => (
                    <fieldset
                      key={question.id}
                      className="space-y-4 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
                    >
                      <legend className="font-semibold text-gray-900 dark:text-gray-100">
                        {question.id}. {question.prompt}
                      </legend>
                      <div className="space-y-3">
                        {question.choices.map((choice, index) => {
                          const isChecked = answers[question.id] === index;
                          const isCorrect = question.answerIndex === index;
                          const showFeedback = isSubmitted && isChecked;

                          return (
                            <label
                              key={choice}
                              className={`flex items-start gap-3 rounded-lg border p-4 transition-colors cursor-pointer ${
                                isChecked
                                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                                  : "border-gray-200 dark:border-gray-800"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={index}
                                checked={isChecked}
                                onChange={() => handleAnswerChange(question.id, index)}
                                className="mt-1 h-4 w-4 accent-emerald-600"
                              />
                              <div className="flex-1 space-y-1">
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {choice}
                                </span>
                                {showFeedback ? (
                                  <p
                                    className={`text-sm ${
                                      isCorrect
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-red-600 dark:text-red-400"
                                    }`}
                                  >
                                    {isCorrect
                                      ? "Bonne réponse !"
                                      : "Ce choix n'est pas conforme."}
                                  </p>
                                ) : null}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      {isSubmitted ? (
                        <div className="rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-4 text-sm text-gray-700 dark:text-gray-300">
                          {question.explanation}
                        </div>
                      ) : null}
                    </fieldset>
                  ))}
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 transition-colors"
                  >
                    Valider mes réponses
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Réinitialiser
                  </button>
                </div>

                {isSubmitted ? (
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/40 p-6 text-center space-y-3">
                    <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                      Score obtenu : {score}/{QUESTIONS.length}
                    </p>
                    <p className="text-sm text-emerald-700/80 dark:text-emerald-200/80">
                      Analysez les explications pour consolider les bonnes
                      pratiques et partagez vos retours lors du prochain briefing
                      sécurité.
                    </p>
                  </div>
                ) : null}
              </form>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-emerald-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Objectifs pédagogiques
              </h2>
              <ul className="mt-4 space-y-3 text-left text-gray-600 dark:text-gray-300">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                  Comprendre les obligations de sécurité avant intervention.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                  Identifier les documents à remettre aux clients.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                  Vérifier les protections indispensables pour les personnes.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                  Planifier les contrôles réglementaires périodiques.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Besoin d&apos;aller plus loin ?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Retrouvez les ressources complètes sur le RGIE et les fiches
                pratiques à jour dans l&apos;espace documentation de l&apos;application.
              </p>
              <Link
                href="/ai-pdf"
                className="inline-flex items-center justify-center rounded-lg border border-emerald-500 text-emerald-600 dark:text-emerald-400 px-4 py-2 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
              >
                Explorer l&apos;assistant PDF
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
