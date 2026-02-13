"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import {
    Brain,
    LogOut,
    Grid,
    ArrowLeft,
    Search,
    Upload,
    Menu,
    X,
} from "lucide-react";
import ModalForm from "../components/ModalForm";

export default function ProtectedLayout({
    children,
}: {
    children: ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const [scans, setScans] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fetch scans
    // useEffect(() => {
    //     async function fetchScans() {
    //         try {
    //             const res = await fetch("/api/scans");
    //             const data = await res.json();
    //             setScans(data);
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }

    //     fetchScans();
    // }, []);

    const logout = () => {
        router.push("/login");
    };

    const goToScan = (id: string) => {
        router.push(`/scan/${id}`);
        setSidebarOpen(false);
    };

    const isDashboard = pathname === "/dashboard";

    const [open, setOpen] = useState(false);


    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-[#1E293B]">

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

                {/* Logo */}
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

                    {/* Close button mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2"
                    >
                        <X className="w-6 h-6" />
                    </button>

                </div>

                {/* Navigation */}
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

                    {/* Recents */}
                    <div className="mt-8">

                        <p className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Recents
                        </p>

                        <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">

                            {scans.slice(0, 5).map((file: any) => (

                                <button
                                    key={file.id}
                                    onClick={() => goToScan(file.id)}
                                    className={`
                    w-full text-left px-4 py-2 text-sm rounded-lg transition-all truncate
                    ${pathname === `/scan/${file.id}`
                                            ? "text-indigo-600 font-bold bg-indigo-50/50"
                                            : "text-slate-600 hover:text-indigo-500"
                                        }
                  `}
                                >
                                    {file.name}
                                </button>

                            ))}

                        </div>

                    </div>

                </nav>

                {/* User */}
                <div className="p-6 mt-auto border-t border-slate-100">

                    <div className="flex items-center space-x-3 mb-6 p-2 rounded-xl bg-slate-50">

                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-black">
                            KR
                        </div>

                        <div className="overflow-hidden">

                            <p className="text-sm font-black text-slate-900 truncate leading-none mb-1">
                                Krish
                            </p>

                            <p className="text-[10px] font-bold text-slate-400 uppercase truncate tracking-wider">
                                Neurologist
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

            {/* Main */}
            <main className="flex-1 flex flex-col overflow-hidden relative">

                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-10 flex items-center justify-between z-20">

                    <div className="flex items-center space-x-4">

                        {/* Burger */}
                        <button
                            onClick={() => setSidebarOpen(true)}
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

                        {/* Search desktop only */}
                        {isDashboard && (
                            <div className="relative w-40 lg:w-64 hidden sm:block">

                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                                <input
                                    type="text"
                                    placeholder="Search scans..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />

                            </div>
                        )}

                        <button
                            onClick={() => setOpen(true)}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-black text-xs lg:text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                        >
                            <Upload className="w-4 h-4" />
                            <span className="hidden sm:inline">NEW SCAN</span>
                        </button>


                        {/* <button
                            onClick={goToUpload}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-black text-xs lg:text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                        >
                            <Upload className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                NEW SCAN
                            </span>
                        </button> */}

                    </div>

                </header>

                {open &&
                    <ModalForm open={open} setOpen={setOpen} />
                }



                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar bg-[#F8FAFC]">
                    {children}
                </div>

            </main>

        </div>
    );
}
