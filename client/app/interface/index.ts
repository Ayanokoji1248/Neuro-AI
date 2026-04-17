export interface Scan {
    _id: string,
    imageUrl: string,
    overlayUrl?: string,
    maskUrl?: string,
    coloredMaskUrl?: string,
    flairPreviewUrl?: string,
    result: string,
    patientName: string,
    patientAge: number,
    patientGender: string
    confidence: number | null
    createdAt: string
}

export interface UserProfile {
    fullName: string,
    email: string,
    role: string
}
