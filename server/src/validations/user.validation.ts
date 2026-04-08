import { z } from "zod";

export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(3, "Full name must be at least 3 characters")
        .max(100, "Full name must be at most 100 characters"),
    email: z
        .string()
        .trim()
        .email("Invalid email address"),
});
