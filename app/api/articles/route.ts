// app/api/warehouses/route.ts

import { ArticleStatus, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { getArticles } from "@/lib/getData";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { DEFAULT_LIMIT, DEFAULT_PAGE, paginatedResponse } from "@/lib/utils/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return handleApiAction(async () => {
    const session = await requirePermission(Permission.ARTICLE_VIEW)
    if (!session) throw new ApiError(translations.forbidden, 403)
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || DEFAULT_PAGE.toString());
    const limit = parseInt(
      searchParams.get("limit") || DEFAULT_LIMIT.toString(),
    );
    const title = searchParams.get("title");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const where: any = {};

    if (title) {
      where.OR = [
        { titleEN: { contains: title } },
        { titleLA: { contains: title } },
      ];
    }
    if (status) where.status = status;
    if (type) where.type = type;


    const skip = (page - 1) * limit;

    const { data, total } = await getArticles({
      where,
      skip,
      limit,
      include: {
        products: { select: { id: true, nameEN: true, nameLA: true } },
        createdBy: { select: { fullName: true } },
        updatedBy: { select: { fullName: true } },
      },
    });
    return NextResponse.json(paginatedResponse(data, total, page, limit));
  });
}
export async function POST(req: Request) {
  return handleApiAction(async () => {
    // 1. ตรวจสอบสิทธิ์ (ใช้ Permission.ARTICLE_CREATE)
    const session = await requirePermission(Permission.ARTICLE_CREATE);
    const body = await req.json();
    if (!session) throw new ApiError(translations.forbidden, 403);
    const creator = session.user.id;

    // 2. Validate ข้อมูลที่จำเป็นต้องมี
    const {
      productIds,
      titleEN,
      titleLA,
      slug,
      contentEN,
      contentLA,
      status,
      type,
    } = body;
    if (!titleEN || !titleLA || !slug) {
      throw new ApiError(translations.allFiledRequired, 400);
    }
    const now = new Date();

    const year = now.getFullYear(); // ปี เช่น 2026
    const month = now.getMonth() + 1;

    // รับ array ของ product IDs มาจากหน้าบ้าน

    // 3. บันทึกลงฐานข้อมูล
    const newArticle = await database.article.create({
      data: {
        slug: slug,
        titleEN: titleEN,
        titleLA: titleLA,
        contentEN: contentEN || "", // กันค่า null
        contentLA: contentLA || "",
        coverImage: body.coverImage,
        coverImagePublicId: body.coverImagePublicId,

        type: type,
        status: status,

        // Logic: ถ้าสถานะเป็น PUBLISHED ให้ใส่วันที่ปัจจุบันทันที
        publishedAt: status === ArticleStatus.PUBLISHED ? now : null,

        year: year,
        month: month,

        createdById: creator,

        // Handle Relation: Tie-in Products (Many-to-Many)
        products: {
          connect: productIds?.map((id: string) => ({ id })) || [],
        },
      },
      select: { id: true },
    });

    // 4. ส่งค่ากลับพร้อม Message
    return {
      ...newArticle,
      message: translations.createdSuccess,
    };
  });
}
