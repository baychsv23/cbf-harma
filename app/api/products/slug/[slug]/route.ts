import { ApiError } from "@/lib/api-error";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { translations } from "@/lib/translation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    return handleApiAction(async () => {
        const { slug } = await params;

        const product = await database.product.findUnique({
            where: { slug },
            include: {
                symptom: true, // ดึงข้อมูลอาการที่เกี่ยวข้อง
            },
        });
        if (!product) {
            throw new ApiError(translations.notFound, 404);
        }
        return NextResponse.json({
            success: true,
            data: product,
        });
    });
}