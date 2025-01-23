// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

// Export del middleware per l'autenticazione
export const middleware = withAuth(
  function middleware(req) {
    // Gestione PDF
    if (req.nextUrl.pathname.endsWith(".pdf")) {
      const absoluteUrl = new URL(req.nextUrl.pathname, req.url).toString();

      return NextResponse.rewrite(
        new URL(`/api/pdf?url=${encodeURIComponent(absoluteUrl)}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Permetti accesso libero ai PDF
        if (req.nextUrl.pathname.startsWith("/docs/")) {
          return true;
        }
        // Richiedi autenticazione per area-riservata
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        // Permetti accesso a tutte le altre route
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/docs/:path*", "/dashboard/:path*"],
};
