import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/providers/ReactQueryProvider";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "SCHOOL_ERP",
  description: "Builded for School Management & much more...",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={`antialiased`}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html >
  );
}
