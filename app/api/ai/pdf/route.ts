import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { parsePDF } from "@/lib/pdf-helper";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "La question est requise" },
        { status: 400 }
      );
    }

    // Lecture du PDF et extraction du texte
    const filePath = path.join(process.cwd(), "public", "certification.pdf");

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        {
          error:
            "Fichier PDF non trouvé. Veuillez placer un fichier 'certification.pdf' dans le dossier /public",
        },
        { status: 404 }
      );
    }

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await parsePDF(dataBuffer);

    const prompt = `
Voici un document de certification (contenu partiel ci-dessous) :
${pdfData.text.slice(0, 8000)}

Réponds à la question suivante de manière claire et précise :
${question}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({
      answer: completion.choices[0].message?.content,
      pages: pdfData.numpages,
    });
  } catch (error) {
    console.error("Erreur lors du traitement:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de la question" },
      { status: 500 }
    );
  }
}
