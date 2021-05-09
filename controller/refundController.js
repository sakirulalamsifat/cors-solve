import express from 'express'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST,NOT_FOUND} from '../helpers/responseHelper'
import sequelize from '../config/database'
import {MerchentReportTemp} from '../models'

const router = express.Router()

router.post('/merchentrefundtransection', (req, res)=>{

    try{

        console.log(req.body)

        let {Transaction_ID} = req.body

        let {common_id:MSISDN} = req.user_info

        const query = `select * from SW_VW_MERCHANT_REPORT where Dest_Wallet_Id=${MSISDN} and Transaction_ID=${Transaction_ID} `

        sequelize.query( query).then(async report =>{

            if(report[0].length) {

                let {Reference_ID,Amount,Source_Wallet_ID} = report[0][0]

               await sequelize.query(`EXEC SW_PROC_MERCHANT_FULL_REVERSAL 
        
                        @Flag = 'Reversal',
                        @Transaction_ID = ${Transaction_ID},
                        @Reference_ID = '${Reference_ID}',
                        @Charge_Payer = ${Source_Wallet_ID},
                        @New_Charge_Amount = ${Amount}
                        
                      `).then(async v=>{

                          await MerchentReportTemp.destroy({where: { Transaction_ID } })

                          return res.status(200).send(OK(null, null, req))

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