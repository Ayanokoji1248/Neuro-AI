"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Grid,
    List,
    Calendar,
    Upload,
    ChevronRight,
} from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
    const router = useRouter();

    const [scans, setScans] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredFiles = useMemo(() => {
        return scans.filter((file) =>
            file.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [scans, searchQuery]);

    const openScan = (id) => {
        router.push(`/scan/${id}`);
    };

    const goToUpload = () => {
        router.push("/upload");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10">

            {/* Title */}
            <div className="flex items-center justify-between">

                <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                        Recent Scan Library
                    </h3>

                    <p className="text-slate-500 font-medium mt-1">
                        Reviewing {scans.length} diagnostic records
                    </p>
                </div>

                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                    <button className="p-2 bg-slate-100 text-indigo-600 rounded-lg">
                        <Grid className="w-4 h-4" />
                    </button>

                    <button className="p-2 text-slate-400 hover:text-slate-600">
                        <List className="w-4 h-4" />
                    </button>
                </div>

            </div>

            {/* Scan Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {filteredFiles.map((file) => (

                    <div
                        key={file.id}
                        onClick={() => openScan(file.id)}
                        className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer flex flex-col h-full"
                    >

                        <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">

                            <Image
                                src={file.previewUrl}
                                alt={file.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                            />

                            <div className="absolute top-4 left-4">

                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${file.status === "completed"
                                    ? file.result?.riskAssessment === "High"
                                        ? "bg-red-500 text-white"
                                        : file.result?.riskAssessment === "Moderate"
                                            ? "bg-yellow-500 text-white"
                                            : "bg-green-500 text-white"
                                    : "bg-indigo-500 text-white animate-pulse"
                                    }`}>
                                    {file.status === "completed"
                                        ? file.result?.riskAssessment
                                        : file.status}
                                </span>

                            </div>

                        </div>

                        <div className="p-5 flex-1 flex flex-col">

                            <h4 className="font-black text-slate-900 truncate mb-1 group-hover:text-indigo-600 transition-colors">
                                {file.name}
                            </h4>

                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />

                                {file.result
                                    ? new Date(file.result.timestamp).toLocaleDateString()
                                    : "Processing..."}
                            </p>

                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">

                                <div className="flex -space-x-1.5">

                                    <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                                        AI
                                    </div>

                                    <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
                                        {file.result ? "98%" : "..."}
                                    </div>

                                </div>

                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />

                            </div>

                        </div>

                    </div>

                ))}

                {/* Upload Card */}

                <div
                    onClick={goToUpload}
                    className="rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer group h-full min-h-[300px]"
                >

                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-slate-300 group-hover:text-indigo-500" />
                    </div>

                    <p className="font-black text-slate-400 group-hover:text-indigo-600">
                        Add New Scan
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                        DICOM, JPG, PNG
                    </p>

                </div>

            </div>

        </div>
    );
}
