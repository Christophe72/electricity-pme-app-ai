import fs from "fs";
import path from "path";
import { PDFExtract } from "pdf.js-extract";

interface PDFItem {
  str: string;
}

interface PDFPage {
  content: PDFItem[];
}

interface PDFData {
  pages: PDFPage[];
}

export async function readPdfText(filename: string): Promise<string> {
  try {
    const pdfPath = path.join(process.cwd(), "public", filename);

    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found: ${filename}`);
    }

    const pdfExtract = new PDFExtract();
    const data = await new Promise<PDFData>((resolve, reject) => {
      pdfExtract.extract(pdfPath, {}, (err: Error | null, data: PDFData) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // Extract text from all pages
    const text = data.pages
      .map((page: PDFPage) =>
        page.content.map((item: PDFItem) => item.str).join(" ")
      )
      .join("\n");

    return text;
  } catch (error) {
    console.error("Error reading PDF:", error);
    throw new Error("Failed to read PDF file");
  }
}
