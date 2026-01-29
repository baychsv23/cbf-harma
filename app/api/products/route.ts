// app/api/warehouses/route.ts

import { BooleanState, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { getProducts } from "@/lib/getData";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  paginatedResponse,
} from "@/lib/utils/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return handleApiAction(async () => {
    const session = await requirePermission(Permission.PRODUCT_VIEW);
    if (!session) throw new ApiError(translations.forbidden, 403);

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || DEFAULT_PAGE.toString());
    const limit = parseInt(
      searchParams.get("limit") || DEFAULT_LIMIT.toString(),
    );
    const name = searchParams.get("name");
    const isActive = searchParams.get("isActive");

    const where: any = {};

    if (name) {
      where.OR = [
        { nameLA: { contains: name } },
        { nameEN: { contains: name } },
      ];
    }
    if (isActive) where.isActive = isActive;

    const skip = (page - 1) * limit;

    const { data, total } = await getProducts({
      where,
      skip,
      limit,
    });

    return NextResponse.json(paginatedResponse(data, total, page, limit));
  });
}
export async function POST(req: Request) {
  return handleApiAction(async () => {
    const session = await requirePermission(Permission.PRODUCT_CREATE);
    const body = await req.json();
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

    // To include the 'message' for your Axios interceptor,
    // we return an object that the helper will spread into NextResponse
    return {
      ...newProduct,
      message: translations.createdSuccess,
    };
  });
}
