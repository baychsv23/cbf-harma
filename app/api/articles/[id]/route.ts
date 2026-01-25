import { ArticleStatus, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { handleApiAction } from "@/lib/handleApiAction";
import { logger } from "@/lib/logger";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return handleApiAction(async () => {
        const { id } = await params;

        const article = await database.article.findUnique({
            where: { id }, include: { products: true }
        });
        if (!article) {
            throw new ApiError(translations.notFound, 404);
        }
        return NextResponse.json({
            success: true,
            data: article
        });
    })
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return handleApiAction(async () => {
        const { id } = await params;

        // 1. ตรวจสอบสิทธิ์ (User ต้องมีสิทธิ์แก้ไขบทความ)
        const session = await requirePermission(Permission.ARTICLE_UPDATE);
        const updaterId = session.user.id;

        // 2. รับข้อมูลจาก Body
        const body = await request.json();

        // Validate ข้อมูลพื้นฐาน
        if (!body.titleEN || !body.titleLA || !body.slug) {
            throw new ApiError(translations.allFiledRequired, 400);
        }

        // ตรวจสอบว่ามีบทความนี้อยู่จริงไหม
        const existingArticle = await database.article.findUnique({
            where: { id },
            select: { publishedAt: true, coverImage: true, coverImagePublicId: true }
        });
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
                    await cloudinary.uploader.destroy(publicId);
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
                type: body.type,
                status: body.status,

                publishedAt: newPublishedAt,
                updatedById: updaterId,

                // Handle Many-to-Many Relation (Tie-in Products)
                products: {
                    // ใช้ 'set' เพื่อแทนที่รายการเดิมทั้งหมดด้วยรายการใหม่
                    // ถ้าส่ง array ว่าง [] มา จะถือว่าลบความสัมพันธ์ทั้งหมด
                    set: productIds?.map((pid: string) => ({ id: pid })) || [],
                },
            },
        });

        return NextResponse.json({
            message: translations.updatedSuccess, // "Update successfully"
            data: updatedArticle,
        });
    });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await requirePermission(Permission.ARTICLE_DELETE);
    const existingArticle = await database.article.findUnique({
        where: { id },
        select: { coverImagePublicId: true }
    });
    if (!existingArticle) {
        throw new ApiError(translations.notFound, 404);
    }
    try {
        const publicId = existingArticle.coverImagePublicId
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (error) {
        logger.error("Cloudinary Delete Error:", error);
    }

    const deleteArticle = await database.article.delete({ where: { id: id } })
    return NextResponse.json({
        message: translations.deletedSuccess, // "Update successfully"
        data: deleteArticle,
    });
}