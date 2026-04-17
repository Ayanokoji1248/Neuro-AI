import { z } from "zod";

const optionalUrlSchema = z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
        return undefined;
    }

    return value;
}, z.string().url().optional());

export const createReportSchema = z.object({
    patientName: z
        .string()
        .trim()
        .min(2, "Patient name must be at least 2 characters")
        .max(100, "Patient name must be less than 100 characters"),
    patientAge: z.coerce
        .number()
        .min(0, "Patient age must be at least 0")
        .max(150, "Patient age must be 150 or below"),
    patientGender: z.enum(["Male", "Female", "Other"]),
    imageUrl: z.string().url("A valid image URL is required"),
    overlayUrl: optionalUrlSchema,
    maskUrl: optionalUrlSchema,
    coloredMaskUrl: optionalUrlSchema,
    flairPreviewUrl: optionalUrlSchema,
});
