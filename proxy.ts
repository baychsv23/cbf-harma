// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { Permission, Role } from "./app/generated/prisma/enums";
import { routing } from "./i18n/routing";
import createIntlMiddleware from "next-intl/middleware";

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
  const PUBLIC = ["/about", "/auth/signup"];
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
  if (!token?.permissions) return false;
  return requiredPermissions.every((perm) => token.permissions.includes(perm));
}

// --------------------------------------------------
// Unified route configuration
// --------------------------------------------------
interface RouteConfig {
  roles?: Role[];
  permissions?: Permission[];
  authOnly?: boolean;
  public?: boolean;
}

const ROUTES: Record<string, RouteConfig> = {
  // Public
  "/about": { public: true },
  "/auth/signup": { public: true },


  // Auth only
  "/profile": { authOnly: true },
  "/shopping-online": { authOnly: true },
  // Role-only
  "/admin": { roles: [Role.ADMIN] },

  // Permission-based
  "/accounts": { permissions: [Permission.USER_VIEW] },
  "/customers": { permissions: [Permission.CUSTOMER_VIEW] },
  "/services": { permissions: [Permission.SERVICE_VIEW] },
  "/invoices": { permissions: [Permission.INVOICE_VIEW] },
  "/quotations": { permissions: [Permission.QUOTATION_VIEW] },
  "/bill-services": { permissions: [Permission.BILL_SERVICE_VIEW] },
  "/receipt-services": { permissions: [Permission.RECEIPT_SERVICE_VIEW] },
  "/goods-receipts": { permissions: [Permission.GOODS_RECEIPT_VIEW] },
  "/export-invoices": { permissions: [Permission.EXPORT_VIEW] },
  "/products": { permissions: [Permission.PRODUCT_VIEW] },
  "/suppliers": { permissions: [Permission.SUPPLIER_VIEW] },
  "/exports": { permissions: [Permission.EXPORT_VIEW] },
  "/exchanges-rates": { permissions: [Permission.EXCHANGE_RATE_VIEW] },
  "/pricing-rules": { permissions: [Permission.PRICING_RULE_VIEW] },
  "/brands": { permissions: [Permission.BRAND_VIEW] },
  "/unit-packs": { permissions: [Permission.UNIT_PACK_VIEW] },
  "/online-packages": {
    permissions: [Permission.ONLINE_PACKAGE_VIEW],
  },
  "/shipments": { permissions: [Permission.SHIPMENT_VIEW] }
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

      // Public (allow all)
      if (config.public) {
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
