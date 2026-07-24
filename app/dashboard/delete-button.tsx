"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type DeleteButtonProps = {
  id: string;
  slug: string;
};

export function DeleteButton({ id, slug }: DeleteButtonProps) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Deletar links.rajiv.dev.br/${slug}?`,
    );
    if (!confirmed) return;

    const { deleteLink } = await import("./actions");
    const result = await deleteLink(id);

    if (result.success) {
      toast.success("Link deletado.", {
        className: "rounded-none border-black",
      });
    } else {
      toast.error(result.message || "Erro ao deletar.", {
        className: "rounded-none border-black",
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex h-8 w-8 shrink-0 items-center justify-center border border-zinc-200 bg-white text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
      title="Deletar link"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
