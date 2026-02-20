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