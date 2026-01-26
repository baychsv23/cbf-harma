
import { BooleanState, ImageType } from "@/generated/prisma/enums";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return handleApiAction(async () => {

        const [banners, announcement] = await Promise.all([
            database.announcement.findMany({
                where: {
                    type: ImageType.BANNER,
                    isPublic: BooleanState.TRUE,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            }),

            database.announcement.findFirst({
                where: {
                    type: ImageType.ANNOUNCEMENT,
                    isPublic: BooleanState.TRUE,
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                banners,
                announcement,
            },
        });
    });
}
