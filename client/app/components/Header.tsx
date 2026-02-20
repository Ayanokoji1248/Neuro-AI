// components/Header.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Upload, Menu } from "lucide-react";
import ModalForm from "./ModalForm";

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);

    const isDashboard = pathname === "/dashboard";

    return (
        <>
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-10 flex items-center justify-between z-20">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {!isDashboard && (
                        <Link
                            href="/dashboard"
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    )}

                    <h2 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight">
                        {isDashboard ? "Patient Records" : "Detailed Report"}
                    </h2>
                </div>

                <div className="flex items-center space-x-3 lg:space-x-6">
                    {/* {isDashboard && (
                        <div className="relative w-40 lg:w-64 hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search scans..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )} */}

                    <button
                        onClick={() => setOpen(true)}
                        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-black text-xs lg:text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">NEW SCAN</span>
                    </button>
                </div>
            </header>

            {open && <ModalForm setOpen={setOpen} />}
        </>
    );
}