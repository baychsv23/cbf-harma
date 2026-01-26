// app/api/warehouses/route.ts

import { BooleanState, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return handleApiAction(async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;

    // ค้นหาจากชื่อ (รองรับทั้ง LA และ EN)
    const name = searchParams.get("name");
    const category = searchParams.get("category");

    const where: any = {};
    if (name) {
      where.OR = [
        { nameEN: { contains: name } },
        { nameLA: { contains: name } },
        { sku: { contains: name } },
      ];
    }
    if (category) where.category = category;

    // Pagination mode
    if (page && limit) {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        database.product.findMany({
          skip,
          take: limit,
          where,
          orderBy: { createdAt: "desc" },
          include: {
            symptom: true,
            createdBy: { select: { fullName: true } },
            updatedBy: { select: { fullName: true } }
          },
        }),
        database.product.count({ where }),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / limit));
      const dataWithStt = data.map((item, index) => ({
        ...item,
        stt: skip + index + 1,
      }));

      return NextResponse.json({
        success: true,
        data: dataWithStt,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    }

    // Fetch all mode
    const data = await database.product.findMany({
      where: { ...where, isActive: BooleanState.TRUE },
    });

    const total = data.length;

    return NextResponse.json({
      success: true,
      data: data,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: total,
        hasNext: false,
        hasPrev: false,
      },
    });
  });
}
export async function POST(req: Request) {
  return handleApiAction(async () => {
    const session = await requirePermission(Permission.PRODUCT_CREATE);
    const body = await req.json();

    const creator = session.user.id;
    if (!body.nameEN || !body.nameLA || !body.sku || !body.slug) {
      throw new ApiError(translations.allFiledRequired, 400);
    }
    const { symptomIds } = body;

    const newProduct = await database.product.create({
      data: {
        slug: body.slug,
        sku: body.sku,
        createdById: creator,
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
        symptom: {
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
