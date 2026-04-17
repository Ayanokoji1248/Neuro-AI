// components/ProtectedLayoutClient.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function ProtectedLayoutClient({
    children,
    scans
}: {
    children: ReactNode,
    scans: []
}) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loadingGuard, setLoadingGuard] = useState(true);

    useEffect(() => {
        const checkRole = async () => {
            try {
                console.log("ProtectedLayoutClient - Checking user role...");
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                console.log("User check response:", res.status, res.ok);

                if (!res.ok) {
                    console.error("User check failed with status", res.status, "redirecting to login");
                    router.replace("/login");
                    return;
                }

                const data = await res.json();
                console.log("User data:", data);
                
                if (data?.user?.role === "admin") {
                    console.log("Admin detected, redirecting to /admin");
                    router.replace("/admin");
                    return;
                }

                console.log("User authenticated successfully, setting loadingGuard to false");
                setLoadingGuard(false);
            } catch (error) {
                console.error("Error checking role:", error);
                router.replace("/login");
            }
        };

        checkRole();
    }, [router]);

    if (loadingGuard) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
                    <p className="text-sm font-semibold text-gray-600">Checking access...</p>
                </div>
            </div>
        );
    }

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