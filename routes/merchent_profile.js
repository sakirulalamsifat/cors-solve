import express from 'express'
import MerchentProfileController from '../controller/merchentprofileController'

const router = express.Router()

router.use("/api/merchentprofile/",MerchentProfileController)

module.exports = router;