// lib/auth/requirePermission.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { translations } from "./translation";
import { Permission, Role } from "@/app/generated/prisma/enums";

export async function getSession() {
  return await getServerSession(authOptions);
}
export async function requirePermission(...requiredPermissions: Permission[]) {
  const session = await getSession();

  if (!session) {
    throw new Error(translations.unauthorized);
  }
  const userRole = session.user?.role;
  if (userRole === Role.ADMIN) {
    return session; // buy pass
  }

  const userPermissions = (session.user?.permissions as Permission[]) || [];

  const hasAllPermissions = requiredPermissions.every((perm) =>
    userPermissions.includes(perm)
  );

  if (!hasAllPermissions) {
    throw new Error(translations.forbidden);
  }

  return session;
}



export async function getAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error(translations.unauthorized);
  }
  return session;
}
