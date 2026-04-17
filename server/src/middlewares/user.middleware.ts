import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const token = req.cookies.token;
    console.log("authMiddleware - token exists:", !!token);
    console.log("authMiddleware - cookies:", Object.keys(req.cookies));

    if (!token) {
        console.log("authMiddleware - No token found, returning 401");
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        console.log("authMiddleware - Token decoded successfully, userId:", decoded.userId);
        req.user = decoded;

        next();

    } catch (error) {
        console.log("authMiddleware - Token verification failed:", error);

        res.status(401).json({
            message: "Invalid token"
        });

    }

};

export const requireRole = (roles: string[]) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const role = (req.user as any)?.role as string | undefined;

    if (!role || !roles.includes(role)) {
        return res.status(403).json({
            message: "Forbidden"
        });
    }

    next();
};

export const adminMiddleware = requireRole(["admin"]);
