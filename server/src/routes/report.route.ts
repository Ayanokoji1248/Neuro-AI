import { Router } from "express"
import { authMiddleware } from "../middlewares/user.middleware.js"
import { createReport, deleteSingleReport, getMyReports, getSingleReport } from "../controllers/report.controller.js"
const reportRouter = Router()

reportRouter.get('/my', authMiddleware, getMyReports)
reportRouter.get('/:id', authMiddleware, getSingleReport)
reportRouter.post('/create', authMiddleware, createReport)
reportRouter.delete('/:id', authMiddleware, deleteSingleReport)

export default reportRouter