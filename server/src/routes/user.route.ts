import { Router } from "express"
import type { Request, Response } from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/user.middleware.js"
import User from "../models/user.model.js";
const userRouter = Router()

userRouter.get("/me", authMiddleware, async (req: Request, res: Response) => {

    try {

        // 1. Get userId from middleware
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // 2. Fetch user from DB (exclude password)
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 3. Send user data
        res.status(200).json({
            user
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

});

// Admin endpoint: list users by role (doctors, radiologists, patients)
userRouter.get(
    "/admin/users",
    authMiddleware,
    adminMiddleware,
    async (req: Request, res: Response) => {
        try {
            const role = String(req.query.role || "").toLowerCase();
            const validRoles = ["admin", "doctor", "radiologist", "patient"];

            // If no role specified (or role=all) fetch all roles
            const filterRoles =
                !role || role === "all"
                    ? validRoles
                    : validRoles.includes(role)
                    ? [role]
                    : [];

            if (role && role !== "all" && filterRoles.length === 0) {
                return res.status(400).json({
                    message: `Invalid role. Allowed values: all, ${validRoles.join(", ")}`
                });
            }

            const users = await User.find({ role: { $in: filterRoles } }).select("-password");

            return res.status(200).json({
                users
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }
);

export default userRouter