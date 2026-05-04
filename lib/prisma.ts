import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

// ----------------------------------------------------
// 1) Retry helper
// ----------------------------------------------------

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

// ----------------------------------------------------
// 3) Create PrismaClient instance
// ----------------------------------------------------
export const database =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// ----------------------------------------------------
// 4) Connect with retry
// ----------------------------------------------------

// ----------------------------------------------------
if (process.env.NODE_ENV !== "production") global.prisma = database;

// ----------------------------------------------------
// 5) Export "db"
// ----------------------------------------------------
