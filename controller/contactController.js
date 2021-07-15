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
        }).then(data => {
            for (let i = 0; i < contact_list.lemgth; i++) {
                MerchentContact.create({
                    name: contact_list[i].name,
                    MSISDN: contact_list[i].MSISDN,
                    created_by: common_id
                }).then(contact => {
                    MerchentContactGroupLink.create({
                        contact_id: contact.id,
                        group_id: data.id,
                        created_by: common_id
                    })
                })

                if (i == contact_list.length - 1) {
                    return res.status(200).send(OK(null, null, req))
                }
            }
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

router.get('/contact_group', (req, res) => {
    try {
        let {common_id} = req.user_info

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
        }).catch(error=>{
            console.log(error)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})


module.exports = router;