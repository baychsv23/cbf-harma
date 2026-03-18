import { NextResponse } from "next/server";
import { translations } from "./translation";
import { Prisma } from "@/generated/prisma/client";
import { logger } from "./logger";

type ApiHandler<T> = () => Promise<T>;

export async function handleApiAction<T>(
  handler: ApiHandler<T>,
  t?: (key: string) => string,
) {
  try {
    const result = (await handler()) as any;
    const message = result?.message;
    const data = result?.data !== undefined ? result.data : result;
    const pagination =
      result?.pagination !== undefined ? result.pagination : null;

    const response = NextResponse.json({
      success: true,
      data: data,
      ...(pagination && { pagination }),
      ...(message && { message }),
    });

    // 2. Set Headers สำหรับ Caching
    // response.headers.set(
    //   "Cache-Control",
    //   "s-maxage=3600, stale-while-revalidate=86400",
    // );

    return response;
  } catch (error: any) {
    logger.error("API Error Log:", error);
    const status = error.status;
    const message = error.message;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (t) {
        switch (error.code) {
          case "P2002": // Unique constraint failed (ข้อมูลซ้ำ)
            return NextResponse.json(
              { success: false, error: t(translations.duplicateData) },
              { status: 409 }, // Conflict
            );
          case "P2025": // Record not found
            return NextResponse.json(
              { success: false, error: t(translations.notFound) },
              { status: 404 },
            );
          case "P2003": // Foreign key constraint failed (อ้างอิง ID ที่ไม่มีอยู่จริง)
            return NextResponse.json(
              { success: false, error: t(translations.relatedRecord) },
              { status: 400 },
            );
        }
      }
    }

    if ([404, 403, 401, 400].includes(status)) {
      return NextResponse.json(
        { success: false, error: message },
        { status: status },
      );
    }
    // 4. Default Error (500)
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
