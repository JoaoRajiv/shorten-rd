"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowRight,
  Loader2Icon,
} from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { toast } from "sonner";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { LinkForm } from "./_components/link-form";
import { ResultDisplay } from "./_components/result-display";

export default function Home() {
  const [resultSlug, setResultSlug] = useState<string | null>(null);
  const { isLoaded, userId } = useAuth();
  const isSignedIn = !!userId;

  const handleResult = (slug: string) => {
    setResultSlug(slug);
    toast.success("Link encurtado com sucesso!", {
      className: "rounded-none border-black",
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-zinc-50 font-sans text-zinc-950 selection:bg-black selection:text-white">
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-125 w-125 rounded-full bg-cyan-300/10 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] h-125 w-125 rounded-full bg-red-500/10 blur-[120px] mix-blend-multiply" />
      </div>

      <Header />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-100 space-y-8 bg-white/40 p-8 shadow-[0_0_40px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl border border-white/50">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-wide">Encurtador</h1>
            <p className="text-sm text-zinc-500">
              Gestão de links operacionais.
            </p>
          </div>

          {!isLoaded && (
            <div className="flex justify-center p-8">
              <span className="text-sm text-zinc-400 flex items-center gap-2">
                <Loader2Icon className="animate-spin h-4 w-4" /> Carregando...
              </span>
            </div>
          )}

          {isLoaded && isSignedIn && (
            <>
              <LinkForm onResult={handleResult} />
              {resultSlug && <ResultDisplay key={resultSlug} slug={resultSlug} />}
            </>
          )}

          {isLoaded && !isSignedIn && (
            <div className="mt-4 border border-zinc-200 bg-white/80 p-6 text-center shadow-sm">
              <h2 className="mb-2 text-sm font-medium">Acesso Restrito</h2>
              <p className="mb-6 text-xs text-zinc-500">
                Autentique-se para gerenciar o roteamento.
              </p>
              <SignInButton mode="modal">
                <button className="inline-flex h-9 items-center justify-center bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
                  Fazer Login <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
