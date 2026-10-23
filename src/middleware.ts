import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "admin_session";

function expectedToken(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page and its API must stay reachable.
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const session = req.cookies.get(ADMIN_COOKIE)?.value;
  if (session && session === expectedToken()) {
    return NextResponse.next();
  }

  // Not authenticated.
  if (pathname.startsWith("/api/")) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
