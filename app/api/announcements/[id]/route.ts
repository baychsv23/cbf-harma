import { NextRequest, NextResponse } from "next/server";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { ApiError } from "@/lib/api-error";
import { translations } from "@/lib/translation";
import { Permission, BooleanState, ImageType } from "@/generated/prisma/enums";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { logger } from "@/lib/logger";

// Helper to get ID from params

export async function PUT(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {
    return handleApiAction(async () => {
        // 1. Check Permission
        await requirePermission(Permission.ANNOUNCEMENT_UPDATE);
        const { id } = await params;
        const { type, image, imagePublicId, isPublic } = await request.json();
        if (!type) throw new ApiError(translations.allFiledRequired, 400)



        const record = await database.announcement.findUnique({
            where: { id: id },
            select: { image: true, imagePublicId: true }
        })
        if (!record) {
            throw new ApiError(translations.notFound, 404)
        }
        if (image && image !== record.imagePublicId) {
            try {
                const publicId = record.imagePublicId
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }
            } catch (error) {
                logger.error("Cloudinary Delete Error:", error);
            }
        }
        const updated = await database.announcement.update({
            where: { id },
            data: { image, imagePublicId, type, isPublic },
        });

        return {
            ...updated,
            message: translations.updatedSuccess,
        };
    });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    return handleApiAction(async () => {
        // 1. Check Permission
        await requirePermission(Permission.ANNOUNCEMENT_DELETE);
        const { id } = await params;

        // 2. Get Record to find Image Public ID
        const record = await database.announcement.findUnique({
            where: { id }, select: { imagePublicId: true }
        });

        if (!record) {
            throw new ApiError(translations.notFound, 404);
        }

        // 3. Delete Image from Cloud (if exists)
        if (record.imagePublicId) {
            await deleteFromCloudinary(record.imagePublicId);
        }

        // 4. Delete Record from DB
        await database.announcement.delete({
            where: { id },
        });

        return {
            id,
            message: translations.deletedSuccess,
        };
    });
}