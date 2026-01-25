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

        const account = await database.user.findUnique({
            where: { id },
        });
        if (!account) {
            throw new ApiError(translations.notFound, 404);
        }
        return NextResponse.json({
            success: true,
            data: account
        });
    })
}