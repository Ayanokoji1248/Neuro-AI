import { Router } from "express"
import type { Request, Response } from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/user.middleware.js"
import User from "../models/user.model.js";
import Report from "../models/report.model.js";
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

userRouter.get(
    "/admin/dashboard",
    authMiddleware,
    adminMiddleware,
    async (_req: Request, res: Response) => {
        try {
            const [users, reports] = await Promise.all([
                User.find().select("fullName email role createdAt updatedAt").sort({ createdAt: -1 }),
                Report.find().select("user patientName patientAge patientGender result confidence createdAt").sort({ createdAt: -1 }),
            ]);

            const userRoleOrder = ["admin", "doctor", "radiologist", "patient"] as const;
            const reportResultOrder = ["Tumor", "No Tumor", "Pending"] as const;
            const genderOrder = ["Male", "Female", "Other"] as const;
            const ageGroups = [
                { key: "0-17", min: 0, max: 17 },
                { key: "18-30", min: 18, max: 30 },
                { key: "31-45", min: 31, max: 45 },
                { key: "46-60", min: 46, max: 60 },
                { key: "61+", min: 61, max: Number.POSITIVE_INFINITY },
            ] as const;

            const roleCounts = userRoleOrder.reduce<Record<string, number>>((acc, role) => {
                acc[role] = 0;
                return acc;
            }, {});

            const resultCounts = reportResultOrder.reduce<Record<string, number>>((acc, result) => {
                acc[result] = 0;
                return acc;
            }, {});

            const genderCounts = genderOrder.reduce<Record<string, number>>((acc, gender) => {
                acc[gender] = 0;
                return acc;
            }, {});

            const ageGroupCounts = ageGroups.reduce<Record<string, number>>((acc, group) => {
                acc[group.key] = 0;
                return acc;
            }, {});

            users.forEach((user) => {
                if (roleCounts[user.role] !== undefined) {
                    roleCounts[user.role] = (roleCounts[user.role] ?? 0) + 1;
                }
            });

            reports.forEach((report) => {
                if (resultCounts[report.result] !== undefined) {
                    resultCounts[report.result] = (resultCounts[report.result] ?? 0) + 1;
                }

                if (genderCounts[report.patientGender] !== undefined) {
                    genderCounts[report.patientGender] = (genderCounts[report.patientGender] ?? 0) + 1;
                }

                const matchedAgeGroup = ageGroups.find((group) => {
                    return report.patientAge >= group.min && report.patientAge <= group.max;
                });

                if (matchedAgeGroup) {
                    ageGroupCounts[matchedAgeGroup.key] = (ageGroupCounts[matchedAgeGroup.key] ?? 0) + 1;
                }
            });

            const today = new Date();
            const dailyWindows = Array.from({ length: 7 }, (_, index) => {
                const current = new Date(today);
                current.setHours(0, 0, 0, 0);
                current.setDate(today.getDate() - (6 - index));

                return {
                    key: current.toISOString().slice(0, 10),
                    label: current.toLocaleDateString("en-US", { weekday: "short" }),
                    fullDate: current.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    }),
                    value: 0,
                };
            });

            const weeklyReportMap = new Map(dailyWindows.map((item) => [item.key, item]));

            reports.forEach((report) => {
                const key = new Date(report.createdAt).toISOString().slice(0, 10);
                const match = weeklyReportMap.get(key);

                if (match) {
                    match.value += 1;
                }
            });

            const monthlyWindows = Array.from({ length: 6 }, (_, index) => {
                const current = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);

                return {
                    key: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`,
                    label: current.toLocaleDateString("en-US", { month: "short" }),
                    value: 0,
                };
            });

            const monthlySignupMap = new Map(monthlyWindows.map((item) => [item.key, item]));

            users.forEach((user) => {
                const createdAt = new Date(user.createdAt);
                const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
                const match = monthlySignupMap.get(key);

                if (match) {
                    match.value += 1;
                }
            });

            const confidenceValues = reports
                .map((report) => report.confidence)
                .filter((confidence): confidence is number => typeof confidence === "number");

            const totalConfidence = confidenceValues.reduce((sum, confidence) => {
                return sum + confidence;
            }, 0);

            const reportCountsByUser = reports.reduce<Record<string, number>>((acc, report) => {
                const userId = String(report.user);
                acc[userId] = (acc[userId] ?? 0) + 1;
                return acc;
            }, {});

            const topContributors = users
                .map((user) => ({
                    _id: user._id.toString(),
                    fullName: user.fullName,
                    role: user.role,
                    reportCount: reportCountsByUser[user._id.toString()] ?? 0,
                }))
                .filter((user) => user.reportCount > 0)
                .sort((a, b) => b.reportCount - a.reportCount)
                .slice(0, 5);

            const recentReports = reports.slice(0, 5).map((report) => ({
                _id: report._id.toString(),
                patientName: report.patientName,
                patientGender: report.patientGender,
                result: report.result,
                confidence: report.confidence,
                createdAt: report.createdAt,
            }));

            return res.status(200).json({
                users,
                dashboard: {
                    overview: {
                        totalUsers: users.length,
                        totalReports: reports.length,
                        tumorCases: resultCounts["Tumor"] ?? 0,
                        pendingReports: resultCounts["Pending"] ?? 0,
                        avgConfidence: confidenceValues.length > 0
                            ? Number((totalConfidence / confidenceValues.length).toFixed(1))
                            : 0,
                    },
                    userRoles: userRoleOrder.map((role) => ({
                        key: role,
                        label: role.charAt(0).toUpperCase() + role.slice(1),
                        value: roleCounts[role] ?? 0,
                    })),
                    reportResults: reportResultOrder.map((result) => ({
                        key: result,
                        label: result,
                        value: resultCounts[result] ?? 0,
                    })),
                    genderDistribution: genderOrder.map((gender) => ({
                        key: gender,
                        label: gender,
                        value: genderCounts[gender] ?? 0,
                    })),
                    ageDistribution: ageGroups.map((group) => ({
                        key: group.key,
                        label: group.key,
                        value: ageGroupCounts[group.key] ?? 0,
                    })),
                    weeklyReports: dailyWindows,
                    monthlySignups: monthlyWindows,
                    recentSignups: users.slice(0, 5).map((user) => ({
                        _id: user._id.toString(),
                        fullName: user.fullName,
                        email: user.email,
                        role: user.role,
                        createdAt: user.createdAt,
                    })),
                    recentReports,
                    topContributors,
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }
);

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
