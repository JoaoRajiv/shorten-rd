"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

const shortLinkSchema = z.object({
  url: z.url("URL inválida."),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e hifens.")
    .optional()
    .or(z.literal("")),
});

export type ActionResponse = {
  success: boolean;
  message: string;
  slug?: string;
};

export async function createShortLink(
  prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    // 1. Verificação de Autenticação na Borda
    const { userId: clerkId } = await auth();
    const user = await currentUser();

    if (!clerkId || !user) {
      return { success: false, message: "Acesso negado. Faça login." };
    }

    // 2. Validação dos dados do formulário
    const data = Object.fromEntries(formData.entries());
    const parsed = shortLinkSchema.safeParse(data);

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0].message };
    }

    const { url, slug } = parsed.data;
    const finalSlug = slug || Math.random().toString(36).substring(2, 8);

    // 3. Verifica duplicidade do Slug
    const existingSlug = await prisma.shortLink.findUnique({
      where: { slug: finalSlug },
    });

    if (existingSlug) {
      return { success: false, message: "Este slug já está em uso." };
    }

    // 4. Garante que o usuário existe no Prisma (Espelhamento seguro)
    const internalUser = await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: {
        clerkId,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    // 5. Salva o link atrelado ao usuário
    await prisma.shortLink.create({
      data: {
        url,
        slug: finalSlug,
        userId: internalUser.id,
      },
    });

    return {
      success: true,
      message: "Link operacional criado.",
      slug: finalSlug,
    };
  } catch (error) {
    console.error("Falha no servidor:", error);
    return {
      success: false,
      message: "Erro interno ao processar a requisição.",
    };
  }
}
