import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Evita conexões duplicadas no Next.js durante o desenvolvimento
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getClient = () => {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    throw new Error("Variáveis de ambiente do Turso ausentes.");
  }

  const adapter = new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? getClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
