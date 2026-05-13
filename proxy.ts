import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Rotas publicas (sem protecao)
const isPublicRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isShortSlugRoute = (req: Request) => {
  const { pathname } = new URL(req.url);
  return /^\/[a-z0-9-]+$/.test(pathname);
};

export default clerkMiddleware(async (auth, req) => {
  // Rotas publicas nao exigem sessao
  if (isPublicRoute(req) || isShortSlugRoute(req)) {
    return;
  }

  // Todas as demais rotas exigem login
  await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
