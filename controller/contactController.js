import express from 'express'
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from '../helpers/responseHelper'
import { MerchentUserAuthTrack, MerchentProfile, SW_TBL_CITY, SW_TBL_COUNTRY, SW_TBL_DISTRICT, MerchentContact, MerchentContactGroup, MerchentContactGroupLink } from '../models'
import { hassPasswordGenerate } from '../middleware'
import 'dotenv/config'

const router = express.Router()

router.post('/create_contact', async (req, res) => {
    
    try {
        let { MSISDN, name } = req.body;
        let { common_id } = req.user_info

        MerchentContact.create({
            MSISDN,
            name,
            created_by: common_id
        }).then(data => {

            return res.status(200).send(OK(data, null, req))

        }).catch(error => {

            console.log(error)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })
    }
    catch (e) {

        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.get('/contact_list', (req, res) => {
    
    try {

        let { common_id } = req.user_info

        MerchentContact.findAll({ where: { created_by: common_id } }).then(contacts => {
           
            return res.status(200).send(OK(contacts, null, req))
       
        }).catch(e => {

                console.log(e)
                return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })
    }
    catch (e) {

        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/create_group', async (req, res) => {
    
    try {
        let { group_name } = req.body
        let { common_id } = req.user_info

        MerchentContactGroup.create({
            group_name,
            created_by: common_id

        }).then(async data => {

            return res.status(200).send(OK(data, null, req))

        }).catch(error => {

            console.log(error)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })
    }
    catch (e) {

        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.get('/group_list', async (req, res) => {
    
    try {

        let { common_id } = req.user_info

        MerchentContactGroup.findAll({
           
            where : {
                created_by: common_id
            }
           
        }).then(async data => {

            return res.status(200).send(OK(data, null, req))

        }).catch(error => {

            console.log(error)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })
    }
    catch (e) {

        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/contact_group_link', async (req, res) => {
    
    try {

        let {group_id, contact_ids = []} = req.body

        let { common_id } = req.user_info

        if(!contact_ids.length) {

            return res.status(400).send(BAD_REQUEST(req.i18n.__('contactsrequired'), null, req));

        }

        const insertdata = contact_ids.map(item => {

            return {
                contact_id : item,
                group_id,
                created_by : common_id
            }
        })

        MerchentContactGroupLink.bulkCreate(insertdata).then(async data => {

            return res.status(200).send(OK(null, null, req))

        }).catch(error => {

            console.log(error)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })
    }
    catch (e) {

        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/contacts_by_group_id', (req, res) => {
    try {
        let { group_id } = req.body

        MerchentContactGroupLink.findAll({
            where : {group_id},
            include: [
          
                {
                    model: MerchentContact,
                    as: 'merchent_contact',
                }
            ]
        }).then(data => {

            return res.status(200).send(OK(data, null, req))

        }).catch(error => {

            console.log(error)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })
    }
    catch (error) {

        console.log(error)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})


router.post('/delete_group', async (req, res)=>{
    
    try{
        let { group_id } = req.body

        MerchentContactGroup.destroy({
            where: {
                id: group_id
            }
        }).then(data=>{
            MerchentContactGroupLink.destroy({
                where:{
                    group_id
                }
            }).then(values=>{

                return res.status(200).send(OK(null, null, req))

            }).catch(error=>{

                console.log(error)
                return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
            })
        }).catch(error=>{

            console.log(error)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })
    }
    catch(e){

        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/delete_contatc', async(req, res)=>{
   
    try{
        let { contact_id } = req.body

        await MerchentContactGroupLink.findOne({where:{contact_id}})

        await MerchentContact.destroy({where: {id: contact_id}})

        return res.status(200).send(OK(null, null, req))
    }
    catch(error){

        console.log(error)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})




module.exports = router;