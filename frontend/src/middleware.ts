import { NextRequest, NextResponse } from "next/server";

// Lightweight check: does a refreshToken cookie exist at all?
// Full verification (is it valid? what role?) happens client-side via AuthContext,
// since the actual JWT secret lives only on the backend.
const PROTECTED_PREFIXES = ["/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const hasSession = req.cookies.has("refreshToken");
  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};