import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.endsWith(".pdf")) {
    // Crea un'URL assoluta
    const absoluteUrl = new URL(
      request.nextUrl.pathname,
      request.url
    ).toString();

    return NextResponse.rewrite(
      new URL(`/api/pdf?url=${encodeURIComponent(absoluteUrl)}`, request.url)
    );
  }
}

export const config = {
  matcher: "/docs/:path*",
};
