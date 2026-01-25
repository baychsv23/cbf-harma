import { ApiError } from "@/lib/api-error";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { translations } from "@/lib/translation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return handleApiAction(async () => {
        const { id } = await params;

        const article = await database.article.findUnique({
            where: { id },
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