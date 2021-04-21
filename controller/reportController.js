import express from 'express'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'
import {MerchentUserAuthTrack,MerchentProfile,BulkPayment} from '../models'
import {base64fileUpload} from '../helpers/utilities'
import sequelize from '../config/database'
import 'dotenv/config'
import csv from 'csv-parser'
import fs from 'fs'


const router = express.Router()

const publicDir = process.env.publicDir

const processcsvfile = async(MSISDN,csvurl)=>{

    const fullurl = csvurl
    csvurl = csvurl.split(process.env.host)
    csvurl = csvurl[1]
    csvurl = `${publicDir}/${csvurl}`

    const dataforupload = []

        fs.createReadStream(csvurl)
        .pipe(csv())
        .on('data', (row) => {

            let rowdata = {

                Merchant_Wallet_ID:MSISDN,
                Destination_Wallet_ID:row['Destination_Wallet_ID'],
                Amount:row['Amount'],
                Keyword:'PMNT',
                Date:sequelize.literal(`Convert(Date, '${row['Date']}')`),
                Status:0,
                Upload_File_Name:fullurl

            }
            dataforupload.push(rowdata)

        })
        .on('end', () => {

            BulkPayment.bulkCreate(dataforupload).then(data=>{

                console.log('CSV file successfully processed');

            }).catch(e=>{

                console.log(e)
            })

        });
}

router.get('/reportlist',async(req,res)=>{

    try{

        let {common_id:MSISDN} = req.user_info

        BulkPayment.findAll({where:{Merchant_Wallet_ID:MSISDN}}).then(data=>{

            return res.status(200).send(OK( data, null, req));

        }).catch(e=>{

            console.log(e)
            return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })

    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/upload',async(req,res)=>{

    try{

        let {report_file} = req.body

        let {common_id:MSISDN} = req.user_info

        if(!report_file){ return res.status(400).send(BAD_REQUEST(req.i18n.__('filemissing'), null, req)) }
   
        let Url = await base64fileUpload(report_file,'csv');
     
        if(!Url){ return res.status(400).send(BAD_REQUEST(req.i18n.__('corruptedfile'), null, req))  }

        processcsvfile(MSISDN,Url)

        return res.status(200).send(OK( null, null, req));


    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})


router.post('/merchenttransectionreport', (req, res)=>{

    try{
      let {startdate,enddate } = req.body
      let {common_id:MSISDN} = req.user_info
  
      MSISDN = 17676160180
      const query = `select * from SW_VW_MERCHANT_REPORT where Dest_Wallet_Id=${MSISDN} and Created_Date >= '${startdate} 00:00:00' and Created_Date <= '${enddate} 23:59:59' `
       
      console.log(query)
     
      sequelize.query( query)
     
      .then(report => {

       return res.status(200).send(OK( report[0], null, req));

      }).catch(e=>{

        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
      })
  
    }catch(e){
     console.log('e ', e)
     return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
   })

 module.exports = router;