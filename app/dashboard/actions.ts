"use server";

import prisma from "@/lib/prisma";
import { getSyncedUser } from "@/lib/user-sync";

export type DeleteResponse = {
  success: boolean;
  message?: string;
};

export async function deleteLink(
  id: string,
): Promise<DeleteResponse> {
  try {
    const user = await getSyncedUser();
    if (!user) {
      return { success: false, message: "Acesso restrito." };
    }

    const link = await prisma.shortLink.findUnique({
      where: { id },
    });

    if (!link || link.userId !== user.id) {
      return { success: false, message: "Link não encontrado." };
    }

    await prisma.shortLink.delete({ where: { id } });

    return { success: true };
  } catch {
    return { success: false, message: "Erro ao deletar link." };
  }
}
