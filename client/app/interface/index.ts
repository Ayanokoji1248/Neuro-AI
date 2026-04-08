export interface Scan {
    _id: string,
    imageUrl: string,
    result: string,
    patientName: string,
    patientAge: number,
    patientGender: string
    confidence: number
    createdAt: string
}

export interface UserProfile {
    fullName: string,
    email: string,
    role: string
}
