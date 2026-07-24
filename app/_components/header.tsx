"use client";

import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { Link2, Loader2Icon, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { isLoaded, userId } = useAuth();
  const isSignedIn = !!userId;

  return (
    <header className="relative z-10 flex h-16 w-full shrink-0 items-center justify-between border-b border-zinc-200 bg-white/60 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center border border-zinc-200 bg-white shadow-sm">
          <Link2 className="h-4 w-4 text-zinc-900" strokeWidth={1.5} />
        </div>
        <span className="text-sm font-semibold tracking-wide text-zinc-900">
          Rajiv Dev
        </span>
      </div>

      <div className="flex items-center gap-3">
        {!isLoaded && (
          <Loader2Icon className="h-4 w-4 animate-spin text-zinc-400" />
        )}
        {isLoaded && isSignedIn && (
          <>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 border border-zinc-200 px-3 py-1.5 text-[11px] font-medium tracking-wider text-zinc-600 hover:text-black hover:border-zinc-400 transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              DASHBOARD
            </Link>
            <UserButton
              appearance={{ elements: { avatarBox: "rounded-none h-8 w-8" } }}
            />
          </>
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
  );
}
