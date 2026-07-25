import { ArticleStatus, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { handleApiAction } from "@/lib/handleApiAction";
import { logger } from "@/lib/logger";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { NextRequest } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { getArticleById } from "@/lib/getDataById";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { getTranslations } from "next-intl/server";
import { revalidateTag } from "next/cache";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const locale = getRequestLocale(request);
    const t = await getTranslations({
        locale,
    });
    return handleApiAction(async () => {
        const { id } = await params;

        // 1. ตรวจสอบสิทธิ์ (User ต้องมีสิทธิ์แก้ไขบทความ)
        const session = await requirePermission(Permission.ARTICLE_UPDATE);
        if (!session) throw new ApiError(translations.forbidden, 403)


        // 2. รับข้อมูลจาก Body
        const body = await request.json();

        // Validate ข้อมูลพื้นฐาน
        if (!body.titleEN || !body.titleLA || !body.slug) {
            throw new ApiError(translations.allFiledRequired, 400);
        }

        // ตรวจสอบว่ามีบทความนี้อยู่จริงไหม
        const existingArticle = await getArticleById(id, { select: { publishedAt: true, coverImage: true, coverImagePublicId: true, contentImage: true, contentImagePublicId: true, slug: true } })

        if (!existingArticle) {
            throw new ApiError(translations.notFound, 404);
        }
        if (
            body.coverImage &&
            body.coverImage !== existingArticle.coverImage
        ) {
            try {
                const publicId = existingArticle.coverImagePublicId
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }
            } catch (error) {
                logger.error("Cloudinary Delete Error:", error);
            }
        }

        if (
            body.contentImage &&
            body.contentImage !== existingArticle.contentImage
        ) {
            try {
                const publicId = existingArticle.contentImagePublicId
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }
            } catch (error) {
                logger.error("Cloudinary Delete Error:", error);
            }
        }

        const { productIds } = body; // Array ของ Product IDs ที่จะ Tie-in

        let newPublishedAt = existingArticle.publishedAt;
        if (body.status === ArticleStatus.PUBLISHED && !existingArticle.publishedAt) {
            newPublishedAt = new Date();
        } else if (body.status === ArticleStatus.DRAFT) {
            newPublishedAt = null;
        }

        // 4. อัปเดตข้อมูล
        const updatedArticle = await database.article.update({
            where: { id },
            data: {
                slug: body.slug,
                titleEN: body.titleEN,
                titleLA: body.titleLA,
                contentEN: body.contentEN,
                contentLA: body.contentLA,
                coverImage: body.coverImage,
                coverImagePublicId: body.coverImagePublicId,
                contentImage: body.contentImage,
                contentImagePublicId: body.contentImagePublicId,
                type: body.type,
                status: body.status,

                publishedAt: newPublishedAt,
                updatedById: session.user.id,
                products: {
                    set: productIds?.map((pid: string) => ({ id: pid })) || [],
                },
            },
        });

        revalidateTag("articles", { expire: 0 });
        revalidateTag(`article-${id}`, { expire: 0 });
        if (existingArticle.slug) {
            revalidateTag(`article-slug-${existingArticle.slug}`, { expire: 0 });
        }
        if (updatedArticle.slug) {
            revalidateTag(`article-slug-${updatedArticle.slug}`, { expire: 0 });
        }

        return {
            message: t(translations.updatedSuccess), // "Update successfully"
            data: updatedArticle,
        }
    }, t);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {

    const locale = getRequestLocale(request);
    const t = await getTranslations({
        locale,
    });
    return handleApiAction(async () => {
        const { id } = await params;
        const session = await requirePermission(Permission.ARTICLE_DELETE);
        if (!session) throw new ApiError(translations.forbidden, 403)
        const existingArticle = await getArticleById(id, { select: { publishedAt: true, coverImage: true, coverImagePublicId: true, contentImage: true, contentImagePublicId: true, slug: true } })

        if (!existingArticle) {
            throw new ApiError(translations.notFound, 404);
        }
        try {
            const publicId = existingArticle.coverImagePublicId
            if (publicId) {
                await deleteFromCloudinary(publicId);
            }
            const contentPublicId = existingArticle.contentImagePublicId;
            if (contentPublicId) {
                await deleteFromCloudinary(contentPublicId);
            }
        } catch (error) {
            logger.error("Cloudinary Delete Error:", error);
        }

        const deleteArticle = await database.article.delete({ where: { id: id } })

        revalidateTag("articles", { expire: 0 });
        revalidateTag(`article-${id}`, { expire: 0 });
        if (existingArticle.slug) {
            revalidateTag(`article-slug-${existingArticle.slug}`, { expire: 0 });
        }

        return {
            message: t(translations.deletedSuccess), // "Update successfully"
            data: deleteArticle,
        }
    }, t)
}