import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define as rotas que QUALQUER pessoa pode acessar sem estar logada
const isPublicRoute = createRouteMatcher([
  "/", // A página inicial do encurtador
  "/sign-in(.*)", // Rota de login
  "/sign-up(.*)", // Rota de cadastro
  "/api/webhooks/clerk(.*)", // Seu webhook que a Vercel/Clerk precisam acessar livremente
  "/:slug", // O redirecionador de links dinâmico
]);

export default clerkMiddleware(async (auth, req) => {
  // Se NÃO for uma rota pública, exige autenticação
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// O matcher padrão e otimizado do Next.js
export const config = {
  matcher: [
    // Pula arquivos internos do Next.js e arquivos estáticos (imagens, fontes)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Sempre roda para rotas de API
    "/(api|trpc)(.*)",
  ],
};
