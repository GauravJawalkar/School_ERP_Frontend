import ReactQueryProvider from "@/lib/providers/ReactQueryProvider";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${inter.variable}`}>
            <body className={`antialiased`}>
                <ReactQueryProvider>
                    {children}
                    <Toaster position="top-center" reverseOrder={false} />
                </ReactQueryProvider>
            </body>
        </html >
    )
}