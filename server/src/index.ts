import express from "express"
import { dbConnection } from "./config/db.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authuser.route.js"
import userRouter from "./routes/user.route.js"
import reportRouter from "./routes/report.route.js"
dotenv.config({})

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/reports', reportRouter)

async function main() {

    await dbConnection();
    app.listen(3000, () => {
        console.log("Server running on port 3000")
    })
}

main()