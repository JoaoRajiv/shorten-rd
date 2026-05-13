import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  // A chave secreta que o painel do Clerk vai te fornecer
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "A variável de ambiente CLERK_WEBHOOK_SECRET não está configurada.",
    );
  }

  // Captura os cabeçalhos de segurança gerados pelo Svix
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  // Se não houver os cabeçalhos corretos, bloqueia imediatamente (Unauthorized)
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Erro: Cabeçalhos do Svix ausentes.", { status: 401 });
  }

  // O Svix exige o corpo da requisição em formato de string bruta (raw) para validar a assinatura
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    // Validação criptográfica da assinatura
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Erro ao verificar assinatura do Webhook:", err);
    return new Response("Erro na verificação da assinatura.", { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  // Processamento dos Eventos
  try {
    if (eventType === "user.created") {
      const email = evt.data.email_addresses[0].email_address;

      await prisma.user.create({
        data: {
          clerkId: id as string,
          email: email,
        },
      });
      console.log(`Usuário criado: ${id}`);
    }

    if (eventType === "user.updated") {
      const email = evt.data.email_addresses[0].email_address;

      await prisma.user.update({
        where: { clerkId: id as string },
        data: { email: email },
      });
      console.log(`Usuário atualizado: ${id}`);
    }

    if (eventType === "user.deleted") {
      await prisma.user.delete({
        where: { clerkId: id as string },
      });
      console.log(`Usuário deletado: ${id}`);
    }

    return new Response("Webhook recebido e processado.", { status: 200 });
  } catch (error) {
    console.error("Erro ao processar evento no banco de dados:", error);
    return new Response("Erro interno ao salvar no banco.", { status: 500 });
  }
}
