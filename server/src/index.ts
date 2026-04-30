// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first");
import express from "express"
import { dbConnection } from "./config/db.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import reportRouter from "./routes/report.route.js"
dotenv.config({})

const app = express()
app.set("trust proxy", 1);
const port = Number(process.env.PORT ?? 5000);
const allowedOrigins = [
    "http://localhost:3000",
    ...(process.env.CLIENT_URL ?? "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    // You can add other trusted domains here
];

app.use(cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Set-Cookie']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/reports', reportRouter)

async function main() {

    await dbConnection();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

main()
