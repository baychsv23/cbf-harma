import { Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleApiAction(async () => {
    const { id } = await params;

    const product = await database.product.findUnique({
      where: { id },
      include: {
        symptom: true, // ดึงข้อมูลอาการที่เกี่ยวข้อง
        articles: true, // ดึงบทความที่เกี่ยวข้อง
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleApiAction(async () => {
    const { id } = await params;
    const body = await req.json();
    const { symptomIds } = body;
    const existingProduct = await database.product.findUnique({
      where: { id },
      select: { productImageUrl: true },
    });

    if (!existingProduct) {
      throw new ApiError(translations.notFound, 404);
    }
    if (body.isActive) {
      await requirePermission(Permission.PRODUCT_DELETE);
      const updatedStatus = await database.product.update({
        where: { id: id },
        data: { isActive: body.isActive },
      });
      return { ...updatedStatus, message: translations.updatedSuccess };
    }
    const session = await requirePermission(Permission.PRODUCT_UPDATE);
    const updater = session.user.id;
    if (
      body.productImageUrl &&
      body.productImageUrl !== existingProduct.productImageUrl
    ) {
      try {
        const oldUrl = existingProduct.productImageUrl;
        // ดึง public_id ออกจาก URL (ตัวอย่าง: .../v1234/folder/image_name.jpg -> folder/image_name)
        const publicId = oldUrl
          ?.split("/upload/")[1]
          ?.split("/")
          .slice(1)
          .join("/")
          .split(".")[0];

        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          console.log("Deleted old image:", publicId);
        }
      } catch (error) {
        console.error("Cloudinary Delete Error:", error);
      }
    }

    const updated = await database.product.update({
      where: { id: id },
      data: {
        nameEN: body.nameEN,
        nameLA: body.nameLA,
        sku: body.sku,
        slug: body.slug,
        category: body.category,
        categorySub: body.categorySub,
        indicationLA: body.indicationLA,
        indicationEN: body.indicationEN,
        productImageUrl: body.productImageUrl,
        updatedById: updater,
        symptom: {
          connect: symptomIds.map((id: string) => ({ id })),
        },
      },
      select: { id: true },
    });

    return { ...updated, message: translations.updatedSuccess };
  });
}
