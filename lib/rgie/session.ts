import crypto from "node:crypto";

const SESSION_COOKIE_NAME = "rgie-training-session";
const SESSION_DURATION_SECONDS = 60 * 60 * 2; // 2 hours

type SessionPayload = {
  email: string;
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.RGIE_TRAINING_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "RGIE_TRAINING_SESSION_SECRET doit être défini pour sécuriser les sessions."
    );
  }

  return secret;
}

function createPayload(email: string): SessionPayload {
  return {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };
}

function toToken(payload: SessionPayload, secret: string) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64url");

  return `${data}.${signature}`;
}

function safeCompare(signatureA: string, signatureB: string) {
  const bufferA = Buffer.from(signatureA);
  const bufferB = Buffer.from(signatureB);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}

export function createSessionToken(email: string) {
  const secret = getSessionSecret();
  const payload = createPayload(email);

  return toToken(payload, secret);
}

export function verifySessionToken(token: string): SessionPayload | null {
  const secret = getSessionSecret();
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as SessionPayload;

    if (typeof payload.exp !== "number" || typeof payload.email !== "string") {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getSessionMaxAge() {
  return SESSION_DURATION_SECONDS;
}
