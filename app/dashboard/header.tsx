"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { Link2, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  const { isLoaded, userId } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white/60 backdrop-blur-xl px-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-zinc-200 bg-white shadow-sm">
            <Link2 className="h-4 w-4 text-zinc-900" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-semibold tracking-wide text-zinc-900">
            Rajiv Dev
          </span>
        </Link>
        <span className="flex items-center gap-1.5 text-xs text-zinc-400">
          <LayoutDashboard className="h-3 w-3" />
          Dashboard
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-xs font-medium text-zinc-500 hover:text-black transition-colors"
        >
          Encurtador
        </Link>
        {isLoaded && userId && (
          <UserButton
            appearance={{ elements: { avatarBox: "rounded-none h-8 w-8" } }}
          />
        )}
      </div>
    </header>
  );
}
