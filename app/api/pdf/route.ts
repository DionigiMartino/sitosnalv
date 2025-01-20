// app/api/pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pdfPath = url.searchParams.get("url");

    if (!pdfPath) {
      return new NextResponse("PDF path not provided", { status: 400 });
    }

    // Ottieni il percorso relativo del file
    const relativePath = pdfPath.split("/docs/")[1];
    const fullPath = path.join(process.cwd(), "public", "docs", relativePath);

    // Leggi il file
    const fileBuffer = await fs.readFile(fullPath);

    // Restituisci il PDF con i corretti headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=${path.basename(fullPath)}`,
      },
    });
  } catch (error) {
    console.error("Error serving PDF:", error);
    return new NextResponse("PDF not found", { status: 404 });
  }
}
