import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((request) => {
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

  const isLoggedIn = !!request.auth;
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
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
