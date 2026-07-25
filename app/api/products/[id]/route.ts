import { Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { getProductById } from "@/lib/getDataById";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { getTranslations } from "next-intl/server";
import { revalidateTag } from "next/cache";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const locale = getRequestLocale(request);
  const t = await getTranslations({
    locale,
  });
  return handleApiAction(async () => {
    const { id } = await params;
    const body = await request.json();
    const { symptomIds } = body;

    const session = await requirePermission(Permission.PRODUCT_UPDATE);

    if (!session) throw new ApiError(translations.forbidden, 403);
    const updatedById = session.user.id;

    if (body.isActive) {
      const updatedStatus = await database.product.update({
        where: { id: id },
        data: { isActive: body.isActive },
        select: { id: true, slug: true, isActive: true },
      });
      
      revalidateTag("products", { expire: 0 });
      revalidateTag(`product-${id}`, { expire: 0 });
      if (updatedStatus.slug) {
        revalidateTag(`product-slug-${updatedStatus.slug}`, { expire: 0 });
      }

      return { ...updatedStatus, message: t(translations.updatedSuccess) };
    }
    const existingProduct = await getProductById(id, {
      select: { productImage: true, productImagePublicId: true, slug: true },
    });

    if (!existingProduct) {
      throw new ApiError(translations.notFound, 404);
    }

    if (
      body.productImage &&
      body.productImage !== existingProduct.productImage
    ) {
      try {
        const publicId = existingProduct.productImagePublicId;
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        logger.error("Cloudinary Delete Error:", error);
      }
    }

    const updated = await database.product.update({
      where: { id: id },
      data: {
        nameEN: body.nameEN,
        nameLA: body.nameLA,
        sku: body.sku,
        slug: body.slug,
        dosage: body.dosage,
        packaging: body.packaging,
        genericName: body.genericName,
        category: body.category,
        categorySub: body.categorySub,
        indicationLA: body.indicationLA,
        indicationEN: body.indicationEN,
        administrationLA: body.administrationLA,
        administrationEN: body.administrationEN,
        productImage: body.productImage,
        updatedById,
        symptoms: {
          connect: symptomIds.map((id: string) => ({ id })),
        },
      },
      select: { id: true, slug: true },
    });

    revalidateTag("products", { expire: 0 });
    revalidateTag(`product-${id}`, { expire: 0 });
    if (existingProduct.slug) {
      revalidateTag(`product-slug-${existingProduct.slug}`, { expire: 0 });
    }
    if (updated.slug) {
      revalidateTag(`product-slug-${updated.slug}`, { expire: 0 });
    }

    return { data: updated, message: t(translations.updatedSuccess) };
  }, t);
}
