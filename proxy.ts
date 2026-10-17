// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";
import { routing } from "./i18n/routing";
import createIntlMiddleware from "next-intl/middleware";
import { Permission, Role } from "./generated/prisma/enums";

const intlMiddleware = createIntlMiddleware(routing);

function getLocaleAndPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];
  const pathWithoutLocale = "/" + segments.slice(1).join("/") || "/";
  return { locale, pathWithoutLocale };
}

function isPublicRoute(path: string): boolean {
  const PUBLIC = ["/", "/cbf", "/unauthorized", "/forbidden", "/auth/signin"];

  return PUBLIC.some((route) => path === route || path.startsWith(route + "/"));
}

function isAuthRoute(path: string): boolean {
  const AUTH_ROUTES = ["/auth/signin"];
  return AUTH_ROUTES.some(
    (route) => path === route || path.startsWith(route + "/"),
  );
}

function hasPermission(token: JWT, requiredPermissions: Permission[]): boolean {
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
  // Role-only
  "/back-office/admin": { roles: [Role.ADMIN] },
  "/back-office/accounts": { roles: [Role.ADMIN] },

  // Permission-based
  "/back-office/products": { permissions: [Permission.PRODUCT_VIEW] },
  "/back-office/articles": { permissions: [Permission.ARTICLE_VIEW] },
  "/back-office/symptoms": { permissions: [Permission.SYMPTOM_VIEW] },
  "/back-office/announcements": { permissions: [Permission.ANNOUNCEMENT_VIEW] },

  // Auth only
  "/back-office/profile": { authOnly: true },
  "/back-office": { authOnly: true },
};

function getMatchingRoute(path: string): { route: string; config: RouteConfig } | null {
  // Sort by path length descending so specific subroutes match before base /back-office
  const sortedEntries = Object.entries(ROUTES).sort(
    ([a], [b]) => b.length - a.length,
  );
  for (const [route, config] of sortedEntries) {
    if (path === route || path.startsWith(route + "/")) {
      return { route, config };
    }
  }
  return null;
}

// --------------------------------------------------
// Middleware / Proxy logic
// --------------------------------------------------
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip other static & non-public API routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const { locale, pathWithoutLocale } = getLocaleAndPath(pathname);

  // 1️⃣ Auth routes (signin/register) - redirect if already logged in
  if (isAuthRoute(pathWithoutLocale)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXT_AUTH_SECRET,
    });
    if (token) return NextResponse.redirect(new URL(`/${locale}`, request.url));
    return intlMiddleware(request);
  }

  // 2️⃣ Public routes
  if (isPublicRoute(pathWithoutLocale)) {
    return intlMiddleware(request);
  }

  // 3️⃣ Check if this route is a protected route (Admin / Back-office)
  const matchedRoute = getMatchingRoute(pathWithoutLocale);
  if (matchedRoute) {
    const { config } = matchedRoute;
    const token = await getToken({
      req: request,
      secret: process.env.NEXT_AUTH_SECRET,
    });

    // Authentication required
    if (!token) {
      return NextResponse.redirect(
        new URL(`/${locale}/unauthorized`, request.url),
      );
    }

    // Role-based restriction
    if (config.roles && !config.roles.includes(token.role as Role)) {
      return NextResponse.redirect(
        new URL(`/${locale}/forbidden`, request.url),
      );
    }

    // Permission check
    if (config.permissions && !hasPermission(token, config.permissions)) {
      return NextResponse.redirect(
        new URL(`/${locale}/forbidden`, request.url),
      );
    }

    // Auth-only or authorized
    return intlMiddleware(request);
  }

  // 4️⃣ Unmatched / unknown routes - pass through so Next.js handles 404 (not-found)
  return intlMiddleware(request);
}

// --------------------------------------------------
// Matcher config
// --------------------------------------------------
export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
