import { NextResponse } from "next/server";

import {
  createSessionToken,
  getSessionCookieName,
  getSessionMaxAge,
} from "@/lib/rgie/session";

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
    const { email: providedEmail, password: providedPassword } =
      await request.json();

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
      const response = NextResponse.json({ status: "ok" });

      try {
        const sessionToken = createSessionToken(email);
        response.cookies.set({
          name: getSessionCookieName(),
          value: sessionToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: getSessionMaxAge(),
        });
      } catch (error) {
        console.error("RGIE session creation failed", error);
        return NextResponse.json(
          { message: "Module non configuré. Contactez votre administrateur." },
          { status: 500 }
        );
      }

      return response;
    }

    const response = NextResponse.json(
      { message: "Identifiants incorrects. Merci de vérifier vos accès." },
      { status: 401 }
    );

    response.cookies.set({
      name: getSessionCookieName(),
      value: "",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("RGIE authentication failed", error);
    return NextResponse.json(
      { message: "Impossible de vérifier vos accès pour le moment." },
      { status: 500 }
    );
  }
}
