"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCallback, useState } from "react";
import { Logo } from "@/components/logo";
import { MobileMenuDrawer } from "@/components/mobile-menu-drawer";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/shop", label: "SHOP" },
  { href: "/", label: "HOME" },
  { href: "/how-to-order", label: "HOW TO ORDER" },
] as const;

type SiteHeaderProps = {
  variant?: "transparent" | "solid";
};

export function SiteHeader({ variant = "solid" }: SiteHeaderProps) {
  const pathname = usePathname();
  const isTransparent = variant === "transparent";
  const [menuActive, setMenuActive] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activateMenu = useCallback(() => setMenuActive(true), []);
  const deactivateMenu = useCallback(() => setMenuActive(false), []);

  const showUnderlay = isTransparent ? menuActive : true;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 overflow-visible"
        onMouseLeave={isTransparent ? deactivateMenu : undefined}
      >
        <div
          className={cn(
            "relative h-16 md:h-[72px]",
            !isTransparent && "border-b border-white/5 bg-[#0A0A0A]",
          )}
        >
          {isTransparent && (
            <motion.div
              aria-hidden
              initial={false}
              animate={{ opacity: showUnderlay ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute inset-0 bg-[#f5f3ef]/95 backdrop-blur-md"
            />
          )}

          <div className="relative mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 md:px-10 lg:px-14">
            {/* Kiri: logo besar (overflow ke bawah), navbar tetap tipis */}
            <div className="relative z-20 flex h-full items-center gap-3 overflow-visible md:gap-4">
              <button
                type="button"
                aria-label="Open menu"
                className={cn(
                  "relative z-30 flex shrink-0 flex-col justify-center gap-[5px] md:hidden",
                  isTransparent ? "text-black" : "text-white",
                )}
                onClick={() => setDrawerOpen(true)}
              >
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-5 bg-current" />
              </button>

              <div className="relative pt-2 md:pt-2.5">
                <Logo variant={isTransparent ? "dark" : "light"} />
              </div>
            </div>

            {/* Tengah: nav links */}
            <nav
              className="absolute left-1/2 hidden -translate-x-1/2 md:block"
            aria-label="Main"
            onMouseEnter={isTransparent ? activateMenu : undefined}
          >
            <ul className="flex items-center gap-8 lg:gap-12">
              {navLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <li
                    key={link.href}
                    onPointerEnter={isTransparent ? activateMenu : undefined}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "text-[11px] font-semibold tracking-[0.22em] transition-opacity lg:text-xs",
                        isTransparent
                          ? "text-black/90 hover:text-black"
                          : "text-white/90 hover:text-white",
                        active ? "opacity-100" : "opacity-55",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

            {/* Kanan: search + cart */}
            <div
              className={cn(
              "relative z-10 flex items-center gap-5 md:gap-6",
              isTransparent ? "text-black" : "text-white",
            )}
            onMouseEnter={isTransparent ? activateMenu : undefined}
          >
            <button
              type="button"
              aria-label="Search"
              className="text-[11px] font-semibold tracking-[0.22em] transition-opacity hover:opacity-60 lg:text-xs"
            >
              <span className="hidden md:inline">SEARCH</span>
              <span className="md:hidden">
                <svg
                  aria-hidden
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-[18px] w-[18px]"
                >
                  <circle
                    cx="9"
                    cy="9"
                    r="4.75"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.25"
                    d="m12.5 12.5 3.25 3.25"
                  />
                </svg>
              </span>
            </button>
            <button
              type="button"
              aria-label="Cart"
              className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.22em] transition-opacity hover:opacity-60 lg:text-xs"
            >
              <span className="hidden md:inline">CART</span>
              <ShoppingBag className="h-[17px] w-[17px] stroke-[1.5] md:hidden" />
            </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenuDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        theme={isTransparent ? "light" : "dark"}
      />
    </>
  );
}
