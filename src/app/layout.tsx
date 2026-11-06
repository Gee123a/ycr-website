import type { Metadata, Viewport } from "next";
import { Lilita_One, Nunito } from "next/font/google";
import "./globals.css";

const lilita = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lilita",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Highway · Youth Catholic Revival",
    template: "%s · The Highway",
  },
  description:
    "Youth Catholic Revival (YCR) \"The Highway\" by KMK Universitas Ciputra: register for events, shop merch, donate, and follow the event timeline.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff8e7" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1a0e" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lilita.variable} ${nunito.variable}`}>
      <body className="min-h-dvh bg-canvas text-ink">{children}</body>
    </html>
  );
}
