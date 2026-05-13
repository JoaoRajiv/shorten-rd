import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

// Evita conexões duplicadas no Next.js durante o desenvolvimento
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Cria o adaptador usando as variáveis do Turso
const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
