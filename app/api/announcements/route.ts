// app/api/warehouses/route.ts

import { BooleanState, ImageType, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return handleApiAction(async () => {
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get("page")
            ? parseInt(searchParams.get("page")!)
            : undefined;
        const limit = searchParams.get("limit")
            ? parseInt(searchParams.get("limit")!)
            : undefined;
        const type = searchParams.get("type")

        const where: any = {};

        if (type) where.type = type

        if (page && limit) {
            const skip = (page - 1) * limit;

            const [data, total] = await Promise.all([
                database.announcement.findMany({
                    skip,
                    take: limit,
                    where,
                    orderBy: { createdAt: "desc" },
                }),
                database.announcement.count({ where }),
            ]);

            const totalPages = Math.max(1, Math.ceil(total / limit));
            const dataWithStt = data.map((item, index) => ({
                ...item,
                stt: skip + index + 1,
            }));

            return NextResponse.json({
                success: true,
                data: dataWithStt,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            });
        }

        // Fetch all mode
        const data = await database.announcement.findMany({
            where: where,
        });

        const total = data.length;

        return NextResponse.json({
            success: true,
            data: data,
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalItems: total,
                hasNext: false,
                hasPrev: false,
            },
        });
    });
}

export async function POST(req: Request) {
    return handleApiAction(async () => {
        await requirePermission(Permission.ANNOUNCEMENT_CREATE);
        const body = await req.json();

        const { image, type, imagePublicId } = body;
        if (!image || !type) {
            throw new ApiError(translations.allFiledRequired, 400);
        }
        const existingCount = await database.announcement.count({
            where: { type: type }
        });

        // 2. ตรวจสอบเงื่อนไข Banner (Limit 5)
        if (type === ImageType.BANNER && existingCount >= 5) {
            throw new ApiError(translations.limitBanner, 400);
        }

        // 3. ตรวจสอบเงื่อนไข Announcement (Limit 1)
        if (type === ImageType.ANNOUNCEMENT && existingCount >= 1) {
            throw new ApiError(translations.limitAnnouncement, 400);
        }

        // --- จบส่วนการตรวจสอบ ---

        const newProduct = await database.announcement.create({
            data: {
                image: image,
                imagePublicId: imagePublicId,
                type: type
            },
            select: { id: true },
        });

        return {
            ...newProduct,
            message: translations.createdSuccess,
        };
    });
}
