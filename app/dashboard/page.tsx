import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { DashboardHeader } from "./header";
import { LinkRow } from "./link-row";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      links: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return user;
}

export default async function DashboardPage() {
  const user = await getDashboardData();
  if (!user) redirect("/");

  const totalClicks = user.links.reduce((sum, l) => sum + l.clicks, 0);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans selection:bg-black selection:text-white">
      <DashboardHeader />

      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* STATUS CARDS */}
        <div className="grid grid-cols-3 gap-0 mb-10 border border-zinc-200 bg-white/60 backdrop-blur-xl">
          <div className="border-r border-zinc-200 p-5">
            <span className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
              Total Links
            </span>
            <span className="block text-3xl font-bold tracking-tight text-zinc-950">
              {String(user.links.length).padStart(2, "0")}
            </span>
          </div>
          <div className="border-r border-zinc-200 p-5">
            <span className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
              Total Cliques
            </span>
            <span className="block text-3xl font-bold tracking-tight text-black">
              {String(totalClicks).padStart(2, "0")}
            </span>
          </div>
          <div className="p-5">
            <span className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
              Sistema
            </span>
            <span className="block text-3xl font-bold tracking-tight text-zinc-950">
              Operacional
            </span>
          </div>
        </div>

        {/* TABLE */}
        <div className="border border-zinc-200 bg-white/60 backdrop-blur-xl">
          <div className="border-b border-zinc-200 px-5 py-3 flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-zinc-600">
              Links Cadastrados
            </h2>
            <span className="text-[10px] tracking-wider text-zinc-400">
              {new Date().toLocaleDateString("pt-BR")}
            </span>
          </div>

          {/* COLUMN LABELS */}
          {user.links.length > 0 && (
            <div className="hidden sm:grid grid-cols-12 gap-0 border-b border-zinc-200 text-[10px] uppercase tracking-widest font-medium text-zinc-400">
              <div className="col-span-3 p-3 border-r border-zinc-200">
                Slug
              </div>
              <div className="col-span-4 p-3 border-r border-zinc-200">
                Destino
              </div>
              <div className="col-span-2 p-3 border-r border-zinc-200 text-right">
                Cliques
              </div>
              <div className="col-span-2 p-3 border-r border-zinc-200">
                Criado em
              </div>
              <div className="col-span-1 p-3 text-center">
                Act
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {user.links.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-xs text-zinc-400 mb-6">
                Nenhum link cadastrado.
              </p>
              <Link
                href="/"
                className="inline-block bg-black px-5 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                Criar primeiro link
              </Link>
            </div>
          )}

          {/* ROWS */}
          {user.links.length > 0 && (
            <div>
              {user.links.map((link, idx) => (
                <LinkRow
                  key={link.id}
                  link={link}
                  isLast={idx === user.links.length - 1}
                />
              ))}
            </div>
          )}

          {/* FOOTER */}
          <div className="border-t border-zinc-200 px-5 py-2 text-[10px] tracking-wider text-zinc-400 text-right">
            {user.links.length} registro(s)
          </div>
        </div>
      </main>
    </div>
  );
}
