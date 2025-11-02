import { NextResponse } from "next/server";

const email = process.env.RGIE_TRAINING_EMAIL;
const password = process.env.RGIE_TRAINING_PASSWORD;

export async function POST(request: Request) {
  if (!email || !password) {
    return NextResponse.json(
      { message: "Module non configuré. Contactez votre administrateur." },
      { status: 500 }
    );
  }

  try {
    const { email: providedEmail, password: providedPassword } = await request.json();

    if (
      typeof providedEmail !== "string" ||
      typeof providedPassword !== "string"
    ) {
      return NextResponse.json(
        { message: "Requête invalide." },
        { status: 400 }
      );
    }

    if (
      providedEmail.trim().toLowerCase() === email.toLowerCase() &&
      providedPassword === password
    ) {
      return NextResponse.json({ status: "ok" });
    }

    return NextResponse.json(
      { message: "Identifiants incorrects. Merci de vérifier vos accès." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { message: "Impossible de vérifier vos accès pour le moment." },
      { status: 500 }
    );
  }
}
