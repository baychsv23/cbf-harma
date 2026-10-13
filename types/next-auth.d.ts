import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      userName: string;
      fullName?: string;
      permissions?: Json;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    userName: string;
    fullName?: string;
    permissions?: Json;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    userName: string;
    fullName?: string;
    permissions?: Json;
  }
}
