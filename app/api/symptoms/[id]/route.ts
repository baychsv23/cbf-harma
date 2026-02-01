import { Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { getTranslations } from "next-intl/server";
import { NextRequest } from "next/server";

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
    const session = await requirePermission(Permission.SYMPTOM_UPDATE);
    if (!session) throw new ApiError(translations.forbidden, 403)

    const updated = await database.symptom.update({
      where: { id: id },
      data: {
        nameEN: body.nameEN,
        nameLA: body.nameLA,
      },
      select: { id: true },
    });

    return { data: updated, message: t(translations.updatedSuccess) };
  }, t);
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const locale = getRequestLocale(request);
  const t = await getTranslations({
    locale,
  });
  return handleApiAction(async () => {
    const { id } = await params;
    const session = await requirePermission(Permission.SYMPTOM_DELETE);
    if (!session) throw new ApiError(translations.forbidden, 403)
    await database.symptom.delete({ where: { id: id } });
    return { message: t(translations.deletedSuccess) };
  }, t);
}
