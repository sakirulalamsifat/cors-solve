import express from 'express'

import NotiicationController from '../controller/notificationController'

const router = express.Router()

router.use("/api/notification/",NotiicationController)

module.exports = router;