import "./globals.css";

import { Geist, Geist_Mono, Noto_Serif } from "next/font/google";

import { ThemeProvider } from "@/_components/common/theme-provider";
import { Toaster } from "@/_components/ui/sonner";
import { AuthProvider } from "@/_contexts/auth-context";
import { cn } from "@/_lib/utils";

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
          <Toaster />
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
