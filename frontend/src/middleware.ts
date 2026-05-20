import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_ROLE_COOKIE } from "@/shared/constants/api";
import { AUTH_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES, ROUTES } from "@/shared/constants/routes";
import type { UserRole } from "@/shared/types/auth";

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(route)),
  );
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route));
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isAdminRoute(pathname: string): boolean {
  return pathname === ROUTES.ADMIN || pathname.startsWith(`${ROUTES.ADMIN}/`);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const role = request.cookies.get(AUTH_ROLE_COOKIE)?.value as UserRole | undefined;
  const isAuthenticated = Boolean(token);

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute(pathname) && isAuthenticated && role !== "ADMIN") {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  if (isAuthRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  if (pathname === ROUTES.HOME && isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  if (!isPublicRoute(pathname) && !isProtectedRoute(pathname) && !isAuthRoute(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
