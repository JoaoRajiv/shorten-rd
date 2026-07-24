"use client";

import { Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LinkRowProps = {
  link: {
    id: string;
    url: string;
    slug: string;
    clicks: number;
    createdAt: Date;
  };
  isLast: boolean;
};

export function LinkRow({ link, isLast }: LinkRowProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const shortUrl = `links.rajiv.dev.br/${link.slug}`;

  const copySlug = () => {
    navigator.clipboard.writeText(`https://${shortUrl}`);
    toast.success("Link copiado.", {
      className: "rounded-none border border-zinc-200 text-xs",
    });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Deletar ${link.slug}?`);
    if (!confirmed) return;

    setDeleting(true);
    const { deleteLink } = await import("./actions");
    const result = await deleteLink(link.id);
    setDeleting(false);

    if (result.success) {
      toast.success("Link deletado.", {
        className: "rounded-none border border-zinc-200 text-xs",
      });
      router.refresh();
    } else {
      toast.error(result.message || "Erro ao deletar.", {
        className: "rounded-none border border-zinc-200 text-xs",
      });
    }
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-12 gap-0 text-sm ${!isLast ? "border-b border-zinc-200" : ""} hover:bg-zinc-50 transition-colors`}>
      {/* SLUG */}
      <div className="sm:col-span-3 p-3 sm:border-r border-zinc-200 flex items-center gap-2">
        <a
          href={`https://${shortUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-zinc-900 hover:underline truncate"
        >
          {link.slug}
        </a>
        <button
          onClick={copySlug}
          className="shrink-0 p-1 text-zinc-400 hover:text-zinc-700 transition-colors"
          title="Copiar link"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* DESTINATION */}
      <div className="sm:col-span-4 px-3 pb-2 sm:py-3 sm:border-r border-zinc-200 flex items-center">
        <span className="truncate text-xs text-zinc-500">
          {link.url}
        </span>
      </div>

      {/* CLICKS */}
      <div className="sm:col-span-2 px-3 pb-2 sm:py-3 sm:border-r border-zinc-200 flex items-center justify-start sm:justify-end gap-1">
        <span className="font-bold text-sm tabular-nums">{link.clicks}</span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-400">
          cliques
        </span>
      </div>

      {/* CREATED */}
      <div className="sm:col-span-2 px-3 pb-2 sm:py-3 sm:border-r border-zinc-200 flex items-center">
        <span className="text-xs text-zinc-500">
          {new Date(link.createdAt).toLocaleDateString("pt-BR")}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="sm:col-span-1 p-3 flex items-center justify-center gap-1">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 border border-zinc-300 text-zinc-400 hover:text-red-600 hover:border-red-300 transition-colors disabled:opacity-30"
          title="Deletar link"
        >
          {deleting ? (
            <span className="block w-3.5 h-3.5 border border-zinc-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
