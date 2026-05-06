import "./globals.css";

import { Geist, Geist_Mono, Noto_Serif } from "next/font/google";

import { ThemeProvider } from "@/src/_components/theme-provider";
import { Toaster } from "@/src/_components/ui/sonner";
import { AuthProvider } from "@/src/_contexts/auth-context";
import { cn } from "@/src/_lib/utils";

import Footer from "../_components/common/footer";
import Navbar from "../_components/common/navbar";

const notoSerif = Noto_Serif({ subsets: ["latin"], variable: "--font-serif" });

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        fontMono.variable,
        "font-serif",
        notoSerif.variable,
        "text-base",
      )}
    >
      <body>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
