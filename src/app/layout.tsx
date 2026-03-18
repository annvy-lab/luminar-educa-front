import "./globals.css";

import { Geist, Geist_Mono, Noto_Serif } from "next/font/google";

import { ThemeProvider } from "@/src/_components/theme-provider";
import { cn } from "@/src/_lib/utils";

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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
