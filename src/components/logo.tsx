import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** light = putih di header gelap | dark = merah di hero terang */
  variant?: "light" | "dark";
  className?: string;
};

const LOGO_ASPECT = 769 / 298;

export function Logo({ variant = "light", className }: LogoProps) {
  const src =
    variant === "dark" ? "/images/logo-merah.png" : "/images/logo-white.png";

  return (
    <Link
      href="/"
      className={cn("relative block shrink-0", className)}
      aria-label="888balens home"
    >
      <span
        className={cn(
          "relative block w-[min(160px,45vw)] sm:w-[200px] md:w-[240px] lg:w-[min(300px,7vw)]",
          variant === "light" && "mix-blend-lighten",
          variant === "dark" && "mix-blend-darken",
        )}
        style={{ aspectRatio: LOGO_ASPECT }}
      >
        <Image
          src={src}
          alt="888balens"
          fill
          priority
          className="object-contain object-left"
          sizes="(max-width: 640px) 160px, (max-width: 1024px) 240px, 300px"
        />
      </span>
    </Link>
  );
}