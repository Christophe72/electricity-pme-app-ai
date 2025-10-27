// Wrapper JavaScript pour pdf-parse
// Ce fichier utilise des imports ES6

import pdfParse from "pdf-parse";

export default async function parsePDF(dataBuffer) {
  return await pdfParse(dataBuffer);
}
