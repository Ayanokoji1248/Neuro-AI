// components/Sidebar.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Brain, Grid, LogOut, X } from "lucide-react";
import { toast } from "sonner";
import { Scan } from "../interface";
import { useEffect, useState } from "react";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    scans: []
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, scans }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    // const [scans, setScans] = useState([]);
    const [user, setUser] = useState()

    const isDashboard = pathname === "/dashboard";

    // const goToScan = (id: string) => {
    //     router.push(`/scan/${id}`);
    //     setSidebarOpen(false);
    // };

    const getUser = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
                method: "GET",
                credentials: "include"
            })

            if (!res.ok) {
                throw new Error("Failed to get Authorized User")
            }
            const userRes = await res.json()
            // console.log(userRes.user.fullName)
            setUser(userRes.user.fullName)
            // router.refresh()

        } catch (error) {
            console.log(error)

        }
    }

    useEffect(() => {
        getUser()
    }, [])

    const logout = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
                method: "POST",
                credentials: "include"
            })

            if (!res.ok) {
                throw new Error("Logged Out failed")
            }

            router.replace('/login')
            // router.refresh()

        } catch (error) {
            console.log(error)
            toast.error("Logged Out failed")
        }

    }

    const getInitial = (username: string) => {
        return username.split(" ").map(u => u[0]).join("")
    }

    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static top-0 left-0 h-full w-72
                    bg-white border-r border-slate-200 flex flex-col
                    shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
            >
                <div className="p-8 pb-6 flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="flex items-center space-x-3 group cursor-pointer"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 transition-transform hover:scale-105">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight">
                            NeuroScan<span className="text-indigo-600">AI</span>
                        </span>
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <p className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Main Menu
                    </p>

                    <Link
                        href="/dashboard"
                        onClick={() => setSidebarOpen(false)}
                        className={`
                            w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all
                            ${isDashboard
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-500 hover:bg-slate-50"
                            }
                        `}
                    >
                        <Grid className="w-5 h-5" />
                        <span>Scans Library</span>
                    </Link>

                    <div className="mt-8">
                        <p className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Recents
                        </p>
                        <div className=" max-h-75 flex flex-col">
                            {scans.slice(0, 5).map((file: Scan) => (
                                <Link
                                    href={`/scan/${file._id}`}
                                    key={file._id}
                                    className={`
        group relative flex items-center gap-3
        w-full px-4 py-3 rounded-xl
        transition-all duration-200 ease-out
        border border-transparent

        ${pathname === `/scan/${file._id}`
                                            ? `
                bg-linear-to-r from-indigo-50 to-indigo-100/60
                text-indigo-700
                font-semibold
                border-indigo-200
                shadow-sm
              `
                                            : `
                text-slate-600
                hover:text-indigo-600
                hover:bg-indigo-50/60
                hover:border-indigo-100
              `
                                        }
    `}
                                >
                                    {/* Left indicator */}
                                    <div
                                        className={`
            w-2 h-2 rounded-full transition-all
            ${pathname === `/scan/${file._id}`
                                                ? "bg-indigo-600 scale-110"
                                                : "bg-slate-300 group-hover:bg-indigo-400"
                                            }
        `}
                                    />

                                    {/* Text */}
                                    <span className="truncate flex-1">
                                        {file.patientName}
                                    </span>

                                    {/* Hover arrow */}
                                    <svg
                                        className={`
                                                w-4 h-4 transition-all
                                                ${pathname === `/scan/${file._id}`
                                                ? "text-indigo-600 opacity-100"
                                                : "text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                                            }
        `}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M9 5l7 7-7 7" />
                                    </svg>

                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>


                {/* User info and logout button */}
                <div className="p-6 mt-auto border-t border-slate-100">
                    <div className="flex items-center space-x-3 mb-6 p-2 rounded-xl bg-slate-50">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-black uppercase">
                            {user && getInitial(user)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-black text-slate-900 truncate leading-none mb-1 capitalize">
                                {user}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center space-x-2 text-slate-400 py-2 font-bold hover:text-red-500 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}