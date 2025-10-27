/* eslint-disable */
// Wrapper CommonJS robuste pour charger la bonne entrée Node de pdf-parse
// Préfère l'implémentation Node CJS pour éviter les dépendances DOM (DOMMatrix, ImageData, etc.)

const pdfParse = require("pdf-parse");

module.exports = async function parsePDF(dataBuffer) {
  return await pdfParse(dataBuffer);
};
