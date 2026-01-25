// lib/auth/requirePermission.ts
import { getServerSession } from "next-auth";
import { Permission, Role } from "@/generated/prisma/enums";
import { translations } from "./translation";
import { authOptions } from "./auth";


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
    return session;
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

export async function requireAccess({
  roles = [],
  permissions = [],
}: {
  roles?: string[];
  permissions?: Permission[];
}) {
  const session = await getSession();

  if (!session) throw new Error(translations.unauthorized);

  const userRole = session.user?.role;
  if (userRole === Role.ADMIN) {
    return session;
  }
  const userPermissions = (session.user?.permissions as Permission[]) || [];

  // Check role requirement
  const hasRole = roles.length === 0 || roles.includes(userRole);

  // Check permission requirement
  const hasPermissions =
    permissions.length === 0 ||
    permissions.every((perm) => userPermissions.includes(perm));

  if (!hasRole || !hasPermissions) {
    throw new Error(translations.forbidden);
  }

  return session;
}

export async function getAuth() {
  const session = await getSession()

  if (!session) {
    throw new Error(translations.unauthorized);
  }
  return session;
}
