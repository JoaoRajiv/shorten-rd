"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
// 1. Importamos o hook useAuth em vez dos wrappers
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Copy,
  Link2,
  ArrowRight,
  Check,
  Loader2Icon,
  InfoIcon,
} from "lucide-react";
import { createShortLink } from "./_actions/shorten";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./_components/ui/tooltip";

// Botão com design inspirado na Vercel (preto sólido, cantos retos)
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-11 w-full items-center justify-center bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Processando..." : "Encurtar URL"}
    </button>
  );
}

export default function Home() {
  const [resultSlug, setResultSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // 2. Extraímos o estado de carregamento e o ID do usuário
  const { isLoaded, userId } = useAuth();
  const isSignedIn = !!userId;

  async function clientAction(formData: FormData) {
    const response = await createShortLink(null, formData);

    if (response?.success && response?.slug) {
      setResultSlug(response.slug);
      toast.success("Link encurtado com sucesso!", {
        className: "rounded-none border-black",
      });
      formRef.current?.reset();
      setCopied(false);
    } else {
      toast.error("Erro ao encurtar o link.", {
        className: "rounded-none border-black",
      });
    }
  }

  const copyToClipboard = () => {
    if (!resultSlug) return;
    const shortUrl = `https://links.rajiv.dev.br/${resultSlug}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("Link copiado para a área de transferência!", {
      className: "rounded-none border-black",
    });
    setCopied(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6 font-sans text-zinc-950 selection:bg-black selection:text-white">
      {/* Header Autenticação */}
      <div className="absolute right-6 top-6">
        {isLoaded && isSignedIn && (
          <UserButton
            appearance={{ elements: { avatarBox: "rounded-none" } }}
          />
        )}
      </div>

      <div className="w-full max-w-100 space-y-8">
        {/* Branding Minimalista */}
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center border border-zinc-200 bg-zinc-50">
            <Link2 className="h-5 w-5 text-zinc-900" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-semibold tracking-wide">Rajiv Dev</h1>
          <p className="text-sm text-zinc-500">Encurtador de Links</p>
        </div>

        {/* Evita piscar a tela enquanto o Clerk verifica a sessão */}
        {!isLoaded && (
          <div className="flex justify-center p-8">
            <span className="text-sm text-zinc-400 flex items-center gap-2">
              <Loader2Icon className="animate-spin" /> Verificando sessão...
            </span>
          </div>
        )}

        {/* 3. Renderiza o formulário APENAS se estiver logado */}
        {isLoaded && isSignedIn && (
          <>
            <form action={clientAction} ref={formRef} className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="url"
                  className="text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  URL Original
                </label>
                <input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="https://exemplo.com/produto"
                  required
                  className="flex h-11 w-full border border-zinc-200 bg-transparent px-3 py-1 text-sm transition-colors placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="slug"
                  className="text-xs flex items-center font-medium uppercase tracking-wider text-zinc-500"
                >
                  Slug Personalizado{" "}
                  <span className="lowercase text-zinc-400">(opcional)</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="ml-1 h-3.5 w-3.5 text-zinc-700" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        O slug serve para criar uma URL amigável e memorável
                        para o seu link encurtado.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  placeholder="promocao-natal"
                  className="flex h-11 w-full border border-zinc-200 bg-transparent px-3 py-1 text-sm transition-colors placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-2">
                <SubmitButton />
              </div>
            </form>

            {/* Resultado do Link */}
            {resultSlug && (
              <div className="animate-in fade-in slide-in-from-bottom-2 mt-8 flex items-center justify-between border border-zinc-200 bg-zinc-50 p-3">
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs text-zinc-500">Link pronto:</span>
                  <span className="truncate text-sm font-medium text-black">
                    links.rajiv.dev.br/{resultSlug}
                  </span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-black"
                  title="Copiar link"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* 4. Renderiza o aviso de login APENAS se estiver deslogado */}
        {isLoaded && !isSignedIn && (
          <div className="mt-8 border border-zinc-200 bg-zinc-50 p-6 text-center">
            <h2 className="mb-2 text-sm font-medium">Acesso Restrito</h2>
            <p className="mb-6 text-xs text-zinc-500">
              Autentique-se para gerenciar o roteamento de URLs.
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
  );
}
