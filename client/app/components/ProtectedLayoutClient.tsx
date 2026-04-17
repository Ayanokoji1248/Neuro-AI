// components/ProtectedLayoutClient.tsx
"use client";

import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function ProtectedLayoutClient({
    children,
    scans
}: {
    children: ReactNode,
    scans: []
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // Server-side ProtectedLayout already validates token, so no client-side check needed

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-[#1E293B]">
            <Sidebar scans={scans} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main className="flex-1 flex flex-col overflow-hidden relative">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar bg-[#F8FAFC]">
                    {children}
                </div>
            </main>
        </div>
    );
}