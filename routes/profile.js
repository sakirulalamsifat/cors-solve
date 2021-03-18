import express from 'express'
import ProfileController from '../controller/profileController'

const router = express.Router()

router.use("/api/profile/",ProfileController)

module.exports = router;