// app/warehouses/route.ts

import { BooleanState, ImageType, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { getAnnouncements } from "@/lib/getData";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  getPaginationParams,
  paginatedResponse,
} from "@/lib/utils/pagination";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const locale = getRequestLocale(request);
  const t = await getTranslations({
    locale,
  });
  return handleApiAction(async () => {
    const session = await requirePermission(Permission.ANNOUNCEMENT_VIEW);
    if (!session) throw new ApiError(translations.forbidden, 403);
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = getPaginationParams(searchParams);
    const type = searchParams.get("type");
    const isPublic = searchParams.get("isPublic");

    const where: any = {};

    if (type) where.type = type;
    if (isPublic) where.isPublic = isPublic;

    const skip = (page - 1) * limit;

    const { data, total } = await getAnnouncements({
      where,
      skip,
      limit,
    });
    return {
      message: t(translations.fetchSuccess),
      ...paginatedResponse(data, total, page, limit),
    };
  });
}

export async function POST(request: NextRequest) {
  const locale = getRequestLocale(request);

  const t = await getTranslations({
    locale,
  });
  return handleApiAction(async () => {
    const session = await requirePermission(Permission.ANNOUNCEMENT_CREATE);
    if (!session) throw new ApiError(translations.forbidden, 403);
    const body = await request.json();

    const { image, type, imagePublicId } = body;
    if (!image || !type) {
      throw new ApiError(translations.allFiledRequired, 400);
    }
    const existingCount = await database.announcement.count({
      where: { type: type },
    });

    // 2. ตรวจสอบเงื่อนไข Banner (Limit 5)
    if (type === ImageType.BANNER && existingCount >= 5) {
      throw new ApiError(translations.limitBanner, 400);
    }

    // 3. ตรวจสอบเงื่อนไข Announcement (Limit 1)
    if (type === ImageType.ANNOUNCEMENT && existingCount >= 1) {
      throw new ApiError(translations.limitAnnouncement, 400);
    }

    // --- จบส่วนการตรวจสอบ ---

    const newProduct = await database.announcement.create({
      data: {
        image: image,
        imagePublicId: imagePublicId,
        type: type,
      },
      select: { id: true },
    });

    return {
      ...newProduct,
      message: t(translations.createdSuccess),
    };
  }, t);
}
