// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { routing } from "./i18n/routing";
import createIntlMiddleware from "next-intl/middleware";
import { Permission, Role } from "./generated/prisma/enums";

const intlMiddleware = createIntlMiddleware(routing);

// --------------------------------------------------
// Helper functions
// --------------------------------------------------

function getLocaleAndPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];
  const pathWithoutLocale = "/" + segments.slice(1).join("/") || "/";
  return { locale, pathWithoutLocale };
}

function isPublicRoute(path: string): boolean {
  const PUBLIC = ["/", "/public", "/unauthorized", "/auth/signin"];
  return PUBLIC.some((route) => path === route || path.startsWith(route + "/"));
}

function isAuthRoute(path: string): boolean {
  const AUTH_ROUTES = ["/auth/signin"];
  return AUTH_ROUTES.some(
    (route) => path === route || path.startsWith(route + "/")
  );
}

function hasPermission(token: any, requiredPermissions: string[]): boolean {
  if (token.role === Role.ADMIN) return true;
  // ป้องกันกรณี permissions เป็น null หรือไม่ใช่ array
  const userPerms = Array.isArray(token?.permissions) ? token.permissions : [];
  return requiredPermissions.every((perm) => userPerms.includes(perm));
}

// --------------------------------------------------
// Unified route configuration
// --------------------------------------------------
interface RouteConfig {
  roles?: Role[];
  permissions?: Permission[];
  authOnly?: boolean;
}

const ROUTES: Record<string, RouteConfig> = {
  // Auth only
  "/profile": { authOnly: true },
  // Role-only
  "/admin": { roles: [Role.ADMIN] },

  // Permission-based
  "/accounts": { permissions: [Permission.USER_VIEW] },
  "/products": { permissions: [Permission.PRODUCT_VIEW] }
};

// --------------------------------------------------
// Middleware logic
// --------------------------------------------------
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale, pathWithoutLocale } = getLocaleAndPath(pathname);

  // Skip static & API routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get auth token
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  // 1️⃣ Auth routes (signin/register) - redirect if already logged in
  if (isAuthRoute(pathWithoutLocale)) {
    if (token) return NextResponse.redirect(new URL(`/${locale}`, request.url));
    return intlMiddleware(request);
  }

  // 2️⃣ Public routes
  if (isPublicRoute(pathWithoutLocale)) {
    return intlMiddleware(request);
  }

  // 3️⃣ Authentication required for all other routes
  if (!token) {
    const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
    signInUrl.searchParams.set("callbackUrl", pathWithoutLocale);
    return NextResponse.redirect(signInUrl);
  }

  // 4️⃣ Unified route check
  for (const [route, config] of Object.entries(ROUTES)) {
    if (pathWithoutLocale.startsWith(route)) {
      // Role-based restriction
      if (config.roles && !config.roles.includes(token.role as Role)) {
        return NextResponse.redirect(
          new URL(`/${locale}/unauthorized`, request.url)
        );
      }

      // Permission check
      if (config.permissions && !hasPermission(token, config.permissions)) {
        return NextResponse.redirect(
          new URL(`/${locale}/unauthorized`, request.url)
        );
      }

      // Auth-only routes (just needs login)
      if (config.authOnly) {
        return intlMiddleware(request);
      }
    }
  }

  // 5️⃣ Default allow
  return intlMiddleware(request);
}

// --------------------------------------------------
// Matcher config
// --------------------------------------------------
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
