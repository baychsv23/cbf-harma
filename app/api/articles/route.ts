// app/api/warehouses/route.ts

import { ArticleStatus, ArticleType, BooleanState, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return handleApiAction(async () => {
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined;
        const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;


        const where: any = {};

        if (page && limit) {
            const skip = (page - 1) * limit;

            const [data, total] = await Promise.all([
                database.article.findMany({
                    skip,
                    take: limit,
                    where,
                    orderBy: { createdAt: 'desc' },
                }),
                database.article.count({ where }),
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
        const data = await database.article.findMany({
            where: { ...where, status: ArticleStatus.PUBLISHED },
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
    })
}