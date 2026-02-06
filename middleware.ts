import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth API routes, registration API, and static assets
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/register") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isSecure = request.nextUrl.protocol === "https:";
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    salt: isSecure ? "__Secure-authjs.session-token" : "authjs.session-token",
    cookieName: isSecure ? "__Secure-authjs.session-token" : "authjs.session-token",
  });
  const isLoggedIn = !!token;
  const isOnLoginPage = pathname === "/login";
  const isOnRegisterPage = pathname === "/register";

  // Redirect logged-in users away from login/register pages
  if (isLoggedIn && (isOnLoginPage || isOnRegisterPage)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to login (except login/register pages)
  if (!isLoggedIn && !isOnLoginPage && !isOnRegisterPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
