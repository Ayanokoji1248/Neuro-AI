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

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/${id}`, {
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
        <div className="mx-auto max-w-7xl px-4 py-8 space-y-10">
            <ScanDebugLogger scan={scan} />
            
            {/* Header Section */}
            <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-8 shadow-lg">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
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
            <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
                {/* Primary Overlay */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4">
                        <h2 className="text-base font-black text-slate-900">Primary Overlay</h2>
                        <p className="mt-1 text-xs text-slate-500">Main segmentation result</p>
                    </div>

                    <div className="relative w-full bg-slate-950 flex items-center justify-center p-6" style={{ height: '450px' }}>
                        <Image
                            fill
                            src={primaryImage}
                            alt={`Tumor overlay for ${scan.patientName}`}
                            className="object-contain p-4"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 900px"
                            priority
                        />
                    </div>
                </section>

                {/* Metadata Sidebar */}
                <aside className="space-y-6">
                    {/* Patient Info */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                            <h2 className="text-base font-black text-white">Patient Info</h2>
                        </div>
                        <div className="p-6 space-y-5">
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
                                <div className="relative w-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center overflow-hidden" style={{ height: '320px' }}>
                                    {imageUrl ? (
                                        <>
                                            <Image
                                                fill
                                                src={imageUrl}
                                                alt={`${card.label} for ${scan.patientName}`}
                                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
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
                                    <p className="text-xs text-slate-500 mt-1">
                                        {imageUrl ? '✓ Available' : 'Not generated'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
