import type { Request, Response } from "express";
import Report from "../models/report.model.js";

export const createReport = async (req: Request, res: Response) => {
    try {
        const { patientName, patientAge, patientGender, imageUrl } = req.body;

        const report = new Report({
            patientName,
            patientAge,
            patientGender,
            imageUrl,
            user: req.user?.userId
        });

        await report.save();

        res.status(201).json({
            message: "Report created successfully",
            report,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to create report",
            error: error,
        });
    }
};

export const getSingleReport = async (req: Request, res: Response) => {
    try {
        const reportId = req.params.id;

        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({
                message: "Report not found",
            });
        }

        res.status(200).json({
            message: "Report fetched successfully",
            report,
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch report",
            error: error,
        });
    }
};


export const getMyReports = async (req: Request, res: Response) => {

    try {

        const userId = req.user!.userId;

        const reports = await Report.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('user');

        res.json({
            reports
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

};


export const deleteSingleReport = async (req: Request, res: Response) => {
    try {
        const reportId = req.params.id;

        const report = await Report.findOneAndDelete({
            _id: reportId,
            user: req.user?.userId,
        });

        if (!report) {
            return res.status(404).json({
                message: "Report not found or unauthorized",
            });
        }

        res.status(200).json({
            message: "Report deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete report",
            error: error,
        });
    }
};
