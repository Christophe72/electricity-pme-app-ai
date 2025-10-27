export interface PDFData {
  text: string;
  numpages: number;
}

export async function parsePDF(dataBuffer: Buffer): Promise<PDFData> {
  try {
    const pdfreader = (await import("pdfreader")) as unknown as {
      PdfReader: new () => {
        parseBuffer: (
          buffer: Buffer,
          cb: (
            err: unknown,
            item: { page?: number; text?: string } | null
          ) => void
        ) => void;
      };
    };
    const { PdfReader } = pdfreader;

    let text = "";
    let pageCount = 0;

    await new Promise<void>((resolve, reject) => {
      new PdfReader().parseBuffer(dataBuffer, (err, item) => {
        if (err) return reject(err);
        if (!item) return resolve(); // fin du document
        if (item.page) pageCount = Math.max(pageCount, item.page);
        if (item.text) text += item.text + " ";
      });
    });

    return {
      text: text.trim(),
      numpages: pageCount || 1,
    };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF");
  }
}
