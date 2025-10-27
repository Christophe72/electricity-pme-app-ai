/**
 * Wrapper pour pdf-parse compatible avec Next.js
 * Utilise createRequire pour charger le module CommonJS
 */

import { createRequire } from "module";

// Créer une fonction require pour charger les modules CommonJS
const requireFunc = createRequire(import.meta.url);

export async function parsePDF(dataBuffer: Buffer) {
  // Charger pdf-parse via require
  const pdfParse = requireFunc("pdf-parse");
  return await pdfParse(dataBuffer);
}
