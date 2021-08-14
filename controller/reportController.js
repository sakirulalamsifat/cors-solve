import express from 'express'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'
import {MerchentUserAuthTrack,MerchentProfile,BulkPayment,MerchentReportTemp,BulkPaymentReportTemp,BulkPaymentReportTempData} from '../models'
import {base64fileUpload} from '../helpers/utilities'
import {encryptString} from '../config/encrypter'
import sequelize from '../config/database'
import 'dotenv/config'
import csv from 'csv-parser'
import fs from 'fs'
import Sequelize from 'sequelize'
const Op = Sequelize.Op

const router = express.Router()

const publicDir = process.env.publicDir

String.prototype.isNumber = function(){return /^\d+$/.test(this);}

const processcsvfile = async(MSISDN,csvurl,uploaded_by)=>{

    return new Promise((resolve, reject) => {

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
                Date: row['Date'],
                Status:0,
                Upload_File_Name:fullurl

            }
            dataforupload.push(rowdata)

        })
        .on('end', () => {

           // BulkPayment.bulkCreate(dataforupload).then(async data=>{
            BulkPaymentReportTempData.bulkCreate(dataforupload).then(async data=>{

                await BulkPaymentReportTemp.create({
                    filename : fullurl,
                    MSISDN,
                    uploaded_by
                })
                console.log('CSV file successfully processed');
                resolve(dataforupload)

            }).catch(e=>{

                console.log(e)
                resolve([])
            })

        })
    })
}

