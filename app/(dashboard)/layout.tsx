"use client"

import "../globals.css";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Header } from "@/components/Navigation/Header";
import { useState } from "react";


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div className="flex h-screen overflow-hidden ">
      <Sidebar isOpen={isSidebarOpen} />
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="w-auto mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
