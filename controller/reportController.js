import express from 'express'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'
import {MerchentUserAuthTrack,MerchentProfile,BulkPayment} from '../models'
import {base64fileUpload} from '../helpers/utilities'
import sequelize from '../config/database'
import 'dotenv/config'
import csv from 'csv-parser'
import fs from 'fs'


const router = express.Router()

const processcsvfile = async(MSISDN,csvurl)=>{

    const fullurl = csvurl
    csvurl = csvurl.split(process.env.host)
    csvurl = csvurl[1]
    csvurl = `public/${csvurl}`

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

        let {MSISDN} = req.user_info

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

        let {MSISDN} = req.user_info

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



 module.exports = router;