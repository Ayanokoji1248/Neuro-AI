import jwt from "jsonwebtoken";

export const generateToken = (userId: string): string => {

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET not defined");
    }

    const token = jwt.sign(
        { userId },          // payload
        secret,              // secret
        { expiresIn: "7d" }  // expiration
    );

    return token;

};
