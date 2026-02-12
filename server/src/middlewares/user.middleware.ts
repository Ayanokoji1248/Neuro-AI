import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";



export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        req.user = decoded;

        next();

    } catch {

        res.status(401).json({
            message: "Invalid token"
        });

    }

};
