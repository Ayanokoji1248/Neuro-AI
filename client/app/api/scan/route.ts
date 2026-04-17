import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BRAIN_TUMOR_API_BASE_URL =
    process.env.BRAIN_TUMOR_API_BASE_URL ??
    process.env.NEXT_PUBLIC_BRAIN_TUMOR_API_BASE_URL ??
    "https://aryan1359-brain-tumor-api.hf.space";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
type BrainTumorPredictionResult = {
    imageUrl: string;
    overlayUrl: string;
    maskUrl?: string;
    coloredMaskUrl?: string;
    flairPreviewUrl?: string;
};

type PredictionResponse = {
    status?: string;
    files?: {
        mask?: string;
        colored_mask?: string;
        flair?: string;
        overlay?: string;
    };
    message?: string;
};

function ensureFile(value: FormDataEntryValue | null, fieldName: string): File {
    if (!(value instanceof File) || value.size === 0) {
        throw new Error(`${fieldName} file is required`);
    }

    if (!/\.nii(\.gz)?$/i.test(value.name)) {
        throw new Error(`${fieldName} must be a .nii or .nii.gz file`);
    }

    return value;
}

function toAbsoluteUrl(path?: string): string | undefined {
    if (!path) {
        return undefined;
    }

    return new URL(path, BRAIN_TUMOR_API_BASE_URL).toString();
}

async function delay(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

async function predictBrainTumor(files: {
    flairFile: File;
    t1File: File;
    t2File: File;
    t1ceFile: File;
}): Promise<BrainTumorPredictionResult> {
    const formData = new FormData();
    formData.append("flair", files.flairFile, files.flairFile.name);
    formData.append("t1", files.t1File, files.t1File.name);
    formData.append("t2", files.t2File, files.t2File.name);
    formData.append("t1ce", files.t1ceFile, files.t1ceFile.name);

    const response = await fetch(`${BRAIN_TUMOR_API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
        cache: "no-store",
    });

    const data = await response.json() as PredictionResponse;

    console.log("Raw API Response from Brain Tumor API:", data);

    if (!response.ok || !data.files?.overlay) {
        throw new Error(data.message ?? "Brain tumor analysis failed");
    }

    const overlayUrl = toAbsoluteUrl(data.files.overlay);

    if (!overlayUrl) {
        throw new Error("Brain tumor API did not return an overlay image");
    }

    const result = {
        imageUrl: overlayUrl,
        overlayUrl,
        maskUrl: toAbsoluteUrl(data.files.mask),
        coloredMaskUrl: toAbsoluteUrl(data.files.colored_mask),
        flairPreviewUrl: toAbsoluteUrl(data.files.flair),
    };

    console.log("Processed URLs:", result);
    
    return result;
}

export async function POST(request: NextRequest) {
    try {
        if (!BACKEND_URL) {
            return NextResponse.json(
                { error: "NEXT_PUBLIC_BACKEND_URL is not configured" },
                { status: 500 }
            );
        }

        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const patientName = String(formData.get("patientName") ?? "");
        const patientAge = String(formData.get("patientAge") ?? "");
        const patientGender = String(formData.get("patientGender") ?? "");
        const flairFile = ensureFile(formData.get("flairFile"), "FLAIR");
        const t1File = ensureFile(formData.get("t1File"), "T1");
        const t2File = ensureFile(formData.get("t2File"), "T2");
        const t1ceFile = ensureFile(formData.get("t1ceFile"), "T1CE");

        const prediction = await predictBrainTumor({
            flairFile,
            t1File,
            t2File,
            t1ceFile,
        });

        console.log("Brain Tumor Prediction Result:", {
            imageUrl: prediction.imageUrl,
            overlayUrl: prediction.overlayUrl,
            maskUrl: prediction.maskUrl,
            coloredMaskUrl: prediction.coloredMaskUrl,
            flairPreviewUrl: prediction.flairPreviewUrl,
        });

        const backendResponse = await fetch(`${BACKEND_URL}/reports/create`, {
            method: "POST",
            body: JSON.stringify({
                patientName,
                patientAge,
                patientGender,
                imageUrl: prediction.imageUrl,
                overlayUrl: prediction.overlayUrl,
                maskUrl: prediction.maskUrl,
                coloredMaskUrl: prediction.coloredMaskUrl,
                flairPreviewUrl: prediction.flairPreviewUrl,
            }),
            headers: {
                Cookie: `token=${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        const data = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json(
                { error: data.message ?? "Failed to save scan" },
                { status: backendResponse.status }
            );
        }

        revalidatePath("/dashboard");
        revalidatePath(`/scan/${data.report?._id ?? ""}`);

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Scan upload error:", error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Upload failed",
            },
            { status: 500 }
        );
    }
}
