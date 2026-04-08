import { Router } from "express"
import { authMiddleware, adminMiddleware } from "../middlewares/user.middleware.js"
import { getAdminDashboard, getAdminUsers, getMe, updateProfile } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.get("/me", authMiddleware, getMe)
userRouter.put("/me", authMiddleware, updateProfile)

userRouter.get(
    "/admin/dashboard",
    authMiddleware,
    adminMiddleware,
    getAdminDashboard
);

userRouter.get(
    "/admin/users",
    authMiddleware,
    adminMiddleware,
    getAdminUsers
);

export default userRouter
