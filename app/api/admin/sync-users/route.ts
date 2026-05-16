import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  // 1. Proteção básica: só roda se você passar ?secret=sua_senha na URL
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Troque "rajiv-admin-123" por uma senha da sua escolha
  if (secret !== "rajiv-admin-123") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
  }

  try {
    // 2. Instancia o cliente do Clerk e busca os usuários (limite de 100 por vez)
    const client = await clerkClient();
    const { data: users } = await client.users.getUserList({
      limit: 100,
    });

    let upsertedCount = 0;

    // 3. Itera sobre a lista e faz o Upsert no Turso usando Promise.all para performance
    await Promise.all(
  users.map(async (clerkUser) => {
    console.log(`Processando usuário: ${clerkUser.id} - ${clerkUser.emailAddresses[0]?.emailAddress}`);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    
    if (!email) return;

    // 1. Verifica se já existe algum registro com ESSE e-mail no banco
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      // 2. Se o e-mail já existe mas o clerkId mudou (caso de re-criação de conta)
      // Nós apenas atualizamos o clerkId do usuário existente
      if (existingUserByEmail.clerkId !== clerkUser.id) {
        await prisma.user.update({
          where: { id: existingUserByEmail.id },
          data: { clerkId: clerkUser.id },
        });
      }
    } else {
      // 3. Se o e-mail não existe no banco, o upsert tradicional pelo clerkId é 100% seguro
      await prisma.user.upsert({
        where: { clerkId: clerkUser.id },
        update: { email: email },
        create: {
          clerkId: clerkUser.id,
          email: email,
        },
      });
    }
    
    upsertedCount++;
  })
);

    return NextResponse.json({
      success: true,
      message: `Sincronização concluída. ${upsertedCount} usuários atualizados/inseridos no Turso.`,
    });
  } catch (error) {
    console.error("Erro ao sincronizar usuários:", error);
    return NextResponse.json(
      { error: "Falha na sincronização." },
      { status: 500 },
    );
  }
}
