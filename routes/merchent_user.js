import express from 'express'
import MerchentUserController from '../controller/merchentuserController'

const router = express.Router()

router.use("/api/merchentuser/",MerchentUserController)

module.exports = router;