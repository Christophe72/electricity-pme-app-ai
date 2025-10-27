import fs from "fs";
import path from "path";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

// ⚙️ Lecture d’un PDF et extraction du texte (compatible Next.js)
export async function readPdfText(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), "public", filename);
  const data = new Uint8Array(fs.readFileSync(filePath));

  const pdf = await pdfjs.getDocument({ data }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: TextItem) => item.str).join(" ");
    fullText += `\n--- Page ${i} ---\n${text}\n`;
  }

  return fullText;
}
