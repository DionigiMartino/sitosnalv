import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Controlla se l'URL richiesto è un PDF
  if (request.nextUrl.pathname.endsWith(".pdf")) {
    // Forza il refresh della pagina per evitare il routing client-side
    return NextResponse.rewrite(new URL(request.nextUrl.pathname, request.url));
  }
}

export const config = {
  matcher: [
    // Applica il middleware solo ai file PDF in /docs
    "/docs/:path*",
  ],
};
