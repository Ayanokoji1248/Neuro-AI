import { Calendar, ChevronDown, FileImage, Loader2, Upload, User, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { uploadScanSchema } from "../validations/scan";

const scanFileFields = [
    { name: "flairFile", label: "FLAIR MRI", description: "Required .nii or .nii.gz file" },
    { name: "t1File", label: "T1 MRI", description: "Required .nii or .nii.gz file" },
    { name: "t2File", label: "T2 MRI", description: "Required .nii or .nii.gz file" },
    { name: "t1ceFile", label: "T1CE MRI", description: "Required .nii or .nii.gz file" },
] as const;

type ScanFileFieldName = (typeof scanFileFields)[number]["name"];

type ScanFormState = {
    patientName: string;
    patientAge: string;
    patientGender: string;
    flairFile: File | null;
    t1File: File | null;
    t2File: File | null;
    t1ceFile: File | null;
};

const initialFormState: ScanFormState = {
    patientName: "",
    patientAge: "",
    patientGender: "",
    flairFile: null,
    t1File: null,
    t2File: null,
    t1ceFile: null,
};

const ModalForm = ({ setOpen }: {
    setOpen: (value: boolean) => void
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [fileInputResetKey, setFileInputResetKey] = useState(0);
    const [formData, setFormData] = useState<ScanFormState>(initialFormState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (fieldName: ScanFileFieldName) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0] ?? null;

        setFormData((prev) => ({
            ...prev,
            [fieldName]: file,
        }));

        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setErrors({});
        setFileInputResetKey((prev) => prev + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const result = uploadScanSchema.safeParse({
                patientName: formData.patientName,
                patientAge: formData.patientAge,
                patientGender: formData.patientGender,
                flairFile: formData.flairFile,
                t1File: formData.t1File,
                t2File: formData.t2File,
                t1ceFile: formData.t1ceFile,
            });

            if (!result.success) {
                const newErrors: Record<string, string> = {};

                result.error.issues.forEach((issue) => {
                    const path = issue.path[0] as string;
                    newErrors[path] = issue.message;
                });

                setErrors(newErrors);
                toast.error("Please fix the validation errors");
                return;
            }

            setIsLoading(true);
            const analysisToastId = toast.loading("Analyzing MRI on client (bypassing Vercel limits)...");
            
            try {
                // 1. Perform analysis directly from the browser to Hugging Face
                const BRAIN_TUMOR_API_BASE_URL = "https://aryan1359-brain-tumor-api.hf.space";
                
                const predictFormData = new FormData();
                predictFormData.append("flair", formData.flairFile!, formData.flairFile!.name);
                predictFormData.append("t1", formData.t1File!, formData.t1File!.name);
                predictFormData.append("t2", formData.t2File!, formData.t2File!.name);
                predictFormData.append("t1ce", formData.t1ceFile!, formData.t1ceFile!.name);

                const predictRes = await fetch(`${BRAIN_TUMOR_API_BASE_URL}/predict`, {
                    method: "POST",
                    body: predictFormData,
                });

                if (!predictRes.ok) {
                    const errData = await predictRes.json().catch(() => ({}));
                    throw new Error(errData.message || "Brain tumor analysis failed at Hugging Face");
                }

                const predictData = await predictRes.json();
                
                // Helper to construct absolute URLs from relative paths returned by HF
                const toAbsoluteUrl = (path?: string) => path ? new URL(path, BRAIN_TUMOR_API_BASE_URL).toString() : undefined;

                const prediction = {
                    imageUrl: toAbsoluteUrl(predictData.files?.overlay),
                    overlayUrl: toAbsoluteUrl(predictData.files?.overlay),
                    maskUrl: toAbsoluteUrl(predictData.files?.mask),
                    coloredMaskUrl: toAbsoluteUrl(predictData.files?.colored_mask),
                    flairPreviewUrl: toAbsoluteUrl(predictData.files?.flair),
                };

                if (!prediction.imageUrl) {
                    throw new Error("Analysis completed but no results were returned");
                }

                // 2. Send the results to our API as JSON (tiny payload, avoids 413 error)
                const saveRes = await fetch("/api/scan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        patientName: formData.patientName,
                        patientAge: formData.patientAge,
                        patientGender: formData.patientGender,
                        prediction
                    }),
                });

                const saveData = await saveRes.json();

                if (!saveRes.ok) {
                    throw new Error(saveData.error || saveData.message || "Failed to save scan results");
                }

                toast.success("Scan analyzed and saved successfully");
                setOpen(false);
                resetForm();
                router.refresh();
            } catch (error) {
                console.error("Client-side analysis error:", error);
                toast.error(error instanceof Error ? error.message : "Analysis failed");
            } finally {
                toast.dismiss(analysisToastId);
            }
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setOpen(false)}
            />

            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="relative bg-linear-to-br from-indigo-600 to-indigo-700 px-8 py-6">
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                            <Upload className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">
                                Upload MRI Scan
                            </h2>
                            <p className="mt-0.5 text-sm font-medium text-indigo-100">
                                Submit all 4 MRI modalities for tumor segmentation
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-8">
                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-700">
                            Patient Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                name="patientName"
                                required
                                value={formData.patientName}
                                onChange={handleChange}
                                placeholder="Enter patient name"
                                className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pr-4 pl-10 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 ${
                                    errors.patientName
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                                }`}
                            />
                        </div>
                        {errors.patientName && (
                            <p className="mt-1 text-xs text-red-500">{errors.patientName}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-700">
                                Age
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    name="patientAge"
                                    required
                                    value={formData.patientAge}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pr-4 pl-10 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 ${
                                        errors.patientAge
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                            : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                                    }`}
                                />
                            </div>
                            {errors.patientAge && (
                                <p className="mt-1 text-xs text-red-500">{errors.patientAge}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-700">
                                Gender
                            </label>
                            <div className="relative">
                                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <select
                                    name="patientGender"
                                    required
                                    value={formData.patientGender}
                                    onChange={handleChange}
                                    className={`w-full appearance-none rounded-xl border bg-slate-50/50 py-2.5 pr-10 pl-10 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 ${
                                        errors.patientGender
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                            : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                                    }`}
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            </div>
                            {errors.patientGender && (
                                <p className="mt-1 text-xs text-red-500">{errors.patientGender}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {scanFileFields.map((field) => (
                            <div key={field.name}>
                                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-700">
                                    {field.label}
                                </label>

                                <label
                                    htmlFor={field.name}
                                    className={`group block cursor-pointer rounded-xl border-2 border-dashed bg-slate-50/50 px-4 py-6 transition-colors ${
                                        errors[field.name]
                                            ? "border-red-400 hover:border-red-300 hover:bg-red-50/20"
                                            : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30"
                                    }`}
                                >
                                    <input
                                        key={`${field.name}-${fileInputResetKey}`}
                                        id={field.name}
                                        type="file"
                                        accept=".nii,.nii.gz,application/gzip"
                                        onChange={handleFileChange(field.name)}
                                        className="hidden"
                                    />

                                    <div className={`flex flex-col items-center justify-center text-center transition-colors ${
                                        errors[field.name]
                                            ? "text-red-500 group-hover:text-red-600"
                                            : "text-slate-400 group-hover:text-indigo-500"
                                    }`}>
                                        <FileImage className="mb-2 h-7 w-7" />
                                        {formData[field.name] ? (
                                            <>
                                                <p className="max-w-full truncate text-sm font-bold text-slate-700">
                                                    {formData[field.name]?.name}
                                                </p>
                                                <p className="mt-1 text-[11px] text-slate-500">
                                                    Click to replace file
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-xs font-semibold">Choose file</p>
                                                <p className="mt-1 text-[11px] text-slate-400">
                                                    {field.description}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </label>

                                {errors[field.name] && (
                                    <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-xl hover:shadow-indigo-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4" />
                                Analyze And Save Scan
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalForm;
