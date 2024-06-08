import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { cn } from "@sobrxrpl/ui";
import { ThemeProvider, ThemeToggle } from "@sobrxrpl/ui/theme";
import { Toaster } from "@sobrxrpl/ui/toast";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import logo from "~/../public/xrpl-logo2.png";
import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { env } from "~/env";
import { AuthShowcase } from "./_components/auth-showcase";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Create T3 Turbo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>
            <main className="container h-screen py-16">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex justify-center gap-4 align-middle">
                  <img
                    src={logo.src}
                    alt="XRPL Logo"
                    className="m-auto h-32 w-32 rounded-full"
                  />
                  <h1 className="m-auto flex-1 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                    Sobr XRPL
                  </h1>
                </div>
                <AuthShowcase />
                {props.children}
              </div>
            </main>
          </TRPCReactProvider>
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
