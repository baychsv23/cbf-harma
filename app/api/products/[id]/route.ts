import { Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { getProductById } from "@/lib/getDataById";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    return handleApiAction(async () => {
        const { id } = await params;
        const body = await req.json();
        const { symptomIds } = body;
        if (body.isActive) {
            await requirePermission(Permission.PRODUCT_DELETE);
            const updatedStatus = await database.product.update({
                where: { id: id },
                data: { isActive: body.isActive },
            });
            return { ...updatedStatus, message: translations.updatedSuccess };
        }
        const existingProduct = await getProductById(id, { select: { productImage: true, productImagePublicId: true } })

        if (!existingProduct) {
            throw new ApiError(translations.notFound, 404);
        }

        const session = await requirePermission(Permission.PRODUCT_UPDATE);
        if (!session) throw new ApiError(translations.forbidden, 403)
        const updatedById = session.user.id;
        if (
            body.productImage &&
            body.productImage !== existingProduct.productImage
        ) {
            try {
                const publicId = existingProduct.productImagePublicId
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }
            } catch (error) {
                logger.error("Cloudinary Delete Error:", error);
            }
        }

        const updated = await database.product.update({
            where: { id: id },
            data: {
                nameEN: body.nameEN,
                nameLA: body.nameLA,
                sku: body.sku,
                slug: body.slug,
                category: body.category,
                categorySub: body.categorySub,
                indicationLA: body.indicationLA,
                indicationEN: body.indicationEN,
                productImage: body.productImage,
                updatedById,
                symptoms: {
                    connect: symptomIds.map((id: string) => ({ id })),
                },
            },
            select: { id: true },
        });

        return { ...updated, message: translations.updatedSuccess };
    });
}
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await requirePermission(Permission.PRODUCT_DELETE);
    const existingProduct = await getProductById(id, { select: { productImage: true, productImagePublicId: true } })
    if (!existingProduct) {
        throw new ApiError(translations.notFound, 404);
    }
    try {
        const publicId = existingProduct.productImagePublicId
        if (publicId) {
            await deleteFromCloudinary(publicId)
        }
    } catch (error) {
        logger.error("Cloudinary Delete Error:", error);
    }

    const deleteArticle = await database.product.delete({ where: { id: id } })
    return NextResponse.json({
        message: translations.deletedSuccess, // "Update successfully"
        data: deleteArticle,
    });
}
