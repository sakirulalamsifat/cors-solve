import express from 'express'
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from '../helpers/responseHelper'
import { MerchentUserAuthTrack, MerchentProfile, SW_TBL_PROFILE_MERCHANT_TEMP } from '../models'
import { hassPasswordGenerate } from '../middleware'

import sequelize from '../config/database'
import 'dotenv/config'


const router = express.Router()


router.get('/list', async (req, res) => {

    try {

        let { common_id: MSISDN } = req.user_info

        MerchentUserAuthTrack.findAll({ where: { parent_id: MSISDN } }).then(async data => {

            return res.status(200).send(OK(data, null, req));


        }).catch(e => {

            console.log(e)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })


    } catch (e) {
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/create_user', async (req, res) => {

    try {
        let { mobile, fullname, password, email } = req.body

        let { common_id: MSISDN } = req.user_info

        const info = await MerchentUserAuthTrack.findOne({ where: { MSISDN: mobile } })

        if (info) {

            return res.status(400).send(BAD_REQUEST(req.i18n.__('alreadyregisterd'), null, req));

        }

        const hasspass = await hassPasswordGenerate(password)

        MerchentUserAuthTrack.create({ MSISDN: mobile, fullname, password: hasspass, email, parent_id: MSISDN }).then(async data => {

            return res.status(200).send(OK(null, null, req));


        }).catch(e => {
            console.log(e)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })


    } catch (e) {
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/update_user', async(req, res) => {
    try{
        let {MSISDN, mobile, fullname, password, email } = req.body
        console.log(req.body)

        const upvalues = {
            mobile,
            fullname,
            email
        }

         if( password ){
             upvalues.hasspass = await hassPasswordGenerate(password)
         }

        await MerchentUserAuthTrack.update(upvalues,{
            where:{MSISDN}
        }).then(value=>{
            return res.status(200).send(OK(null, null, req));
        }).catch(error=>{
            console.log(error)
        })
    }catch(e){
        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }

})

router.post('/delete_user', async(req, res) => {
    try{
        let {MSISDN } = req.body
        MerchentUserAuthTrack.destroy({
            where: {
                MSISDN
            }
        }).then(value=>{
            return res.status(200).send(OK(null, null, req));
        }).catch(error=>{
            console.log(error)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })

    }catch(e){
        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }

})



router.get('/active_user', async (req, res) => {

    try {

        let { mobile } = req.body

        let { common_id: MSISDN } = req.user_info

        const info = await MerchentUserAuthTrack.findOne({ where: { MSISDN: mobile, parent_id: MSISDN } })

        if (!info) {

            return res.status(400).send(BAD_REQUEST(req.i18n.__('usernotregistered'), null, req));

        }


        MerchentUserAuthTrack.update({ status: 1 }, { where: { MSISDN: mobile, parent_id: MSISDN } }).then(async data => {

            return res.status(200).send(OK(null, null, req));


        }).catch(e => {

            console.log(e)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })


    } catch (e) {
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.get('/inactive_user', async (req, res) => {

    try {

        let { mobile } = req.body

        let { common_id: MSISDN } = req.user_info

        const info = await MerchentUserAuthTrack.findOne({ where: { MSISDN: mobile, parent_id: MSISDN } })

        if (!info) {

            return res.status(400).send(BAD_REQUEST(req.i18n.__('usernotregistered'), null, req));

        }


        MerchentUserAuthTrack.update({ status: 0 }, { where: { MSISDN: mobile, parent_id: MSISDN } }).then(async data => {

            return res.status(200).send(OK(null, null, req));


        }).catch(e => {

            console.log(e)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })


    } catch (e) {
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})



module.exports = router;