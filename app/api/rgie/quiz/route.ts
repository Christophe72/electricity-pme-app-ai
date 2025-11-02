import { NextRequest, NextResponse } from "next/server";

import { QUESTIONS } from "@/lib/rgie/questions";
import {
  getSessionCookieName,
  verifySessionToken,
} from "@/lib/rgie/session";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get(getSessionCookieName());

  if (!sessionCookie) {
    return NextResponse.json(
      { message: "Authentification requise." },
      { status: 401 }
    );
  }

  const isValid = verifySessionToken(sessionCookie.value);

  if (!isValid) {
    const response = NextResponse.json(
      { message: "Session expirée. Merci de vous reconnecter." },
      { status: 401 }
    );
    response.cookies.set({
      name: getSessionCookieName(),
      value: "",
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  return NextResponse.json({ questions: QUESTIONS });
}
