import mongoose from "mongoose"

export const dbConnection = async () => {
    try {

        const mongoUrl = process.env.MONGO_URL;

        if (!mongoUrl) {
            console.error("MONGO_URL is not defined in environment variables");
            process.exit(1);
        }

        await mongoose.connect(mongoUrl);

        console.log("Connected to DB")
    } catch (error) {
        console.error("Error connecting to DB:")
        console.error(error)
        process.exit(1)
    }
}