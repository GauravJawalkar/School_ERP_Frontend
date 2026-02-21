import ReactQueryProvider from "@/lib/providers/ReactQueryProvider";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "../globals.css";

export const metadata: Metadata = {
    title: "Login | Neritic Dashboard",
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            {children}
        </>
    )
}