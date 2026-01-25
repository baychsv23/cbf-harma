import { Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleApiAction(async () => {
    const { id } = await params;
    const body = await req.json();
    await requirePermission(Permission.SYMPTOM_UPDATE);

    const updated = await database.symptom.update({
      where: { id: id },
      data: {
        nameEN: body.nameEN,
        nameLA: body.nameLA,
      },
      select: { id: true },
    });

    return { ...updated, message: translations.updatedSuccess };
  });
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleApiAction(async () => {
    const { id } = await params;
    await requirePermission(Permission.SYMPTOM_DELETE);
    const deleted = await database.symptom.delete({ where: { id: id } });
    return { message: translations.deletedSuccess };
  });
}
