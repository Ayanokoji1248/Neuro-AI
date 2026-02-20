import { z } from "zod";

export const uploadScanSchema = z.object({
    patientName: z
        .string()
        .min(1, "Patient name is required")
        .min(2, "Patient name must be at least 2 characters")
        .max(100, "Patient name must be less than 100 characters"),
    patientAge: z
        .string()
        .min(1, "Age is required")
        .refine((val) => !isNaN(Number(val)), "Age must be a number")
        .refine((val) => Number(val) >= 0 && Number(val) <= 150, "Age must be between 0 and 150"),
    patientGender: z.enum(["Male", "Female", "Other"], {
        message: "Please select a valid gender",
    }),
    imageUrl: z
        .instanceof(File, { message: "Please select an image file" })
        .refine((file) => file.size > 0, "Image file is required")
        .refine((file) => file.size <= 10 * 1024 * 1024, "Image must be less than 10MB")
        .refine(
            (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
            "Image must be JPEG or PNG"
        ),
});

export type UploadScanInput = z.infer<typeof uploadScanSchema>;
