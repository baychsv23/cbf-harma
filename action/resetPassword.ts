"use server";

import bcrypt from "bcryptjs";
import { handleAction } from "@/lib/handleAction";
import { getAuth, requirePermission } from "@/lib/requirePermission";
import { database } from "@/lib/prisma";
import { translations } from "@/lib/translation";
import { Permission, Role } from "@/generated/prisma/enums";

export async function resetPassword(id: string, newPassword: string) {
  return handleAction(
    async () => {
      const session = await requirePermission(Permission.USER_UPDATE);
      const isAdmin = session.user.role === Role.ADMIN;
      if (!isAdmin) throw new Error(translations.forbidden);
      const hashed = await bcrypt.hash(newPassword, 10);

      return await database.user.update({
        where: { id: id },
        data: { password: hashed },
      });
    },
    {
      successKey: translations.updatedSuccess,
      errorKey: translations.updateFailed,
    }
  );
}
