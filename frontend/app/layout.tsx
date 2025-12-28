import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApiProvider } from "@/lib/providers/api-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuantumHealth - AI Healthcare Platform",
  description: "Advanced healthcare analytics powered by quantum-secure AI technology. Providing predictive insights while maintaining the highest security standards.",
  keywords: ["healthcare", "AI", "quantum computing", "medical predictions", "HIPAA compliant"],
  authors: [{ name: "QuantumHealth Team" }],
  openGraph: {
    title: "QuantumHealth - AI Healthcare Platform",
    description: "Advanced healthcare analytics powered by quantum-secure AI technology.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApiProvider>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton 
            duration={4000}
          />
        </ApiProvider>
      </body>
    </html>
  );
}
