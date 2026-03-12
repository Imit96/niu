import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "./env";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // rejectUnauthorized: false is only needed in local dev where SSL is intercepted.
    // In production (Vercel + Supabase) the certificate is valid and we enforce it.
    ssl: process.env.NODE_ENV === "production"
      ? true
      : { rejectUnauthorized: false },
    // Prevent SocketTimeout: keep connections alive and release them before
    // the remote (Supabase/PgBouncer) closes them silently on its end.
    keepAlive: true,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  });

  // Log idle client errors (e.g. SocketTimeout) instead of crashing.
  pool.on("error", (err) => {
    console.error("[pg pool] idle client error:", err.message);
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
