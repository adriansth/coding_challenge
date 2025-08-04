import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../lib/aws-config";
import AmplifyProvider from "@/components/providers/AmplifyProvider";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Sentiment Notes App",
   description: "Create and share notes with emotional context.",
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
            <QueryProvider>
               <AmplifyProvider>{children}</AmplifyProvider>
            </QueryProvider>
         </body>
      </html>
   );
}
