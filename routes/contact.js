import express from 'express'
import ContactController from '../controller/contactController'

const router = express.Router()

router.use("/api/contact/",ContactController)

module.exports = router;