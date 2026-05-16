import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getSyncedUser() {
  // 1. Pega o usuário logado direto da sessão do Clerk
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null; // Não está logado
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return null; // Conta sem e-mail (raro, mas evita quebras)
  }

  // 2. Verifica se já existe algum registro com ESSE e-mail no banco
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUserByEmail) {
    // 3. Se o e-mail já existe mas o clerkId mudou, atualiza o ID
    if (existingUserByEmail.clerkId !== clerkUser.id) {
      return await prisma.user.update({
        where: { id: existingUserByEmail.id },
        data: { clerkId: clerkUser.id },
      });
    }
    // Se está tudo certo, só devolve o usuário do banco
    return existingUserByEmail;
  }

  // 4. Se o e-mail não existe no banco, cria o registro novo limpo
  return await prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email: email,
    },
  });
}
