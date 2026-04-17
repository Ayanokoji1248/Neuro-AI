import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { generateOTP } from "../utils/generateOtp.js";
import { redisClient } from "../config/redis.js";
import { sendOtpEmail } from "../utils/mailer.js";

export const registerUser = async (req: Request, res: Response) => {

    try {

        // 1. Validate using Zod
        const result = registerSchema.safeParse(req.body);

        if (!result.success) {

            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.flatten().fieldErrors
            });

        }

        const { fullName, email, password, role } = result.data;

        // 2. Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(409).json({
                message: "User already exists"
            });

        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create user
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role
        });

        // At registration we don't persist the user yet; instead store
        // their info temporarily and perform OTP verification later.
        const loginSessionId = crypto.randomUUID();
        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);

        // store OTP and link to session
        await redisClient.set(`otp:login:${loginSessionId}`, hashedOtp, { EX: 300 });
        // store user data for later creation
        const temp = JSON.stringify({ fullName, email, password: hashedPassword, role });
        await redisClient.set(`register:session:${loginSessionId}`, temp, { EX: 300 });

        console.log("OTP (register):", otp);
        await sendOtpEmail(email, otp);

        // 5. Send OTP session response (user not yet created)
        res.status(201).json({
            message: "OTP sent",
            loginSessionId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

};


export const loginUser = async (req: Request, res: Response) => {
    // console.log(req.body)
    try {

        // 1. Validate input
        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.flatten().fieldErrors
            });
        }

        const { email, password } = result.data;

        // 2. Find user and include password
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const loginSessionId = crypto.randomUUID();

        const otp = generateOTP()
        const hashedOtp = await bcrypt.hash(otp, 10)


        await redisClient.set(`otp:login:${loginSessionId}`, hashedOtp, { EX: 300 });


        await redisClient.set(`login:user:${loginSessionId}`, user._id.toString(), { EX: 300 })

        console.log("OTP: ", otp);
        await sendOtpEmail(user.email, otp)


        // // 4. Generate JWT token
        // const token = generateToken(user._id.toString());

        // // 5. Set cookie
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        // });

        // // 6. Send response
        // res.status(200).json({
        //     message: "Login successful",
        //     user: {
        //         id: user._id,
        //         fullName: user.fullName,
        //         email: user.email
        //     }
        // });

        return res.status(200).json({
            message: "OTP sent",
            loginSessionId
        })


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

};


export const logoutUser = async (req: Request, res: Response) => {
    try {
        // 1. Clear the cookie by name (usually 'token' or 'session')
        res.cookie("token", "", {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: "lax",
            expires: new Date(0), // Sets expiration to 1970 (immediate deletion)
        });

        // 2. Send a success response
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error during logout"
        });
    }
};



export const verifyOtp = async (req: Request, res: Response) => {
    const { loginSessionId, otp } = req.body;

    const otpKey = `otp:login:${loginSessionId}`;
    const userKey = `login:user:${loginSessionId}`;
    const regKey = `register:session:${loginSessionId}`;

    const storedHashedOtp = await redisClient.get(otpKey);
    const userId = await redisClient.get(userKey);
    const regData = await redisClient.get(regKey);

    // either a login session or a registration session must exist
    if (!storedHashedOtp || (!userId && !regData)) {
        return res.status(400).json({ message: "Session expired" });
    }

    const isMatch = await bcrypt.compare(otp, storedHashedOtp);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // remove otp entry
    await redisClient.del(otpKey);

    let finalUserId: string;

    if (regData) {
        // complete registration
        const { fullName, email, password, role } = JSON.parse(regData);
        // double check user doesn't already exist
        const existing = await User.findOne({ email });
        if (existing) {
            finalUserId = existing._id.toString();
        } else {
            const user = await User.create({ fullName, email, password, role });
            finalUserId = user._id.toString();
        }
        await redisClient.del(regKey);
    } else {
        finalUserId = userId!;
        await redisClient.del(userKey);
    }

    const user = await User.findById(finalUserId);

    if (!user) {
        return res.status(500).json({ message: "User not found after verification" });
    }

    const token = generateToken(finalUserId, user.role);
    console.log("Setting cookie for user:", finalUserId, "with role:", user.role);
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    });

    console.log("Cookie set. NODE_ENV:", process.env.NODE_ENV);

    return res.json({ message: "Login successful" });
};