import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(request: NextRequest) {
    // Gestione PDF
    if (request.nextUrl.pathname.endsWith(".pdf")) {
      const absoluteUrl = new URL(
        request.nextUrl.pathname,
        request.url
      ).toString();
      return NextResponse.rewrite(
        new URL(`/api/pdf?url=${encodeURIComponent(absoluteUrl)}`, request.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Se il percorso richiede autenticazione
        if (
          req.nextUrl.pathname.startsWith("/area-riservata") ||
          req.nextUrl.pathname.startsWith("/webinar") ||
          req.nextUrl.pathname.startsWith("/corsi")
        ) {
          return !!token; // true se l'utente è autenticato
        }

        // Per tutti gli altri percorsi, consenti l'accesso
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/docs/:path*",
    "/area-riservata/:path*",
    "/webinar/:path*",
    "/corsi/:path*",
  ],
};
