import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WhiteLabelProvider } from "@/contexts/WhiteLabelContext";

export const metadata: Metadata = {
  title: "TeamHub",
  description: "New Generation TeamHub 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <WhiteLabelProvider>
            <AppLayout>{children}</AppLayout>
          </WhiteLabelProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
