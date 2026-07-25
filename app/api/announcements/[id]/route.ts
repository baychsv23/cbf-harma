import { NextRequest, NextResponse } from "next/server";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { ApiError } from "@/lib/api-error";
import { translations } from "@/lib/translation";
import { Permission } from "@/generated/prisma/enums";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { logger } from "@/lib/logger";
import { getAnnouncementById } from "@/lib/getDataById";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { getTranslations } from "next-intl/server";
import { revalidateTag } from "next/cache";

// Helper to get ID from params

export async function PUT(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {
    const locale = getRequestLocale(request);
    const t = await getTranslations({
        locale,
    });
    return handleApiAction(async () => {
        const { id } = await params;
        const session = await requirePermission(Permission.ANNOUNCEMENT_UPDATE);
        if (!session) throw new ApiError(translations.forbidden, 403)

        const { image, imagePublicId, isPublic } = await request.json();

        const record = await getAnnouncementById(id, { select: { image: true, imagePublicId: true } })
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
            data: { image, imagePublicId, isPublic },
        });

        revalidateTag("announcements", { expire: 0 });
        revalidateTag(`announcement-${id}`, { expire: 0 });

        return {
            ...updated,
            message: t(translations.updatedSuccess),
        };
    }, t);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const locale = getRequestLocale(request);
    const t = await getTranslations({
        locale,
    });
    return handleApiAction(async () => {
        // 1. Check Permission
        const session = await requirePermission(Permission.ANNOUNCEMENT_DELETE);
        if (!session) throw new ApiError(translations.forbidden, 403)
        const { id } = await params;

        // 2. Get Record to find Image Public ID
        const record = await getAnnouncementById(id, { select: { image: true, imagePublicId: true } })
        if (!record) {
            throw new ApiError(translations.notFound, 404)
        }

        // 3. Delete Image from Cloud (if exists)
        if (record.imagePublicId) {
            await deleteFromCloudinary(record.imagePublicId);
        }

        // 4. Delete Record from DB
        await database.announcement.delete({
            where: { id },
        });

        revalidateTag("announcements", { expire: 0 });
        revalidateTag(`announcement-${id}`, { expire: 0 });

        return {
            id,
            message: t(translations.deletedSuccess),
        };
    }, t);
}