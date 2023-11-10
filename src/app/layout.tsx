import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const opensans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "shricord - minimalistic discord",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={opensans.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
