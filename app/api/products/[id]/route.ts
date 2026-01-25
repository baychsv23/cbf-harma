import { Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return handleApiAction(async () => {
        const { id } = await params;

        const product = await database.product.findUnique({
            where: { id },
            include: {
                symptom: true, // ดึงข้อมูลอาการที่เกี่ยวข้อง
                articles: true // ดึงบทความที่เกี่ยวข้อง
            }
        });
        if (!product) {
            throw new ApiError(translations.notFound, 404);
        }
        return NextResponse.json({
            success: true,
            data: product
        });
    })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    return handleApiAction(async () => {
        const { id } = await params;
        const body = await req.json();
        if (body.isActive) {
            await requirePermission(Permission.PRODUCT_DELETE);
            const updatedStatus = await database.product.update({
                where: { id: id },
                data: { isActive: body.isActive },
            });
            return { ...updatedStatus, message: translations.updatedSuccess };
        }
        const session = await requirePermission(Permission.PRODUCT_UPDATE);
        const updater = session.user.id
        const updated = await database.product.update({
            where: { id: id },
            data: {
                nameEN: body.nameEN,
                nameLA: body.nameLA,
                sku: body.sku,
                slug: body.slug,
                descriptionsEN: body.descriptionsEN,
                descriptionsLA: body.descriptionsLA,
                category: body.category,
                categorySub: body.categorySub,
                updatedById: updater
            },
            select: { id: true }
        });

        return { ...updated, message: translations.updatedSuccess };

    });
}