
import { NextResponse } from "next/server";
import { translations } from "./translation";
import { Prisma } from "@/generated/prisma/client";
import { logger } from "./logger";

type ApiHandler<T> = () => Promise<T>;

export async function handleApiAction<T>(handler: ApiHandler<T>) {
    try {
        const result = await handler() as any;

        // ถ้าสิ่งที่ handler return มาเป็น NextResponse อยู่แล้ว (เช่น return NextResponse.json(...)) 
        // ให้ส่งค่านั้นกลับไปเลย ไม่ต้องครอบใหม่
        if (result instanceof NextResponse) {
            return result;
        }

        // ถ้าสิ่งที่ handler return มา มี success: true อยู่แล้ว (แปลว่าเขียนโครงสร้างมาเองแล้ว)
        // ให้ส่งก้อนนั้นกลับไปเป็น JSON เลย
        if (result && typeof result === 'object' && 'success' in result) {
            return NextResponse.json(result);
        }

        // กรณีปกติ: ครอบข้อมูลให้เป็น Standard
        const message = result?.message;
        const data = result?.data !== undefined ? result.data : result;
        const pagination = result?.pagination !== undefined ? result.pagination : null;

        return NextResponse.json({
            success: true,
            data: data,
            ...(pagination && { pagination }),
            ...(message && { message })
        });
    } catch (error: any) {
        logger.error("API Error Log:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case "P2002": // Unique constraint failed (ข้อมูลซ้ำ)
                    return NextResponse.json(
                        { success: false, error: translations.duplicateData },
                        { status: 409 } // Conflict
                    );
                case "P2025": // Record not found
                    return NextResponse.json(
                        { success: false, error: translations.notFound },
                        { status: 404 }
                    );
                case "P2003": // Foreign key constraint failed (อ้างอิง ID ที่ไม่มีอยู่จริง)
                    return NextResponse.json(
                        { success: false, error: translations.relatedRecord },
                        { status: 400 }
                    );
            }
        }
        const message = error.message
        const status = error.status
        console.log(error)
        // 2. จัดการเรื่องสิทธิ์ (Permission Level)
        if (
            status === 401 && message?.includes(translations.unauthorized)
        ) {
            return NextResponse.json(
                { success: false, error: translations.unauthorized },
                { status: 401 }
            );
        }

        if (
            status === 403 && message?.includes(translations.forbidden)
        ) {
            return NextResponse.json(
                { success: false, error: translations.forbidden },
                { status: 403 }
            );
        }
        if (status === 400) {
            return NextResponse.json(
                { success: false, error: message },
                { status: 400 }
            );
        }
        // 4. Default Error (500)
        return NextResponse.json(
            {
                success: false,
                error: message,
            },
            { status: 500 }
        );
    }
}