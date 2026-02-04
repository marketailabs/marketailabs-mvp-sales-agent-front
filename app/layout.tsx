import { Work_Sans, Inter } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Profiler | Chat Semantico Comercial",
    template: "%s | Chat Semantico Comercial",
  },
  description: "Chat Semantico Comercial",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${workSans.variable} ${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session} refetchOnWindowFocus={false}>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
