import express from 'express'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'
import {MerchentUserAuthTrack,MerchentProfile,BulkPayment,MerchentReportTemp,BulkPaymentReportTemp} from '../models'
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

            BulkPayment.bulkCreate(dataforupload).then(async data=>{

                await BulkPaymentReportTemp.create({
                    filename : fullurl,
                    MSISDN
                })
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

router.post('/tempreportlist',async(req,res)=>{

    try{

        let {common_id:MSISDN} = req.user_info

        BulkPaymentReportTemp.findAll({where:{MSISDN,status:0}}).then(data=>{

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

router.post('/updatestatusoftempreport',async(req,res)=>{

    try{

        let {id} = req.body

        BulkPaymentReportTemp.update({status:1},{where:{id}}).then(data=>{

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

router.post('/upload',async(req,res)=>{

    try{

        let {report_file} = req.body

        let {common_id:MSISDN} = req.user_info

        if(!report_file){ return res.status(400).send(BAD_REQUEST(req.i18n.__('filemissing'), null, req)) }
   
        let Url = await base64fileUpload(report_file,'csv');
     
        if(!Url){ return res.status(400).send(BAD_REQUEST(req.i18n.__('corruptedfile'), null, req))  }

       await processcsvfile(MSISDN,Url)

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

router.post('/totalmerchenttransectionreportcount', (req, res)=>{

    try{

     let {common_id:MSISDN} = req.user_info

      const query = `select count(*) as total_transection, sum(Amount) as total_sell from SW_VW_MERCHANT_REPORT where Dest_Wallet_Id=${MSISDN} `
       
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

router.post('/temporaryrefundmerchenttransection', (req, res)=>{

    try{
      let {transection_id} = req.body

      let {common_id:MSISDN} = req.user_info

      const query = `select * from SW_VW_MERCHANT_REPORT where Dest_Wallet_Id=${MSISDN} and Transaction_ID=${transection_id} `
     
      console.log(query)
     
      sequelize.query( query)
     
      .then(async report => {

        if(report[0].length) {

            const alreadyhave = await MerchentReportTemp.findOne({where:{Transaction_ID : transection_id}})
           
            if(alreadyhave) {

                return res.status(400).send(BAD_REQUEST(req.i18n.__('alreadyhaverequest'), null, req));

            }
            else{

                MerchentReportTemp.create({

                    ...report[0][0]

                }).then(report => {
          
                 return res.status(200).send(OK( null, null, req));
          
                }).catch(e=>{
          
                  console.log(e)
                  return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
                })

            }         

        }
        else{

            return res.status(200).send(OK( null, null, req));
        }

      }).catch(e=>{

        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
      })

  
    }catch(e){
     console.log('e ', e)
     return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
  
})

router.post('/merchentpendingrefundtransection', (req, res)=>{

    try{

      let {common_id:MSISDN} = req.user_info

       console.log(MSISDN)
     
      MerchentReportTemp.findAll({ 
          logging:console.log,
          where: { Dest_Wallet_Id: MSISDN }
        })
     
      .then(report => {

       return res.status(200).send(OK( report, null, req));

      }).catch(e=>{

        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
      })
  
    }catch(e){
     console.log('e ', e)
     return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
  
})

router.post('/customertransectionreport', (req, res)=>{

    try{

      let {Msisdn,FromDate,ToDate,Page,PageSize } = req.body 

      Page = +Page;  
      PageSize = +PageSize;  

      const offset = PageSize * (Page - 1)

      const query = `select t.*, k.Keyword_Description from SW_TBL_TRANSACTION t left join SW_TBL_KEYWORD k on t.Keyword = k.Keyword
      where (t.Source_Wallet_ID=${Msisdn} or t.Dest_Wallet_ID=${Msisdn} ) and t.Created_Date >= '${FromDate} 00:00:00' and t.Created_Date <= '${ToDate} 23:59:59'
      ORDER BY t.Created_Date DESC
      OFFSET ${offset} ROWS
      FETCH NEXT ${PageSize} ROWS ONLY `
       
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