// app/warehouses/route.ts

import { BooleanState, Permission, Role } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { getAccounts } from "@/lib/getData";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { handleApiAction } from "@/lib/handleApiAction";
import { getAuth, requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { getPaginationParams, paginatedResponse } from "@/lib/utils/pagination";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const locale = getRequestLocale(request);

  const t = await getTranslations({
    locale,
  });
  return handleApiAction(async () => {
    const session = await getAuth();
    if (!session) throw new ApiError(translations.forbidden, 403);
    if (session.user.role !== Role.ADMIN) {
      throw new ApiError(translations.forbidden, 403);
    }
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = getPaginationParams(searchParams);

    const where: any = {};

    // Pagination mode

    const skip = (page - 1) * limit;

    const { data, total } = await getAccounts({
      where,
      select: {
        id: true,
        userName: true,
        role: true,
        fullName: true,
        permissions: true,
        isActive: true,
      },
      skip,
      limit,
    });
    return {
      message: t(translations.fetchSuccess),
      ...paginatedResponse(data, total, page, limit),
    };
  });
}
