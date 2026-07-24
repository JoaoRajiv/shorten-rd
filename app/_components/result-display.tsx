"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

type ResultDisplayProps = {
  slug: string;
};

export function ResultDisplay({ slug }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const shortUrl = `https://links.rajiv.dev.br/${slug}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("Link copiado para a área de transferência!", {
      className: "rounded-none border-black",
    });
    setCopied(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 mt-8 flex items-center justify-between border border-zinc-200 bg-white/80 p-3 shadow-sm">
      <div className="flex flex-col overflow-hidden">
        <span className="text-xs text-zinc-500">Link pronto:</span>
        <span className="truncate text-sm font-medium text-black">
          links.rajiv.dev.br/{slug}
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
  );
}
