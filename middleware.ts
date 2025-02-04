import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export default async function middleware(request: NextRequest) {
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

  // Gestione autenticazione per le rotte protette
  const isAuthPath = ["/area-riservata", "/webinar", "/corsi"].some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isAuthPath) {
    const token = await getToken({ req: request });

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/docs/:path*", // Per i PDF
    "/area-riservata/:path*",
    "/webinar/:path*",
    "/corsi/:path*",
  ],
};
