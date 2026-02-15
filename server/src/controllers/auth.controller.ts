import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

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

        const { fullName, email, password } = result.data;

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
            password: hashedPassword
        });

        const token = generateToken(user._id.toString());

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // 5. Send response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
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

        // 4. Generate JWT token
        const token = generateToken(user._id.toString());

        // 5. Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // 6. Send response
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

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