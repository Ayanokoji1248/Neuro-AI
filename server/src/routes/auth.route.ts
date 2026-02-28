import { Router } from "express"
import { loginUser, logoutUser, registerUser, verifyOtp } from "../controllers/auth.controller.js";
const authRouter = Router()

authRouter.post('/register', registerUser)

authRouter.post('/login', loginUser)

authRouter.post('/verify-otp', verifyOtp) // step 2: verify + issue JWT

authRouter.post('/logout', logoutUser)

export default authRouter;
