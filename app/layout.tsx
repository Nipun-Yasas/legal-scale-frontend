import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import ThemeProvider from "../_components/common/ThemeProvider";
import "./globals.css";
import { Loading } from "@/_components/common/Loading";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  weight: ["300", "400", "500", "600"],
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Legal Scale - Legal Document Management System",
  description:
    "Integrated Legal Management System for Legal Case Handling and Agreement Approval Management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${robotoMono.variable}`}
    >
      <body className="antialiased">
        <Suspense fallback={<Loading />}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          ><AuthProvider>{children}</AuthProvider>
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
