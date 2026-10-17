"use server";

import { BooleanState, Permission, Role } from "@/generated/prisma/enums";
import { handleAction } from "@/lib/handleAction";
import { database } from "@/lib/prisma";

import { getAuth, requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";

import bcrypt from "bcryptjs";
import { getTranslations } from "next-intl/server";
import { revalidateTag } from "next/cache";

export async function createAccount(prevState: any, data: FormData) {
  const t = await getTranslations();
  return handleAction(
    async () => {
      const session = await getAuth();
      if (!session) throw new Error(translations.forbidden);
      const roleSession = session.user.role;
      const userName = data.get("userName")?.toString()?.trim()?.toLowerCase();
      const fullName = data.get("fullName")?.toString()?.trim();
      const password = data.get("password")?.toString();
      const confirmPassword = data.get("confirmPassword")?.toString();
      const role = data.get("role")?.toString();
      const permissionsString = data.get("permissions")?.toString();

      if (roleSession !== Role.ADMIN && Role.ADMIN === role)
        throw new Error(translations.forbidden);

      if (!userName || !fullName || !password || !role)
        throw new Error(translations.allFiledRequired);

      // Validate userName format (min 3 chars, no spaces)
      if (!/^[a-zA-Z0-9._-]+$/.test(userName) || userName.length < 3) {
        throw new Error(translations.invalidLogin);
      }

      // Check duplicate userName
      const existingUser = await database.user.findUnique({
        where: { userName },
      });
      if (existingUser) {
        throw new Error(translations.duplicateData);
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error(translations.passwordLength);
      }

      // Validate confirm password match
      if (confirmPassword && password !== confirmPassword) {
        throw new Error(translations.passwordMisMatch);
      }

      // Validate role
      if (!Object.values(Role).includes(role as Role) || role === Role.USER) {
        throw new Error(translations.allFiledRequired);
      }

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

      const newUser = await database.user.create({
        data: {
          userName: userName,
          password: hashedPassword,
          fullName: fullName,
          role: role as Role,
          permissions: permissions, // This will be stored as JSON in the database
        },
      });

      revalidateTag("accounts", { expire: 0 });

      return newUser;
    },
    {
      successKey: t(translations.createdSuccess),
      errorKey: t(translations.createFailed),
    },
    t,
  );
}
export async function updateAccount(prevState: any, data: FormData) {
  const t = await getTranslations();
  return handleAction(
    async () => {
      const session = await getAuth();
      if (!session) throw new Error(translations.forbidden);
      const roleSession = session.user.role;
      const id = data.get("id")?.toString();
      const userName = data.get("userName")?.toString()?.trim()?.toLowerCase();
      const fullName = data.get("fullName")?.toString()?.trim();
      const role = data.get("role")?.toString();
      const permissionsString = data.get("permissions")?.toString();
      if (!id || !userName || !fullName || !role)
        throw new Error(translations.allFiledRequired);

      // Validate userName format
      if (!/^[a-zA-Z0-9._-]+$/.test(userName) || userName.length < 3) {
        throw new Error(translations.invalidLogin);
      }

      // Check duplicate userName on other accounts
      const duplicateUser = await database.user.findFirst({
        where: {
          userName,
          NOT: { id },
        },
      });
      if (duplicateUser) {
        throw new Error(translations.duplicateData);
      }

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

      const updatedUser = await database.user.update({
        where: { id: id },
        data: {
          userName,
          fullName,
          role: role as Role,
          permissions, // Update permissions
        },
      });

      revalidateTag("accounts", { expire: 0 });
      revalidateTag(`account-${id}`, { expire: 0 });

      return updatedUser;
    },
    {
      successKey: t(translations.updatedSuccess),
      errorKey: t(translations.updateFailed),
    },
    t,
  );
}

export async function activeAccount(id: string, status: BooleanState) {
  const t = await getTranslations();
  return handleAction(
    async () => {
      const session = await getAuth();
      if (!session) throw new Error(translations.forbidden);
      const update = await database.user.update({
        where: {
          id: id,
        },
        data: { isActive: status },
      });

      revalidateTag("accounts", { expire: 0 });
      revalidateTag(`account-${id}`, { expire: 0 });

      return update;
    },
    {
      successKey: t(translations.updatedSuccess),
      errorKey: t(translations.updateFailed),
    },
  );
}
