import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/tokens.css";
import "../styles/base.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Mood Pack — virtuálne zariadenie priestorov",
  description: "Virtual staging pre realitky a developerov.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
