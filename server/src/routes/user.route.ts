import { Router } from "express"
import type { Request, Response } from "express";
import { authMiddleware } from "../middlewares/user.middleware.js"
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

export default userRouter