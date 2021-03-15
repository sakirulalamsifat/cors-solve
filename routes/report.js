import express from 'express'
import ReportController from '../controller/reportController'

const router = express.Router()

router.use("/api/report/",ReportController)

module.exports = router;