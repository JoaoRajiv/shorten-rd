"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

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

type LinkFormProps = {
  onResult: (slug: string) => void;
};

export function LinkForm({ onResult }: LinkFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    const { createShortLink } = await import("@/app/_actions/shorten");
    const response = await createShortLink(null, formData);

    if (response?.success && response?.slug) {
      onResult(response.slug);
      formRef.current?.reset();
    }
  }

  return (
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
  );
}
