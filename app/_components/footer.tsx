export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
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
  );
}
