import type { Metadata } from "next";
import { Outfit, Fraunces, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KiloCarrier — Travel light. Send smart.",
  description:
    "Peer-to-peer cargo courier marketplace between Yangon and Bangkok. Carriers post spare luggage space; senders contact them directly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <Toaster richColors position="top-center" />
        <Analytics />
      </body>
    </html>
  );
}
