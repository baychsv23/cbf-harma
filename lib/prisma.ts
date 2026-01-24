import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/app/generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// ----------------------------------------------------
// 1) Retry helper
// ----------------------------------------------------
function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectWithRetry(
  client: PrismaClient,
  retries = 10,
  delay = 1500
) {
  for (let i = 0; i < retries; i++) {
    try {
      await client.$connect();
      return client;
    } catch (err) {
      await wait(delay);
    }
  }


  return client;
}

// ----------------------------------------------------
// 2) MariaDB Adapter
// ----------------------------------------------------
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 15,
  connectTimeout: 15000,
});

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
connectWithRetry(database);

// ----------------------------------------------------
if (process.env.NODE_ENV !== "production") global.prisma = database;

// ----------------------------------------------------
// 5) Export "db"
// ----------------------------------------------------
