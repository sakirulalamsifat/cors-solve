import express from 'express'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'
import {MerchentUserAuthTrack,MerchentProfile, BulkNotificationGroup} from '../models'
import {hassPasswordGenerate} from '../middleware'
import 'dotenv/config'
import {getImageFullPath} from '../helpers/imagesystem'

const router = express.Router()


router.get('/info',async(req,res)=>{

    try{

        let {MSISDN,is_merchent} = req.user_info

        if(is_merchent){


            MerchentProfile.findOne({where:{MSISDN}}).then(async data=>{

                if(data) {

                    let logo = data.Logo_Image ? await getImageFullPath(data.Logo_Image) : null

                    data = {
                        ...data.dataValues,
                        Logo_Image : logo
                    }

                }


                return res.status(200).send(OK( {is_merchent,data}, null, req));
    
               
            }).catch(e=>{
    
                console.log(e)
                return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
            })

        }else{

            MerchentUserAuthTrack.findOne({where:{MSISDN}}).then(async data=>{


                return res.status(200).send(OK( {is_merchent,data}, null, req));
    
               
            }).catch(e=>{
    
                console.log(e)
                return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
            })

        }


    }catch(e){
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})




module.exports = router;