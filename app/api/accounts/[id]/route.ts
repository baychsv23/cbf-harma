import { Permission, Role } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { getAccountById } from "@/lib/getDataById";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { handleApiAction } from "@/lib/handleApiAction";
import { getAuth, requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { getTranslations } from "next-intl/server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const locale = getRequestLocale(request);

  const t = await getTranslations({
    locale,
  });
  return handleApiAction(async () => {
    const session = await getAuth();
    if (!session) throw new ApiError(translations.forbidden, 403);
    if (session.user.role !== Role.ADMIN) {
      throw new ApiError(translations.forbidden, 403);
    }
    const { id } = await params;

    const account = await getAccountById(id, {
      select: {
        id: true,
        userName: true,
        role: true,
        fullName: true,
        permissions: true,
      },
    });
    if (!account) {
      throw new ApiError(translations.notFound, 404);
    }
    return {
      message: t(translations.fetchSuccess),
      data: account,
    };
  });
}
