'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

const BRAIN_TUMOR_API_BASE_URL =
    process.env.BRAIN_TUMOR_API_BASE_URL ??
    process.env.NEXT_PUBLIC_BRAIN_TUMOR_API_BASE_URL ??
    'https://aryan1359-brain-tumor-api.hf.space'

const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY
const VIRUSTOTAL_MAX_DIRECT_UPLOAD_BYTES = 32 * 1024 * 1024
const VIRUSTOTAL_POLL_INTERVAL_MS = 5000
const VIRUSTOTAL_MAX_POLL_ATTEMPTS = 12

type BrainTumorPredictionResult = {
    imageUrl: string
    overlayUrl: string
    maskUrl?: string
    coloredMaskUrl?: string
    flairPreviewUrl?: string
}

type VirusTotalUploadResponse = {
    data?: {
        id?: string
    }
}

type VirusTotalAnalysisResponse = {
    data?: {
        attributes?: {
            status?: string
            stats?: {
                malicious?: number
                suspicious?: number
            }
        }
    }
}

type PredictionResponse = {
    status?: string
    files?: {
        mask?: string
        colored_mask?: string
        flair?: string
        overlay?: string
    }
    message?: string
}

function ensureFile(value: FormDataEntryValue | null, fieldName: string): File {
    if (!(value instanceof File) || value.size === 0) {
        throw new Error(`${fieldName} file is required`)
    }

    if (!/\.nii(\.gz)?$/i.test(value.name)) {
        throw new Error(`${fieldName} must be a .nii or .nii.gz file`)
    }

    return value
}

function toAbsoluteUrl(path?: string): string | undefined {
    if (!path) {
        return undefined
    }

    return new URL(path, BRAIN_TUMOR_API_BASE_URL).toString()
}

async function delay(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms))
}

async function getVirusTotalUploadEndpoint(file: File) {
    if (!VIRUSTOTAL_API_KEY) {
        throw new Error('VIRUSTOTAL_API_KEY is not configured')
    }

    if (file.size <= VIRUSTOTAL_MAX_DIRECT_UPLOAD_BYTES) {
        return 'https://www.virustotal.com/api/v3/files'
    }

    const response = await fetch('https://www.virustotal.com/api/v3/files/upload_url', {
        method: 'GET',
        headers: {
            'x-apikey': VIRUSTOTAL_API_KEY,
        },
        cache: 'no-store',
    })

    const data = await response.json() as { data?: string; error?: { message?: string } }

    if (!response.ok || !data.data) {
        throw new Error(data.error?.message ?? `Failed to get upload URL for ${file.name}`)
    }

    return data.data
}

async function scanFileWithVirusTotal(file: File) {
    if (!VIRUSTOTAL_API_KEY) {
        throw new Error('VIRUSTOTAL_API_KEY is not configured')
    }

    const uploadUrl = await getVirusTotalUploadEndpoint(file)
    const uploadFormData = new FormData()
    uploadFormData.append('file', file, file.name)

    const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'x-apikey': VIRUSTOTAL_API_KEY,
        },
        body: uploadFormData,
        cache: 'no-store',
    })

    const uploadData = await uploadResponse.json() as VirusTotalUploadResponse & { error?: { message?: string } }
    const analysisId = uploadData.data?.id

    if (!uploadResponse.ok || !analysisId) {
        throw new Error(uploadData.error?.message ?? `VirusTotal upload failed for ${file.name}`)
    }

    for (let attempt = 0; attempt < VIRUSTOTAL_MAX_POLL_ATTEMPTS; attempt += 1) {
        await delay(VIRUSTOTAL_POLL_INTERVAL_MS)

        const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
            method: 'GET',
            headers: {
                'x-apikey': VIRUSTOTAL_API_KEY,
            },
            cache: 'no-store',
        })

        const analysisData = await analysisResponse.json() as VirusTotalAnalysisResponse & { error?: { message?: string } }

        if (!analysisResponse.ok) {
            throw new Error(analysisData.error?.message ?? `VirusTotal analysis failed for ${file.name}`)
        }

        const status = analysisData.data?.attributes?.status

        if (status !== 'completed') {
            continue
        }

        const malicious = analysisData.data?.attributes?.stats?.malicious ?? 0
        const suspicious = analysisData.data?.attributes?.stats?.suspicious ?? 0

        if (malicious > 0 || suspicious > 0) {
            throw new Error(`VirusTotal flagged ${file.name} as unsafe`)
        }

        return
    }

    throw new Error(`VirusTotal scan timed out for ${file.name}`)
}

async function predictBrainTumor(files: {
    flairFile: File
    t1File: File
    t2File: File
    t1ceFile: File
}): Promise<BrainTumorPredictionResult> {
    const formData = new FormData()
    formData.append('flair', files.flairFile, files.flairFile.name)
    formData.append('t1', files.t1File, files.t1File.name)
    formData.append('t2', files.t2File, files.t2File.name)
    formData.append('t1ce', files.t1ceFile, files.t1ceFile.name)

    const response = await fetch(`${BRAIN_TUMOR_API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
        cache: 'no-store',
    })

    const data = await response.json() as PredictionResponse

    if (!response.ok || !data.files?.overlay) {
        throw new Error(data.message ?? 'Brain tumor analysis failed')
    }

    const overlayUrl = toAbsoluteUrl(data.files.overlay)

    if (!overlayUrl) {
        throw new Error('Brain tumor API did not return an overlay image')
    }

    return {
        imageUrl: overlayUrl,
        overlayUrl,
        maskUrl: toAbsoluteUrl(data.files.mask),
        coloredMaskUrl: toAbsoluteUrl(data.files.colored_mask),
        flairPreviewUrl: toAbsoluteUrl(data.files.flair),
    }
}

export async function uploadScan(formData: FormData) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    try {
        if (!token) {
            throw new Error('Unauthorized')
        }

        const patientName = String(formData.get('patientName') ?? '')
        const patientAge = String(formData.get('patientAge') ?? '')
        const patientGender = String(formData.get('patientGender') ?? '')
        const flairFile = ensureFile(formData.get('flairFile'), 'FLAIR')
        const t1File = ensureFile(formData.get('t1File'), 'T1')
        const t2File = ensureFile(formData.get('t2File'), 'T2')
        const t1ceFile = ensureFile(formData.get('t1ceFile'), 'T1CE')

        await scanFileWithVirusTotal(flairFile)
        await scanFileWithVirusTotal(t1File)
        await scanFileWithVirusTotal(t2File)
        await scanFileWithVirusTotal(t1ceFile)

        const prediction = await predictBrainTumor({
            flairFile,
            t1File,
            t2File,
            t1ceFile,
        })

        const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${backendUrl}/reports/create`, {
            method: 'POST',
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
            credentials: 'include',
            headers: {
                Cookie: `token=${token.value}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store',
        })

        if (!response.ok) {
            const error = await response.json() as { message?: string }
            throw new Error(error.message || 'Upload failed')
        }

        const data = await response.json()

        revalidatePath('/dashboard')

        return { success: true, data }
    } catch (error) {
        console.error('Upload error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed'
        }
    }
}
