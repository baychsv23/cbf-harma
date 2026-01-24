import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { database } from "./prisma";
import { translations } from "./translation";
import { ActiveState } from "@/app/generated/prisma/enums";
import { timeToken } from "./constant";


export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: { label: "userName", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.userName || !credentials?.password) {
          throw new Error(translations.authMessage);
        }

        const user = await database.user.findUnique({
          where: { userName: credentials.userName },
        });

        if (!user) {
          throw new Error(translations.authMessage);
        }
        if (user.activeStatus === ActiveState.INACTIVE)
          throw new Error(translations.INACTIVE);
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error(translations.authMessage);
        }
        return {
          id: user.id,
          userName: user.userName,
          role: user.role,
          fullName: user.fullName,
          permissions: user.permissions,
        } as any;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: timeToken,
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {

        token.id = user.id;
        token.userName = user.userName;
        token.role = user.role;
        token.permissions = user.permissions;
        token.fullName = user.fullName;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.userName = token.userName;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.fullName = token.fullName;
      }
      return session;
    },
  },
};
