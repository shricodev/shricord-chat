import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SocketProvider } from "@/components/providers/socket-provider";

const opensans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "shricord - minimalistic discord",
  description:
    "Minimalistic Discord with just the necessary features you need.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      {/* suppressHydrationWarning is just for the ThemeProvider. */}
      <html lang="en" suppressHydrationWarning>
        <body className={cn(opensans.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider
            attribute="class"
            storageKey="shricord-theme-settings"
            defaultTheme="light"
            enableSystem
          >
            <SocketProvider>
              <QueryProvider>
                <ModalProvider />
                {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
