function FooterWordmark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none select-none font-sans text-[clamp(4rem,18vw,12rem)] font-bold leading-none tracking-[-0.04em] lowercase text-transparent ${className ?? ""}`}
      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.12)" }}
    >
      .bbr
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-20 w-full overflow-hidden bg-black py-14 sm:py-16 md:py-20">
      <FooterWordmark className="absolute top-1/2 -left-[8%] -translate-y-1/2 opacity-80" />
      <FooterWordmark className="absolute top-1/2 -right-[8%] -translate-y-1/2 opacity-80" />

      <p className="relative z-10 text-center font-sans text-sm font-bold tracking-[0.04em] text-white lowercase sm:text-base">
        be better&copy;
      </p>
    </footer>
  );
}
