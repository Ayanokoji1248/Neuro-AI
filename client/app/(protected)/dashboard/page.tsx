import {
    Calendar,
    Upload,
    ChevronRight,
} from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {

    const cookieStore = await cookies()
    const token = cookieStore.get("token")

    const scanRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/my`, {
        method: "GET",
        headers: {
            Cookie: `token=${token?.value}`
        },
        cache: "no-store"
    })

    const scans = (await scanRes.json()).reports;

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

                {scans.map((file: any) => (
                    <Link key={file._id}
                        href={`/scan/${file._id}`}>
                        <div
                            key={file._id}
                            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer flex flex-col h-full"
                        >
                            <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                                {/* Placeholder image since imageUrl is "tempfileURL" */}
                                <Image
                                    src={file.imageUrl !== "tempfileURL" ? file.imageUrl : "/placeholder-mri.jpg"}
                                    alt={`MRI scan of ${file.patientName}`}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                />

                                <div className="absolute top-4 left-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${file.result === "Pending"
                                        ? "bg-yellow-500 text-white animate-pulse"
                                        : file.result === "High Risk"
                                            ? "bg-red-500 text-white"
                                            : file.result === "Moderate Risk"
                                                ? "bg-yellow-500 text-white"
                                                : "bg-green-500 text-white"
                                        }`}>
                                        {file.result}
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
                                    <div className="flex -space-x-1.5">
                                        <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                                            AI
                                        </div>
                                        <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
                                            {file.confidence ? `${file.confidence}%` : "N/A"}
                                        </div>
                                    </div>

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