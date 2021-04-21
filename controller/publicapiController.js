import express from 'express'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'
import {SW_TBL_ID_TYPE, MerchentBusinessType, MerchentNature} from '../models'
import {hassPasswordGenerate} from '../middleware'
import 'dotenv/config'

const router = express.Router()

router.get('/idtypes', (req, res)=>{
   try{
    SW_TBL_ID_TYPE.findAll({
      }).then(value=>{
        return res.status(200).send(OK(value, null, req));
      });
   }catch(e){
    console.log('e ', e)
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
   }
  })


  router.get('/businesstypes', (req, res)=>{
    try{
        MerchentBusinessType.findAll({
       }).then(value=>{
         return res.status(200).send(OK(value, null, req));
       });
    }catch(e){
     console.log('e ', e)
     return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
   })

   router.get('/merchentnature', (req, res)=>{
    try{
        MerchentNature.findAll({
       }).then(value=>{
         return res.status(200).send(OK(value, null, req));
       });
    }catch(e){
     console.log('e ', e)
     return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
   })
  

module.exports = router;