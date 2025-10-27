import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "../../../../lib/prisma";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    // Validation des données d'entrée
    if (!question) {
      return NextResponse.json(
        { error: "Question est requise" },
        { status: 400 }
      );
    }

    // Lecture du stock depuis SQLite
    const stock = await prisma.stockItem.findMany({
      select: { nom: true, quantite: true, seuil: true },
    });

    // Si aucun stock n'est encore enregistré
    if (stock.length === 0) {
      return NextResponse.json({
        answer: "Aucun article enregistré pour le moment dans le stock.",
      });
    }

    const prompt = `
    Tu es un assistant spécialisé dans la gestion du stock d'une société d'électricité.
    Voici le stock actuel : ${JSON.stringify(stock, null, 2)}.
    
    Analyse le stock et réponds à la question suivante de manière simple et claire.
    Si la question concerne les seuils, considère que le seuil minimum est indiqué pour chaque article.
    
    Question : ${question}
    
    Réponds en français et sois précis dans tes calculs.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.3, // Plus de précision, moins de créativité
    });

    const result = completion.choices[0].message?.content;

    if (!result) {
      return NextResponse.json(
        { error: "Aucune réponse générée" },
        { status: 500 }
      );
    }

    return NextResponse.json({ answer: result });
  } catch (error) {
    console.error("Erreur API OpenAI:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de la demande" },
      { status: 500 }
    );
  }
}
