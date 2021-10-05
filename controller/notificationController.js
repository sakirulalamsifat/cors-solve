import express from 'express'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'
import {BulkNotification, BulkNotificationGroup, BulkNotificationGroupContact, BulkNotificationHistory, BulkNotificationTemp } from '../models'
import {hassPasswordGenerate} from '../middleware'
import 'dotenv/config'

const router = express.Router()

router.post('/create_notificationgroup', (req, res)=>{
    try{
        const { groupName } = req.body
        
        const createdGroup = await BulkNotificationGroup.findOne({ where: { group_name: groupName } })
        
        if (createdGroup) {
            return res.status(400).send(BAD_REQUEST(req.i18n.__('GroupNotificationexist'), null, req));
        }

        else {
            BulkNotificationGroup.create({
                group_name:groupName
            }).then(data => {
                return res.status(200).send(OK(data, null, req))
            }).catch(error => {
                console.log(error)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
            })
        }
    }
    catch(e){
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})


router.post('/delete_notificationgroup', async (req, res)=>{
    
    try{
        let { id } = req.body

        await BulkNotificationGroup.destroy({where:{id}})

        return res.status(200).send(OK(null, null, req))
    }
    catch(e){

        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/edit_notificationgroup',async(req,res)=>{

    try{

        let { id } = req.body
        const { groupName } = req.body

        BulkNotificationGroup.update({group_name:groupName},{where:{id}}).then(data=>{

            return res.status(200).send(OK( null, null, req));

        }).catch(e=>{

            console.log(e)
            return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })

    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})



module.exports = router;