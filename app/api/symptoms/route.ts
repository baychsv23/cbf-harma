// app/api/warehouses/route.ts

import { BooleanState, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { getSymptoms } from "@/lib/getData";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { DEFAULT_LIMIT, DEFAULT_PAGE, paginatedResponse } from "@/lib/utils/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return handleApiAction(async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || DEFAULT_PAGE.toString());
    const limit = parseInt(
      searchParams.get("limit") || DEFAULT_LIMIT.toString())

    const where: any = {};
    const name = searchParams.get("name")

    if (name) {
      where.OR = [
        { nameEN: { contains: name } },
        { nameLA: { contains: name } },
      ];
    }

    const skip = (page - 1) * limit;

    const { data, total } = await getSymptoms({
      where,
      skip,
      limit,
    });

    return NextResponse.json(paginatedResponse(data, total, page, limit));

    // Fetch all mode
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
