import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Usamos arquivo local (dev.db) apenas para gerar os arquivos SQL da migração
    url: process.env.DATABASE_URL || "file:./dev.db",
  },
});
