import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { PortfoliosProvider } from "@/contexts/PortfoliosContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "FINBAR - ניהול תיקי השקעות",
  description: "מעקב אחר תיקי השקעות אישיים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased">
        <PortfoliosProvider>
          {children}
          <Toaster position="top-center" />
        </PortfoliosProvider>
      </body>
    </html>
  );
}