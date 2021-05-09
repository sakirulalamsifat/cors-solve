import express from 'express'
import ReportController from '../controller/reportController'
import RefundController from '../controller/refundController'

const router = express.Router()

router.use("/api/report/",ReportController)

router.use("/api/refund/",RefundController)

module.exports = router;