import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(request: NextRequest) {
    // Se il file è in /public/docs, permetti l'accesso diretto
    if (request.nextUrl.pathname.startsWith("/docs/")) {
      return NextResponse.next();
    }

    // Per PDF e DOCX, usa il rewrite
    if (
      request.nextUrl.pathname.endsWith(".pdf") ||
      request.nextUrl.pathname.endsWith(".docx")
    ) {
      const absoluteUrl = new URL(
        request.nextUrl.pathname,
        request.url
      ).toString();

      // Determina il tipo di file e usa l'endpoint appropriato
      const fileType = request.nextUrl.pathname.split(".").pop();
      const endpoint = fileType === "pdf" ? "pdf" : "doc";

      return NextResponse.rewrite(
        new URL(
          `/api/${endpoint}?url=${encodeURIComponent(absoluteUrl)}`,
          request.url
        )
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (
          req.nextUrl.pathname.startsWith("/area-riservata") ||
          req.nextUrl.pathname.startsWith("/webinar") ||
          req.nextUrl.pathname.startsWith("/corsi")
        ) {
          return !!token;
        }
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
