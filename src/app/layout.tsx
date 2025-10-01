import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner"
import NavBar from "@/components/NavBar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mystery Messages - Anonymous Feedback Platform",
  description: "Send and receive anonymous messages securely. Join thousands of users sharing honest feedback through Mystery Messages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-indigo-100/50 dark:from-gray-900 dark:via-purple-900/50 dark:to-blue-900/50 min-h-screen`}
      >
        <AuthProvider>
          {children}
          <Toaster richColors expand={true} position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
