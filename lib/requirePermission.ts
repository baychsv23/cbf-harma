// lib/auth/requirePermission.ts
import { getServerSession } from "next-auth";
import { Permission, Role } from "@/generated/prisma/enums";
import { authOptions } from "./auth";


export async function getAuth() {
  return await getServerSession(authOptions);
}
export async function requirePermission(...requiredPermissions: Permission[]) {
  const session = await getAuth();

  if (!session) {
    return
  }
  const userRole = session.user?.role;
  if (userRole === Role.ADMIN) {
    return session;
  }

  const userPermissions = (session.user?.permissions as Permission[]) || [];

  const hasAllPermissions = requiredPermissions.every((perm) =>
    userPermissions.includes(perm)
  );

  if (!hasAllPermissions) return

  return session;
}


