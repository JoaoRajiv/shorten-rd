import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Declaramos explicitamente que o webhook é uma rota pública
const isPublicRoute = createRouteMatcher(["/api/webhooks(.*)"]);

// 2. Rotas que precisam de proteção (ex: painel de gerenciamento)
const isProtectedRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  // Se a requisição for para o webhook, retornamos imediatamente,
  // bypassando qualquer verificação de sessão ou handshake do Clerk.
  if (isPublicRoute(req)) {
    return;
  }

  // Se for uma rota protegida, exige login
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
