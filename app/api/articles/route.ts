// app/api/warehouses/route.ts

import { ArticleStatus, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { getArticles } from "@/lib/getData";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return handleApiAction(async () => {
    const session = await requirePermission(Permission.ARTICLE_VIEW);
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const title = searchParams.get("title");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const where: any = {};
    if (!session) {
      where.status = ArticleStatus.PUBLISHED
    }
    if (session) {
      if (status) where.status = status;
    }

    if (title) {
      where.OR = [
        { titleEN: { contains: title } },
        { titleLA: { contains: title } },
      ];
    }

    if (type) where.type = type;

    if (page && limit) {
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

    const { data, total } = await getArticles({ where });

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
