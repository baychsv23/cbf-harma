// app/warehouses/route.ts

import { ArticleStatus, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { getArticles } from "@/lib/getData";
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
    const session = await requirePermission(Permission.ARTICLE_VIEW);
    if (!session) throw new ApiError(translations.forbidden, 403);
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = getPaginationParams(searchParams);
    const title = searchParams.get("title");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const year = Number(searchParams.get("year"));
    const month = Number(searchParams.get("month"));
    const where: any = {};

    if (title) {
      where.OR = [
        { titleEN: { contains: title, mode: "insensitive" } },
        { titleLA: { contains: title, mode: "insensitive" } },
      ];
    }

    if (status) where.status = status;
    if (type) where.type = type;
    if (year) where.year = year;
    if (month) where.month = month;

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
      orderBy: { createdAt: "desc" },
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
    // 1. ตรวจสอบสิทธิ์ (ใช้ Permission.ARTICLE_CREATE)
    const session = await requirePermission(Permission.ARTICLE_CREATE);
    const body = await request.json();
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
      coverImage,
      coverImagePublicId,
      contentImage,
      contentImagePublicId,
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
        slug,
        titleEN,
        titleLA,
        contentEN: contentEN || "", // กันค่า null
        contentLA: contentLA || "",
        coverImage,
        coverImagePublicId,
        contentImage,
        contentImagePublicId,
        type,
        status,
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
      message: t(translations.createdSuccess),
    };
  }, t);
}
