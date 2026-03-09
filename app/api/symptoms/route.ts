// app/api/warehouses/route.ts

import { BooleanState, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { getSymptoms } from "@/lib/getData";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { DEFAULT_LIMIT, DEFAULT_PAGE, getPaginationParams, paginatedResponse } from "@/lib/utils/pagination";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const locale = getRequestLocale(request);
  const t = await getTranslations({
    locale,
  });
  return handleApiAction(async () => {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = getPaginationParams(searchParams);

    const where: any = {};
    const name = searchParams.get("name")

    if (name) {
      where.OR = [
        { nameEN: { contains: name, mode: 'insensitive' } },
        { nameLA: { contains: name, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const { data, total } = await getSymptoms({
      where,
      skip,
      limit,
    });

    return { message: t(translations.fetchSuccess), ...paginatedResponse(data, total, page, limit) };
  });
}

export async function POST(request: NextRequest) {
  const locale = getRequestLocale(request);
  const t = await getTranslations({
    locale,
  });
  return handleApiAction(async () => {
    await requirePermission(Permission.SYMPTOM_CREATE);
    const body = await request.json();

    if (!body.nameEN || !body.nameLA) {
      throw new ApiError(translations.allFiledRequired, 400);
    }

    const newProduct = await database.symptom.create({
      data: {
        nameEN: body.nameEN,
        nameLA: body.nameLA,
      },
      select: { id: true },
    });

    // To include the 'message' for your Axios interceptor,
    // we return an object that the helper will spread into NextResponse
    return {
      data: newProduct,
      message: t(translations.createdSuccess),
    };
  }, t);
}
