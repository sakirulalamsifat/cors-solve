import express from 'express'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'
import {MerchentUserAuthTrack,MerchentProfile} from '../models'
import {hassPasswordGenerate} from '../middleware'
import 'dotenv/config'


const router = express.Router()

const getImageFullPath = async(Logo_Image=null)=>{

    if(Logo_Image){

        let logo = Logo_Image
        //Logo_Image=9841245601_Merchant_Logo_Image202012220712295797_2020-12-22.png
        const  split_array = Logo_Image.split('_')
        //split_array = ['9841245601','Merchant','Logo','Image202012220712295797','2020-12-22.png']
        const get_folder_composit_name = split_array[split_array.length-1].split('.')
        //get_folder_composit_name= ['2020-12-22','png']
        const folder_names = get_folder_composit_name[0].split('-')
        //folder_names = ['2020','12','22',.....]
        Logo_Image = process.env.host
        folder_names.forEach((item,index)=>Logo_Image= `${Logo_Image}/${folder_names[index]}`)

        return `${Logo_Image}/${logo}`

    }
    else{

        return null
    }

}


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