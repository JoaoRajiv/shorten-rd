"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
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
      toast.error(response?.message || "Erro ao encurtar o link.", {
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

  const currentYear = new Date().getFullYear();

  return (
    // Mudamos de main para div e configuramos como flex-col para empilhar Header -> Main -> Footer
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-zinc-50 font-sans text-zinc-950 selection:bg-black selection:text-white">
      {/* EFEITO VISUAL (BLURRED ORBS) FIXO NO FUNDO */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-125 w-125 rounded-full bg-cyan-300/10 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] h-125 w-125 rounded-full bg-red-500/10 blur-[120px] mix-blend-multiply" />
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-10 flex h-16 w-full shrink-0 items-center justify-between border-b border-zinc-200 bg-white/60 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-zinc-200 bg-white shadow-sm">
            <Link2 className="h-4 w-4 text-zinc-900" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-semibold tracking-wide text-zinc-900">
            Rajiv Dev
          </span>
        </div>

        <div className="flex items-center">
          {isLoaded && isSignedIn && (
            <UserButton
              appearance={{ elements: { avatarBox: "rounded-none h-8 w-8" } }}
            />
          )}
          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="text-xs font-medium text-zinc-600 hover:text-black transition-colors">
                Entrar
              </button>
            </SignInButton>
          )}
        </div>
      </header>

      {/* --- CONTEÚDO PRINCIPAL (FLEX-1 empurra o footer para baixo) --- */}
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
                    className="flex h-11 w-full border border-zinc-200 bg-white/80 px-3 py-1 text-sm transition-colors placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="slug"
                    className="text-xs flex items-center font-medium uppercase tracking-wider text-zinc-500"
                  >
                    Slug Personalizado{" "}
                    <span className="lowercase text-zinc-400 ml-1">
                      (opcional)
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="ml-1 focus:outline-none"
                        >
                          <InfoIcon className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-700 transition-colors" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>URL amigável para o seu link.</p>
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    placeholder="promocao-natal"
                    className="flex h-11 w-full border border-zinc-200 bg-white/80 px-3 py-1 text-sm transition-colors placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="pt-2">
                  <SubmitButton />
                </div>
              </form>

              {resultSlug && (
                <div className="animate-in fade-in slide-in-from-bottom-2 mt-8 flex items-center justify-between border border-zinc-200 bg-white/80 p-3 shadow-sm">
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

      {/* --- FOOTER --- */}
      <footer className="relative z-10 flex h-14 w-full shrink-0 items-center justify-center border-t border-zinc-200 bg-white/60 px-6 backdrop-blur-xl">
        <p className="text-xs text-zinc-500">
          Desenvolvido por{" "}
          <a
            href="https://github.com/joaorajiv"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-900 hover:underline hover:text-black transition-colors"
          >
            João Rajiv
          </a>
          . &copy; {currentYear}
        </p>
      </footer>
    </div>
  );
}
