// app/api/warehouses/route.ts

import { getArticles } from "@/action/articles";
import { ArticleStatus } from "@/generated/prisma/enums";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return handleApiAction(async () => {
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined;
        const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
        const title = searchParams.get("title")
        const type = searchParams.get("type")
        const where: any = { status: ArticleStatus.PUBLISHED };
        if (title) {
            where.OR = [
                { titleEN: { contains: title } },
                { titleLA: { contains: title } },

            ];
        }
        if (type) where.type = type

        if (page && limit) {
            const skip = (page - 1) * limit;
            const include = {
                products: { select: { id: true, nameEN: true, nameLA: true } },
            }
            const { data, total } = await getArticles({ where, skip, limit, include })


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
        const { data, total } = await getArticles({ where })


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
