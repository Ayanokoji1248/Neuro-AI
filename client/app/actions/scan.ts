// app/actions/scan.ts
'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function uploadScan(formData: FormData) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token");

    // console.log(formData)
    try {
        // Send to your backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/create`, {
            method: 'POST',
            body: JSON.stringify({
                patientName: formData.get("patientName"),
                patientAge: formData.get("patientAge"),
                patientGender: formData.get("patientGender"),
                imageUrl: formData.get("imageUrl"),
            }),
            credentials: 'include', // Include cookies for auth
            headers: {
                Cookie: `token=${token?.value}`,
                "Content-Type": "application/json"
            }
        })

        // console.log(response)

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Upload failed')
        }

        const data = await response.json()

        // Revalidate the dashboard page to show new scan
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