router.get('/reportlist',async(req,res)=>{

    try{

        let {common_id:MSISDN} = req.user_info

        BulkPayment.findAll({
            where:{Merchant_Wallet_ID:MSISDN},
            order : [['Row_ID', 'DESC']],
            limit : 50000
        }).then(data=>{

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

router.post('/singletempfiledata',async(req,res)=>{

    try{

        let {Upload_File_Name = null} = req.body

        BulkPaymentReportTempData.findAll({where:{Upload_File_Name,status:0}}).then(data=>{

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

router.post('/singletempfiledataapprove',async(req,res)=>{

    try{

        let {Upload_File_Name = null, pin = 0} = req.body

        BulkPaymentReportTempData.findAll({where:{Upload_File_Name,status:0}}).then(data=>{

            let dataforupload = [], i = 0, errordata = [], ei = 0, ids = []

           data.forEach((item, index) => {

            ids[index] = item.Row_ID

                if(item.Destination_Wallet_ID && ((item.Destination_Wallet_ID.replace(/\s/g, '')).length) == 11 && (item.Destination_Wallet_ID).isNumber()) {

                    dataforupload[i++] = { 

                        Destination_Wallet_ID : item.Destination_Wallet_ID.replace(/\s/g, ''),
                        Merchant_Wallet_ID: item.Merchant_Wallet_ID,
                        Amount: item.Amount,
                        Keyword: item.Keyword,
                        Date:sequelize.literal(`Convert(Date, '${item.Date}')`),
                        Status: item.Status,
                        Upload_File_Name: item.Upload_File_Name,
                        pin : encryptString(`${pin}`)
                    }
                }
                else {

                    errordata[ei++] = { ...item.dataValues}
                }

            })

            BulkPaymentReportTemp.destroy({
                    
                where : {
                    filename : Upload_File_Name
                }
            })

            BulkPaymentReportTempData.update({Status : 1},{
                    
                where : {
                    Row_ID : ids
                }
            })

            if(dataforupload.length) {

                BulkPayment.bulkCreate(dataforupload).then(async data=>{

                    return res.status(200).send(OK( {dataforupload,errordata}, null, req))


            }).catch(e=>{

                console.log(e)
                return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
            })
        }
        else {

            return res.status(200).send(OK( {dataforupload,errordata}, 'There have no correct data to approve', req))
        }

        }).catch(e=>{

            console.log(e)
            return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })

    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/singletempfiledatareject',async(req,res)=>{

    try{

        let {Upload_File_Name = null} = req.body

        await BulkPaymentReportTemp.destroy({
                    
            where : {
                filename : Upload_File_Name
            }
        })

        await BulkPaymentReportTempData.destroy({
                    
            where : {
                Upload_File_Name
            }
        })

        return res.status(200).send(OK( null, null, req))

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

        let {common_id:MSISDN, MSISDN : uploaded_by} = req.user_info

        if(!report_file){ return res.status(400).send(BAD_REQUEST(req.i18n.__('filemissing'), null, req)) }
   
        let Url = await base64fileUpload(report_file,'csv');
     
        if(!Url){ return res.status(400).send(BAD_REQUEST(req.i18n.__('corruptedfile'), null, req))  }

       const dataforupload = await processcsvfile(MSISDN,Url,uploaded_by)

        return res.status(200).send(OK( dataforupload, null, req));


    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/upload_by_group',async(req,res)=>{

    try{

        let {CONTACTS = [], GroupID = 0} = req.body

        let {common_id:MSISDN, MSISDN : uploaded_by} = req.user_info, dataforupload = []

        CONTACTS.map(row => {

            let rowdata = {

                Merchant_Wallet_ID:MSISDN,
                Destination_Wallet_ID:row['MSISDN'],
                Amount:row['AMOUNT'],
                Keyword:'PMNT',
                Date: row['DATE'],
                Status:0,
                Upload_File_Name: "",
                GroupID : GroupID
    
            }
            dataforupload.push(rowdata)
        })

        BulkPaymentReportTempData.bulkCreate(dataforupload).then(async data=>{

            return res.status(200).send(OK( dataforupload, null, req))

        }).catch(e => {

            console.log(e)
            return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })

    }catch(e){

        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/pendingreport_by_group',async(req,res)=>{

    try{

        let {GroupID = 0} = req.body

        let {common_id:MSISDN, MSISDN : uploaded_by} = req.user_info

        let condition = {
            Merchant_Wallet_ID:MSISDN,
            Status:0,
            GroupID : {
                [Op.ne]: 0
            }
        }
        if(GroupID) {
            condition.GroupID = GroupID
        }

        BulkPaymentReportTempData.findAll({where: condition}).then(async data=>{

            return res.status(200).send(OK( data, null, req))

        }).catch(e => {

            console.log(e)
            return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })


    }catch(e){

        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/groupdataapprove',async(req,res)=>{

    try{

        let {GroupID = 0, pin = 0} = req.body

        let {common_id:MSISDN, MSISDN : uploaded_by} = req.user_info

        let condition = {
            Merchant_Wallet_ID:MSISDN,
            Status : 0,
            GroupID : {
                [Op.ne]: 0
            }
        }
        if(GroupID) {
            condition.GroupID = GroupID
        }

        BulkPaymentReportTempData.findAll({where:condition}).then(data=>{

            let dataforupload = [], i = 0, errordata = [], ei = 0, ids = []

           data.forEach((item, index) => {

             ids[index] = item.Row_ID

                if(item.Destination_Wallet_ID && ((item.Destination_Wallet_ID.replace(/\s/g, '')).length) == 11 && (item.Destination_Wallet_ID).isNumber()) {

                    dataforupload[i++] = { 

                        Destination_Wallet_ID : item.Destination_Wallet_ID.replace(/\s/g, ''),
                        Merchant_Wallet_ID: item.Merchant_Wallet_ID,
                        Amount: item.Amount,
                        Keyword: item.Keyword,
                        Date:sequelize.literal(`Convert(Date, '${item.Date}')`),
                        Status: item.Status,
                        Upload_File_Name: item.Upload_File_Name,
                        pin : encryptString(`${pin}`)
                    }
                }
                else {

                    errordata[ei++] = { ...item.dataValues}
                }

            })

            BulkPaymentReportTempData.update({Status : 1},{
                    
                where : {
                    Row_ID : ids
                }
            })

            if(dataforupload.length) {

                BulkPayment.bulkCreate(dataforupload).then(async data=>{

                    return res.status(200).send(OK( {dataforupload,errordata}, null, req))


            }).catch(e=>{

                console.log(e)
                return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
            })
        }
        else {

            return res.status(200).send(OK( {dataforupload,errordata}, 'There have no correct data to approve', req))
        }

        }).catch(e=>{

            console.log(e)
            return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })

    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/groupdatareject',async(req,res)=>{

    try{

        let {GroupID = 0} = req.body

        let {common_id:MSISDN, MSISDN : uploaded_by} = req.user_info

        let condition = {
            Merchant_Wallet_ID:MSISDN,
            Status : 0,
            GroupID : {
                [Op.ne]: 0
            }
        }
        if(GroupID) {
            condition.GroupID = GroupID
        }

        await BulkPaymentReportTempData.destroy({
                    
            where : condition
        })

        return res.status(200).send(OK( null, null, req))

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
       const query2 = `select sum(Amount) as refund_setll from SW_VW_MERCHANT_REPORT where Dest_Wallet_Id = ${MSISDN} and Status = 8`
      console.log(query)
      console.log(query2)
     
      sequelize.query( query)
     
      .then(async report => {

        const result2 = await  sequelize.query(query2)
        const {refund_setll = 0} = result2[0][0]
        const {total_sell = 0, total_transection = 0} = report[0][0]
        const data = [{total_transection,total_sell : ((+total_sell) - (+refund_setll))}]

       return res.status(200).send(OK( data, null, req));

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

        const reportHistory = report[0].map(item => {
             if(item.Keyword == 'SEND' && item.Dest_Wallet_ID == Msisdn){
                 return {...item, Keyword : "RECV", Keyword_Description: 'Receive'}
             }
             else {
                 return item
             }
        })
       return res.status(200).send(OK( reportHistory, null, req));

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