// app/scan/[id]/page.tsx
import Link from "next/link";
import {
    Activity,
    AlertTriangle,
    Clock,
    FileText,
    Shield,
    AlertCircle,
    AlignLeft,
    Copy,
    ListChecks,
    Share2,
    ScanLine,
} from "lucide-react";

interface ScanResult {
    summary: string;
    observations: string[];
    riskAssessment: "Low" | "Moderate" | "High";
    timestamp: string;
    disclaimer: string;
    confidence?: number;
}

interface Scan {
    id: string;
    name: string;
    previewUrl: string;
    status: "pending" | "analyzing" | "completed" | "failed";
    result?: ScanResult;
    uploadDate?: string;
}

// Mock data for development
function getScan(id: string): Scan {
    // You can create different mock scans based on ID if needed
    const mockScans: Record<string, Scan> = {
        "1": {
            id: "1",
            name: "Brain_MRI_Patient_2024_001",
            previewUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=800&fit=crop",
            status: "completed",
            uploadDate: "2024-02-15T10:30:00Z",
            result: {
                summary: "The MRI scan reveals normal brain anatomy with no significant abnormalities detected. White matter appears healthy with appropriate signal intensity. Ventricular system shows normal size and configuration. No evidence of mass lesions, hemorrhage, or acute infarction.",
                observations: [
                    "Gray matter and white matter differentiation is well-preserved throughout both cerebral hemispheres",
                    "Ventricular system demonstrates normal size and symmetry with no signs of hydrocephalus or obstruction",
                    "No abnormal signal intensities or space-occupying lesions identified in any brain region",
                    "Cerebral cortex shows normal thickness and sulcal patterns without evidence of atrophy",
                    "Basal ganglia and thalami appear symmetric with normal signal characteristics",
                    "No evidence of acute or chronic hemorrhage, edema, or mass effect"
                ],
                riskAssessment: "Low",
                timestamp: "2024-02-15T10:45:23Z",
                confidence: 98.42,
                disclaimer: "This AI-generated analysis is for informational purposes only and should not replace professional medical diagnosis. Always consult with a qualified healthcare provider for medical advice and treatment decisions."
            }
        },
        "2": {
            id: "2",
            name: "Brain_CT_Emergency_2024_042",
            previewUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=800&fit=crop",
            status: "completed",
            uploadDate: "2024-02-14T15:20:00Z",
            result: {
                summary: "CT scan shows moderate periventricular white matter changes consistent with chronic small vessel disease. Mild generalized cerebral atrophy noted. Ventricular enlargement present but proportionate to sulcal prominence. No acute intracranial pathology identified.",
                observations: [
                    "Bilateral periventricular white matter hypodensities suggesting chronic ischemic changes",
                    "Mild to moderate generalized cortical atrophy with widening of sulci",
                    "Ventricular system is mildly enlarged, consistent with age-related changes",
                    "No evidence of acute hemorrhage, infarction, or mass lesions",
                    "Cerebellum and brainstem appear normal without focal abnormalities",
                    "Mild atherosclerotic calcification noted in the cavernous carotid arteries bilaterally"
                ],
                riskAssessment: "Moderate",
                timestamp: "2024-02-14T15:35:12Z",
                confidence: 96.18,
                disclaimer: "This AI-generated analysis is for informational purposes only and should not replace professional medical diagnosis. Always consult with a qualified healthcare provider for medical advice and treatment decisions."
            }
        },
        "3": {
            id: "3",
            name: "Brain_MRI_Followup_2024_089",
            previewUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=800&fit=crop",
            status: "analyzing",
            uploadDate: "2024-02-15T14:00:00Z"
        }
    };

    // Return the specific scan or default to scan "1"
    return mockScans[id] || mockScans["1"];
}

