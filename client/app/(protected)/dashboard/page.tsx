import { Scan } from "@/app/interface";
import { getScans } from "@/app/lib/getScans";
import {
    Calendar,
    Upload,
    ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {

    const scans = await getScans();

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
            </div>

            {/* Scan Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {scans.map((file: Scan) => (
                    <Link key={file._id}
                        href={`/scan/${file._id}`}>
                        <div
                            key={file._id}
                            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer flex flex-col h-full"
                        >
                            <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                                <Image
                                    fill
                                    src={file.overlayUrl ?? file.imageUrl}
                                    alt={`MRI scan of ${file.patientName}`}
                                    className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                />

                                <div className="absolute top-4 left-4">
                                    <span className="rounded-full bg-slate-950/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                                        Generated
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h4 className="font-black text-slate-900 truncate mb-1 group-hover:text-indigo-600 transition-colors">
                                    {file.patientName}
                                </h4>

                                <div className="space-y-1 mb-4">
                                    <p className="text-xs text-slate-500 font-medium">
                                        Age: <span className="font-bold text-slate-700">{file.patientAge}</span>
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Gender: <span className="font-bold text-slate-700">{file.patientGender}</span>
                                    </p>
                                </div>

                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4 flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(file.createdAt).toLocaleDateString()}
                                </p>

                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                        View Outputs
                                    </p>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {scans.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Upload className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-lg font-bold text-slate-400">
                            No Scans Yet
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                            Upload your first MRI scan to get started
                        </p>
                    </div>
                )}
            </div>
        </div >
    );
}
