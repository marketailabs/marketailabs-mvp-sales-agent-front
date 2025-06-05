import { Work_Sans, Inter } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { ThemeProvider } from "@/components/ui/theme-provider";

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
    default: "Chat Semantico Comercial",
    template: "%s | Chat Semantico Comercial",
  },
  description: "Chat Semantico Comercial",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${workSans.variable} ${inter.variable} antialiased`}>
        {(await draftMode()).isEnabled && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
