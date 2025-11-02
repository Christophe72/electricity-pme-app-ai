import type { Metadata } from "next";
import QuizModule from "./quiz-module";

export const metadata: Metadata = {
  title: "Module RGIE",
  description:
    "Module d'entraînement pour tester les connaissances RGIE avec accès sécurisé.",
};

export default function RgiePage() {
  return <QuizModule />;
}
