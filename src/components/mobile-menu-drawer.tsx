"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/shop", label: "SHOP" },
  { href: "/", label: "HOME" },
  { href: "/how-to-order", label: "HOW TO ORDER" },
] as const;

type MobileMenuDrawerProps = {
  open: boolean;
  onClose: () => void;
  theme?: "light" | "dark";
};

export function MobileMenuDrawer({
  open,
  onClose,
  theme = "light",
}: MobileMenuDrawerProps) {
  const pathname = usePathname();
  const isDark = theme === "dark";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed inset-y-0 left-0 z-[70] flex w-[min(100vw,320px)] flex-col px-6 py-8",
              isDark ? "bg-[#0A0A0A] text-white" : "bg-[#f5f3ef] text-black",
            )}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="mb-10 self-start opacity-70"
            >
              <X className="h-5 w-5 stroke-[1.5]" />
            </button>
            <nav aria-label="Mobile menu">
              <ul className="flex flex-col gap-6">
                {links.map((link) => {
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "text-sm font-semibold tracking-[0.2em]",
                          active ? "opacity-100" : "opacity-50",
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