export default function ScanPage({ params }: { params: { id: string } }) {
    const scan = getScan(params.id);

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case "Low":
                return "from-emerald-500 to-green-500";
            case "Moderate":
                return "from-amber-500 to-orange-500";
            case "High":
                return "from-red-500 to-rose-500";
            default:
                return "from-slate-500 to-gray-500";
        }
    };

    return (

        <>
            {/* Right Column - Report Details */}
            <div className="lg:col-span-2 space-y-6">

                {/* Risk Assessment Card (Kept separate at top for quick visibility) */}
                {scan.status === "completed" && scan.result && (
                    <div className={`relative bg-gradient-to-br ${getRiskColor(scan.result.riskAssessment)} p-6 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden group hover:shadow-xl transition-all duration-300`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 shadow-inner">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/90 text-xs font-bold uppercase tracking-wider mb-0.5">
                                            Risk Assessment
                                        </p>
                                        <p className="text-white text-2xl font-black tracking-tight">
                                            {scan.result.riskAssessment}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/10 backdrop-blur-sm rounded-full border border-white/10">
                                        <Clock className="w-3.5 h-3.5 text-white/80" />
                                        <span className="text-white text-xs font-medium">
                                            {new Date(scan.result.timestamp).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Diagnostic Report Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden">

                    {/* Card Header with Actions */}
                    <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">
                                Diagnostic Report
                            </h3>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                <Copy className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {!scan.result ? (
                        /* Loading State */
                        <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                                <div className="relative w-16 h-16 bg-white border border-slate-100 shadow-lg rounded-full flex items-center justify-center">
                                    <Activity className="w-8 h-8 text-indigo-500 animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-900 font-bold text-lg mb-2">
                                    Analyzing Scan Data
                                </p>
                                <p className="text-slate-500 text-sm max-w-[200px] mx-auto leading-relaxed">
                                    Our AI is processing the imaging data. This usually takes less than a minute.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* --- NEW IMAGE BANNER START --- */}
                            <div className="relative w-full h-[320px] bg-slate-900 group overflow-hidden">

                                {/* Background Scan Image */}
                                <img
                                    src={scan.previewUrl}
                                    alt="Scan Reference"
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 object-center object-cover"
                                />

                                {/* Grid Overlay Effect */}
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                                {/* Gradient Fade to White at Bottom */}
                                {/* <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" /> */}

                                {/* Badge Overlay */}
                                <div className="absolute bottom-4 left-6 flex items-center gap-2">
                                    <div className="bg-indigo-600/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                                        <ScanLine className="w-3 h-3" />
                                        Analyzed Region
                                    </div>
                                </div>
                            </div>
                            {/* --- NEW IMAGE BANNER END --- */}

                            <div className="p-6 lg:p-8 pt-4 space-y-8">
                                {/* Clinical Summary */}
                                <div className="group">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <AlignLeft className="w-4 h-4" />
                                        Clinical Summary
                                    </h4>
                                    <div className="relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-100 group-hover:bg-indigo-500 transition-colors duration-300 rounded-full" />
                                        <p className="pl-4 text-base text-slate-600 leading-relaxed">
                                            {scan.result.summary}
                                        </p>
                                    </div>
                                </div>

                                {/* Observations / Key Findings */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <ListChecks className="w-4 h-4" />
                                        Key Findings
                                    </h4>
                                    <div className="grid gap-3">
                                        {scan.result.observations.map((obs, idx) => (
                                            <div
                                                key={idx}
                                                className="flex gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all duration-300 group cursor-default"
                                            >
                                                <div className="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-sm font-medium text-slate-600 leading-relaxed group-hover:text-slate-900">
                                                    {obs}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Disclaimer */}
                                <div className="pt-6 border-t border-slate-100">
                                    <div className="flex gap-3 text-slate-500 bg-amber-50/50 p-4 rounded-lg border border-amber-100">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                                                AI Disclaimer
                                            </p>
                                            <p className="text-xs leading-5 text-amber-800/70">
                                                {scan.result.disclaimer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>

    );
}