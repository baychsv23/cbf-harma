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

    const where: any = {};

    if (page && limit) {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        database.symptom.findMany({
          skip,
          take: limit,
          where,
          orderBy: { createdAt: "desc" },
        }),
        database.symptom.count({ where }),
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
    const data = await database.symptom.findMany({
      where: { ...where },
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
    await requirePermission(Permission.SYMPTOM_CREATE);
    const body = await req.json();

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
      ...newProduct,
      message: translations.createdSuccess,
    };
  });
}
