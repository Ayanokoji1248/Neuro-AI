import { cookies } from "next/headers";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Calendar, FileImage, UserRound } from "lucide-react";
import type { Scan } from "@/app/interface";
import ScanDebugLogger from "@/app/components/ScanDebugLogger";

async function getScan(id: string): Promise<Scan> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
        redirect("/login");
    }

    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${backendUrl}/reports/${id}`, {
        method: "GET",
        headers: {
            Cookie: `token=${token.value}`,
        },
        cache: "no-store",
    });

    if (response.status === 404) {
        notFound();
    }

    if (!response.ok) {
        throw new Error("Failed to load scan report");
    }

    const data = await response.json() as { report: Scan };
    return data.report;
}

const previewCards = [
    { key: "overlayUrl", label: "Overlay" },
    { key: "maskUrl", label: "Mask" },
    { key: "coloredMaskUrl", label: "Colored Mask" },
    { key: "flairPreviewUrl", label: "Flair Preview" },
] as const;

export default async function ScanPage({ params }:
    {
        params: Promise<{ id: string }>
    }) {
    const { id } = await params;
    const scan = await getScan(id);
    const primaryImage = scan.overlayUrl ?? scan.imageUrl;

    return (
        <div className="mx-auto max-w-7xl px-4 pt-0 space-y-10">
            <ScanDebugLogger scan={scan} />

            {/* Header Section */}
            <section className="rounded-2xl border border-slate-200 p-6 shadow-lg">
                <div className="flex flex-col gap-6 md:flex-row items-center justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">
                            🔬 Scan Analysis Report
                        </p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
                            {scan.patientName}
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                            Detailed segmentation analysis report with generated MRI overlays and tissue masks
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-white border-2 border-indigo-200 px-6 py-3 shadow-md">
                        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-black uppercase tracking-[0.15em] text-indigo-700">Analysis Complete</span>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[1.8fr_1fr]">
                {/* Primary Overlay */}
                <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4">
                        <h2 className="text-base font-black text-slate-900">Primary Overlay</h2>
                        <p className="mt-1 text-xs text-slate-500">Main segmentation result</p>
                    </div>

                    <div className="relative flex-1 min-h-[450px] w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center p-8 group">
                        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Image
                            fill
                            unoptimized
                            src={primaryImage}
                            alt={`Tumor overlay for ${scan.patientName}`}
                            className="object-cover drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 900px"
                            priority
                        />
                    </div>
                </section>

                {/* Metadata Sidebar */}
                <aside className="flex flex-col space-y-6">
                    {/* Patient Info */}
                    <section className="flex flex-col flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                            <h2 className="text-base font-black text-white">Patient Info</h2>
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between space-y-5">
                            <div className="space-y-5">
                                <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                                    <div className="rounded-lg bg-indigo-100 p-2.5">
                                        <UserRound className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase">Name</p>
                                        <p className="mt-1 font-black text-slate-900">{scan.patientName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                                    <div className="rounded-lg bg-indigo-100 p-2.5">
                                        <UserRound className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase">Gender</p>
                                        <p className="mt-1 font-black text-slate-900">{scan.patientGender}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                                    <div className="rounded-lg bg-indigo-100 p-2.5">
                                        <Calendar className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase">Age</p>
                                        <p className="mt-1 font-black text-slate-900">{scan.patientAge} years</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="rounded-lg bg-indigo-100 p-2.5">
                                        <FileImage className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase">Scan Date</p>
                                        <p className="mt-1 font-black text-slate-900 text-sm">{new Date(scan.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-auto pt-6 border-t border-slate-100">
                                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">System Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <p className="text-xs font-bold text-slate-700">Verified by NeuroAI v2.4</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </aside>

            </div>

            {/* Generated Images Gallery */}
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900">Generated Segmentation Images</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Complete analysis results from the AI segmentation pipeline
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {previewCards.map((card) => {
                        const imageUrl = scan[card.key];

                        return (
                            <div key={card.key} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                                <div className="relative w-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center overflow-hidden" style={{ height: '280px' }}>
                                    {imageUrl ? (
                                        <>
                                            <Image
                                                fill
                                                unoptimized
                                                src={imageUrl}
                                                alt={`${card.label} for ${scan.patientName}`}
                                                className="object-cover p-4 group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 280px"
                                            />
                                        </>
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                                            <p className="text-2xl">⚠️</p>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Not Available
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-gradient-to-r from-slate-50 to-white px-5 py-4 border-t border-slate-100">
                                    <p className="font-black text-slate-900 text-sm">{card.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
