import type { Metadata } from "next";
import { Inter, Pinyon_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const logoScript = Pinyon_Script({
  variable: "--font-logo-script",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "888balens — Hand-Painted Streetwear Indonesia",
    template: "%s | 888balens",
  },
  description:
    "Limited drop, hand-painted streetwear. Hoodie, jersey, tracktop — custom order available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${logoScript.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
