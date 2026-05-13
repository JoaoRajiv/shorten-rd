import { execSync } from "child_process";
import { readdirSync, statSync } from "fs";
import { join } from "path";

// Substitua pelo nome exato do seu banco no Turso
const DB_NAME = "encurtador";

// Pega o nome da migração passado via terminal, ou usa 'update' como padrão
const migrationName = process.argv[2] || "update";

try {
  console.log(`\n🚀 Passo 1: Gerando migração local (${migrationName})...`);
  // Executa o comando do Prisma de forma síncrona
  execSync(`pnpm dlx prisma migrate dev --name ${migrationName}`, {
    stdio: "inherit",
  });

  // Lê a pasta migrations para encontrar a mais recente
  const migrationsDir = join(process.cwd(), "prisma", "migrations");

  // O Prisma nomeia as pastas com timestamps (ex: 20260512205931_init)
  // Então uma ordenação alfabética simples sempre traz a última para o final
  const folders = readdirSync(migrationsDir)
    .filter((f) => statSync(join(migrationsDir, f)).isDirectory())
    .sort();

  const latestFolder = folders.pop();

  if (latestFolder) {
    console.log(
      `\n☁️ Passo 2: Aplicando a migração [${latestFolder}] no Turso...`,
    );
    const sqlPath = join(migrationsDir, latestFolder, "migration.sql");

    // Injeta o arquivo SQL gerado diretamente no Turso
    execSync(`turso db shell ${DB_NAME} < ${sqlPath}`, { stdio: "inherit" });
    console.log("\n✅ Banco de dados atualizado com sucesso na borda!");

    console.log("\n🔄 Passo 3: Gerando as tipagens do Prisma (TypeScript)...");
    execSync(`pnpm dlx prisma generate`, { stdio: "inherit" });
    console.log("\n🎉 Tudo pronto e 100% tipado!");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
  console.error("\n❌ Operação abortada devido a um erro.");
  process.exit(1);
}
