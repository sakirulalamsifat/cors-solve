import express from 'express'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST,NOT_FOUND} from '../helpers/responseHelper'
import sequelize from '../config/database'
import {MerchentReportTemp} from '../models'
import axios from 'axios'
require('dotenv').config()

const router = express.Router()

const mlajan_notification_api_base_url = process.env.mlajan_notification_api_base_url

const sendNotification = async (keyword,AMOUNT,MSISDN,REFID) => {

    let query = `select * from SW_TBL_NOTIFICATION where Keyword='${keyword}'`
    sequelize.query( query).then(async data =>{
        if(data[0].length){
            let msg = data[0][0].Notification_Template
            msg = msg.replace("<AMOUNT>", AMOUNT).replace("<DESTINATIONMSISDN>", MSISDN).replace("<REFID>", REFID).replace("<SOURCEMSISDN>", MSISDN)
            axios.post(`${mlajan_notification_api_base_url}/api/smsRouter`,{
                "Msisdn":MSISDN,
                "Message":msg,
                "Keyword":keyword,
                "SendSms":data[0][0].SendSms
            }).then(d=>{
                console.log(msg)
            }).catch(e=>{
                console.log(e)
            })
        }
    })
    

}

router.post('/merchentrefundtransection', (req, res)=>{

    try{

        console.log(req.body)

        let {Transaction_ID} = req.body

        let {common_id:MSISDN,applogin=false,ismanager=false} = req.user_info
        console.log(req.user_info)

       /* if(!applogin){

            if(!ismanager){
                return res.status(400).send(BAD_REQUEST(req.i18n.__('unauthorized'), null, req));
            }
        }*/

        Transaction_ID = +Transaction_ID

        const query = `select * from SW_VW_MERCHANT_REPORT where Dest_Wallet_Id=${MSISDN} and Transaction_ID=${Transaction_ID} `

        console.log(query)

        sequelize.query( query).then(async report =>{

            if(report[0].length) {

                let {Reference_ID,Amount,Source_Wallet_ID,Charge_Payer} = report[0][0] , uniqueID = Date.now()

                Source_Wallet_ID = +Source_Wallet_ID

                let query22 = `EXEC SW_PROC_MERCHANT_FULL_REVERSAL_NEW  @Flag = 'getRefundTxn',@Transaction_ID = ${Transaction_ID},@Reference_ID = '${Transaction_ID}',@Charge_Payer = ${Source_Wallet_ID}, @New_Charge_Amount = ${Amount}`

                console.log(query22)

                const check = await await sequelize.query(query22)
                
                if(check[0][0].Code == 128){

                    return res.status(400).send(BAD_REQUEST(check[0][0].Msg, check[0][0].Msg, req));
                }


                let query2 = `EXEC SW_PROC_MERCHANT_FULL_REVERSAL_NEW 
        
                @Flag = 'Reversal',
                @Transaction_ID = ${uniqueID},
                @Reference_ID = '${Transaction_ID}',
                @Charge_Payer = ${Charge_Payer},
                @New_Charge_Amount = ${Amount}
                
              `

              console.log(query2)

               await sequelize.query(query2).then(async v=>{

                        console.log('refund store procedure resoponse : ',v[0][0])

                        if(v[0][0].Code == 100){
                            await MerchentReportTemp.destroy({where: { Transaction_ID } })
                            //merchent..
                            sendNotification("FRFD",Amount,MSISDN,Transaction_ID)
                            //customer...
                            sendNotification("FRFD",Amount,Source_Wallet_ID,Transaction_ID)
                        }
                          
                          return res.status(200).send(OK(v[0][0], v[0][0].Msg, req))

                      }).catch(e=>{

                        console.log('e ', e)
                        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
                    })

            }
            else {

                return res.status(404).send(NOT_FOUND(null, req))
            }
        }).catch(e=>{

            console.log('e ', e)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })

  
    }catch(e){

     console.log('e ', e)
     return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))

    }
  
})

module.exports = router;