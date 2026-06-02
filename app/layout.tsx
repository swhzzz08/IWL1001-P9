import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const jetbrainsMonoHeading = JetBrains_Mono({ subsets: ['latin'], variable: '--font-heading' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarketWise — Learn & Trade Smarter",
  description: "Educational stock.ts market platform with live charts and trading resources.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
      <html
          lang="en"
          className={cn(
              "h-full antialiased",
              geistSans.variable, geistMono.variable,
              outfit.variable, jetbrainsMonoHeading.variable,
              "font-sans"
          )}
      >
      <body className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      </body>
      </html>
  );
}