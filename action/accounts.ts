"use server";

import { BooleanState, Permission, Role } from "@/generated/prisma/enums";
import { handleAction } from "@/lib/handleAction";
import { database } from "@/lib/prisma";

import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";


import bcrypt from "bcryptjs";

export async function createAccount(prevState: any, data: FormData) {
  return handleAction(
    async () => {
      const session = await requirePermission(Permission.USER_CREATE);
      if (!session) throw new Error(translations.forbidden)
      const roleSession = session.user.role
      const userName = data.get("userName")?.toString();

      const fullName = data.get("fullName")?.toString();
      const password = data.get("password")?.toString();
      const role = data.get("role")?.toString();
      const permissionsString = data.get("permissions")?.toString();
      if (roleSession !== Role.ADMIN && Role.ADMIN === role)
        throw new Error(translations.forbidden);

      if (!userName || !password || !role)
        throw new Error(translations.allFiledRequired);

      // Parse permissions from JSON string
      let permissions: Permission[] = [];
      if (permissionsString) {
        try {
          permissions = JSON.parse(permissionsString);
        } catch (error) {
          throw new Error(translations.notFound);
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      return await database.user.create({
        data: {
          userName: userName,
          password: hashedPassword,
          fullName: fullName,
          role: role as Role,
          permissions: permissions, // This will be stored as JSON in the database
        },
      });
    },
    {
      successKey: translations.createdSuccess,
      errorKey: translations.createFailed,
    }
  );
}
export async function updateAccount(prevState: any, data: FormData) {
  return handleAction(
    async () => {
      const session = await requirePermission(Permission.USER_UPDATE);
      if (!session) throw new Error(translations.forbidden)
      const roleSession = session.user.role
      const id = data.get("id")?.toString();
      const userName = data.get("userName")?.toString();
      const fullName = data.get("fullName")?.toString();
      const role = data.get("role")?.toString();
      const permissionsString = data.get("permissions")?.toString();
      if (!id || !userName || !role)
        throw new Error(translations.allFiledRequired);

      // Parse permissions
      if (roleSession !== Role.ADMIN && Role.ADMIN === role)
        throw new Error(translations.forbidden);
      let permissions: Permission[] = [];
      if (permissionsString) {
        try {
          permissions = JSON.parse(permissionsString);
        } catch (error) {
          throw new Error(translations.notFound);
        }
      }

      return await database.user.update({
        where: { id: id },
        data: {
          userName,
          fullName,
          role: role as Role,
          permissions, // Update permissions
        },
      });
    },
    {
      successKey: translations.updatedSuccess,
      errorKey: translations.updateFailed,
    }
  );
}

export async function activeAccount(id: string, status: BooleanState) {
  return handleAction(
    async () => {
      await requirePermission(Permission.USER_DELETE);
      const update = await database.user.update({
        where: {
          id: id
        },
        data: { isActive: status },
      });
      return update;
    },
    {
      successKey: translations.updatedSuccess,
      errorKey: translations.updateFailed,
    }
  );
}
