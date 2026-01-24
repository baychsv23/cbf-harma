// lib/hooks/useAuth.ts
import { useSession } from "next-auth/react";
import { Permission, Role } from "../generated/prisma/enums";


export function useAuth() {
  const { data: session } = useSession();
  const user = session?.user;

  const isAdmin = user?.role === Role.ADMIN;

  const hasPermission = (perm: Permission) => {
    if (isAdmin) return true; // Admin ลอยผ่านไปเหมือนเป็นวิญญาณ
    return !!user?.permissions?.includes(perm);
  };

  return { user, hasPermission };
}