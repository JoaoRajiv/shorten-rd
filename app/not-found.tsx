import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-80 space-y-6 bg-white/40 p-8 shadow-[0_0_40px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl border border-white/50 text-center">
        <h1 className="text-4xl font-semibold tracking-wide text-zinc-900">
          404
        </h1>
        <p className="text-sm text-zinc-500">
          Link não encontrado ou inválido.
        </p>
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
