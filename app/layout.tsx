import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { TooltipProvider } from "./_components/ui/tooltip";
import { Analytics } from "@vercel/analytics/next";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans", // Cria uma variável CSS para o Tailwind
});

export const metadata: Metadata = {
  title: "ShortenRD - Encurtador de URLs",
  description:
    "Encurte suas URLs de forma rápida e fácil com ShortenRD. Crie links personalizados, acompanhe cliques e compartilhe seus links com estilo. Experimente agora!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${font.variable} h-full antialiased`}>
      <body>
        <ClerkProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ClerkProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
