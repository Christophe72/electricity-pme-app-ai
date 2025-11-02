export type Question = {
  id: number;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
};

export const QUESTIONS: Question[] = [
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
];
