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

app.use(cors({
    origin: 'http://localhost:3000', // Your Next.js URL
    credentials: true, // This is ESSENTIAL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/reports', reportRouter)

async function main() {

    await dbConnection();
    app.listen(5000, () => {
        console.log("Server running on port 3000")
    })
}

main()