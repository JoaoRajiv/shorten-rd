import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!slug || !/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(slug)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const link = await prisma.shortLink.findUnique({
      where: { slug },
    });

    if (!link) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Fire-and-forget: não bloqueia o redirect
    prisma.shortLink.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    }).catch(() => {});
    prisma.clickEvent.create({
      data: {
        linkId: link.id,
        referrer: request.headers.get("referer"),
        userAgent: request.headers.get("user-agent"),
      },
    }).catch(() => {});

    const destination = new URL(link.url);
    if (destination.protocol !== "http:" && destination.protocol !== "https:") {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.redirect(destination, 308);
  } catch (error) {
    console.error("Erro ao redirecionar:", error);
    return new NextResponse("Not Found", { status: 404 });
  }
}
