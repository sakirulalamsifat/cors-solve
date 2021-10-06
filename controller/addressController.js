import express from 'express'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'
import {MerchentUserAuthTrack,MerchentProfile, SW_TBL_CITY, SW_TBL_COUNTRY, SW_TBL_DISTRICT} from '../models'
import {hassPasswordGenerate} from '../middleware'
import 'dotenv/config'

const router = express.Router()

router.get('/city', (req, res)=>{
    try{
        SW_TBL_CITY.findAll({where:{}}).then(citys=>{
            return res.status(200).send(OK(citys, null, req))
            console.log(req.user_info);
        }).catch(e=>{
            return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })
        console.log(req.user_info);
    }
    catch(e){
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})


router.get('/country', (req, res)=>{
    try{
        SW_TBL_COUNTRY.findAll({where:{}}).then(countrys=>{
            return res.status(200).send(OK( countrys, null, req))
        }).catch(e=>{
            return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })
    }
    catch(e){
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.get('/district', (req, res)=>{
    try{
        SW_TBL_DISTRICT.findAll({
        }).then(district=>{
            return res.status(200).send(OK( district, null, req))
        }).catch(e=>{
            return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })
    }
    catch{
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/district_by_city', (req, res)=>{
    try{
        let { city_id } = req.body;
        SW_TBL_DISTRICT.findAll({where:{ City_Id:city_id}}).then(districts=>{
            return res.status(200).send(OK( districts, null, req))
        })
        .catch(e=>{
            return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })
    }
    catch{
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

module.exports = router;