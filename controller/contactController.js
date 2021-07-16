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
        })
            .catch(e => {
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
        let { group_name, contact_list } = req.body
        let { common_id } = req.user_info

        MerchentContactGroup.create({
            group_name,
            created_by: common_id
        }).then(async data => {
            contact_list.map(v => {
                v.group_id = data.group_id,
                    v.created_by = common_id
            })

            await MerchentContactGroupLink.bulkCreate(contact_list)

        }).catch(error => {
            console.log(error)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })
    }
    catch (e) {
        console.log(e)
        return res.status(200).send(OK(null, null, req))
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/group_by_id', (req, res) => {
    try {
        let { group_id } = req.body

        MerchentContactGroupLink.findOne({
            include: [
                {
                    model: MerchentContactGroup,
                    as: 'contact_group',
                },
                {
                    model: MerchentContact,
                    as: 'merchent_contact',
                }
            ],
            where: {
                created_by: common_id
            }
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

router.get('/contact_group', (req, res) => {
    try {
        let { common_id } = req.user_info

        MerchentContactGroupLink.findAll({
            include: [
                {
                    model: MerchentContactGroup,
                    as: 'contact_group',
                },
                {
                    model: MerchentContact,
                    as: 'merchent_contact',
                }
            ],
            where: {
                created_by: common_id
            }
        })
            .then(contacts => {
                return res.status(200).send(OK(contacts, null, req))
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
                    group_id: group_id
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

        let merchentGroupData = await MerchentContactGroupLink.findOne({where:{contact_id: contact_id}})
        let merchentContactGroupData = await MerchentContactGroup.findOne({where:{ group_id: merchentGroupData.group_id}})

        await MerchentContact.destroy({where: {id: contact_id}})
        await MerchentContactGroupLink.destroy.destroy({where:{ contact_id: contact_id}})
        await MerchentContactGroup.destroy({where:{ id: merchentContactGroupData.id}})

        return res.status(200).send(OK(null, null, req))
    }
    catch(error){
        console.log(error)
    }
})




module.exports = router;