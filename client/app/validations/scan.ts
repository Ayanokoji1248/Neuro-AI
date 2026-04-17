import { z } from "zod";

const niftiFileSchema = z
    .instanceof(File, { message: "Please select a file" })
    .refine((file) => file.size > 0, "File is required")
    .refine(
        (file) => /\.nii(\.gz)?$/i.test(file.name),
        "File must be in .nii or .nii.gz format"
    );

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
    flairFile: niftiFileSchema,
    t1File: niftiFileSchema,
    t2File: niftiFileSchema,
    t1ceFile: niftiFileSchema,
});

export type UploadScanInput = z.infer<typeof uploadScanSchema>;
