import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  // No Next.js mais recente, os params são Promises e devem ser desestruturados assim:
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!slug) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    // 1. Busca o link original no banco
    const link = await prisma.shortLink.findUnique({
      where: { slug },
    });

    // 2. Se o link não existir, joga o usuário de volta para a página inicial
    if (!link) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 3. Incrementa o contador de cliques (Roda em background)
    await prisma.shortLink.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    });

    // 4. Faz o redirecionamento permanente (308) para a URL de destino
    const destination = new URL(link.url);
    if (destination.protocol !== "http:" && destination.protocol !== "https:") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.redirect(destination, 308);
  } catch (error) {
    console.error("Erro ao redirecionar:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
