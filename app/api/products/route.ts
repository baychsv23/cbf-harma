// app/api/warehouses/route.ts

import { BooleanState, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { getProducts } from "@/lib/getData";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { getPaginationParams, paginatedResponse } from "@/lib/utils/pagination";
import { getTranslations } from "next-intl/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const locale = getRequestLocale(request);
  const t = await getTranslations({
    locale,
  });
  return handleApiAction(async () => {
    const session = await requirePermission(Permission.PRODUCT_VIEW);
    if (!session) throw new ApiError(translations.forbidden, 403);

    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = getPaginationParams(searchParams);
    const name = searchParams.get("name");
    const isActive = searchParams.get("isActive");
    const category = searchParams.get("category");
    const categorySub = searchParams.get("categorySub");

    const where: any = {};
    if (category) where.category = category;
    if (categorySub) where.categorySub = categorySub;
    if (name) {
      where.OR = [
        { nameLA: { contains: name, mode: "insensitive" } },
        { nameEN: { contains: name, mode: "insensitive" } },
        { sku: { contains: name, mode: "insensitive" } },
      ];
    }
    if (isActive) where.isActive = isActive;

    const skip = (page - 1) * limit;

    const { data, total } = await getProducts({
      where,
      skip,
      limit,
      orderBy: { sku: "asc" },
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
    const session = await requirePermission(Permission.PRODUCT_CREATE);
    const body = await request.json();
    if (!session) throw new ApiError(translations.forbidden, 403);
    const createdById = session.user.id;
    if (!body.nameEN || !body.nameLA || !body.sku || !body.slug) {
      throw new ApiError(translations.allFiledRequired, 400);
    }
    const { symptomIds } = body;

    const newProduct = await database.product.create({
      data: {
        slug: body.slug,
        sku: body.sku,
        createdById,
        nameEN: body.nameEN,
        nameLA: body.nameLA,
        genericName: body.genericName,
        dosage: body.dosage,
        packaging: body.packaging,
        indicationEN: body.indicationEN,
        indicationLA: body.indicationLA,
        category: body.category,
        categorySub: body.categorySub,
        productImage: body.productImage,
        productImagePublicId: body.productImagePublicId,
        isPrescription: body.isPrescription || BooleanState.FALSE,
        symptoms: {
          connect: symptomIds.map((id: string) => ({ id })),
        },
      },
      select: { id: true },
    });
    return {
      ...newProduct,
      message: t(translations.createdSuccess),
    };
  }, t);
}
