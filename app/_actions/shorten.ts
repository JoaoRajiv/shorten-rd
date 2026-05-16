"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSyncedUser } from "@/lib/user-sync";

// Tipagem rigorosa para a comunicação entre a Action e o Client Component
export type ActionResponse = {
  success: boolean;
  message: string;
  slug?: string;
};

// Validação de entrada na borda com Zod
const shortLinkSchema = z.object({
  url: z.url({ message: "Por favor, insira uma URL válida." }),
  slug: z
    .string()
    .min(3, {
      message: "O slug personalizado deve ter no mínimo 3 caracteres.",
    })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "O slug só pode conter letras, números e hifens.",
    })
    .optional()
    .or(z.literal("")), // Permite string vazia caso o input seja submetido sem preenchimento
});

export async function createShortLink(
  prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    // 1. Barreira de Autenticação e Sincronização (Upsert JIT)
    // Se o usuário não existir no Turso, ele é criado neste exato momento.
    const user = await getSyncedUser();

    if (!user) {
      return {
        success: false,
        message: "Acesso restrito. Por favor, faça login para continuar.",
      };
    }

    // 2. Extração e Validação dos Dados do Formulário
    const rawData = Object.fromEntries(formData.entries());
    const parsed = shortLinkSchema.safeParse({
      url: rawData.url,
      slug: rawData.slug,
    });

    if (!parsed.success) {
      // Retorna o primeiro erro mapeado pelo Zod para o frontend (Sonner)
      return { success: false, message: parsed.error.issues[0].message };
    }

    const { url, slug } = parsed.data;

    // 3. Definição do Slug Final
    // Usa o slug fornecido ou gera um identificador alfanumérico curto de 6 caracteres
    const finalSlug =
      slug && slug.trim() !== ""
        ? slug.trim()
        : Math.random().toString(36).substring(2, 8);

    // 4. Verificação de Colisão no Banco de Dados (Turso)
    const existingSlug = await prisma.shortLink.findUnique({
      where: { slug: finalSlug },
    });

    if (existingSlug) {
      return {
        success: false,
        message: slug
          ? "Este slug personalizado já está em uso. Escolha outro."
          : "Colisão de slug detectada. Tente encurtar novamente.",
      };
    }

    // 5. Persistência de Dados e Associação de Chave Estrangeira
    await prisma.shortLink.create({
      data: {
        url,
        slug: finalSlug,
        userId: user.id, // Referência direta ao ID local do Turso, não ao Clerk
      },
    });

    return {
      success: true,
      message: "Link operacional gerado com sucesso.",
      slug: finalSlug,
    };
  } catch (error) {
    console.error("Falha crítica na Action createShortLink:", error);
    return {
      success: false,
      message:
        "Ocorreu um erro interno no servidor ao processar sua requisição.",
    };
  }
}
