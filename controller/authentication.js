import express from 'express'
import jwt from 'jsonwebtoken';
import {checkModule,checkAuthorizaion,hassPasswordGenerate,tokenGenerate,verifyPassword} from '../middleware';
import {CustomerOtherInformationValidator,MobileValidator} from '../middleware/validator'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'
import {MerchentUserAuthTrack,MerchentProfile,SmsRequestLog, SW_TBL_JSONRX_REGISTRATION} from '../models'
import {genRandomInRange,currenttimestamp,SecondDifferenceBetweenToDate} from '../helpers/utilities'
import {Mail} from '../helpers/mail'
import 'dotenv/config'
import axios from 'axios'

const router = express.Router()

const notification_title = process.env.notification_title
const otp_valid_time = process.env.otp_valid_time

const sms_api_url = process.env.sms_api_url
const sms_api_username = process.env.sms_api_username
const sms_api_userid = process.env.sms_api_userid
const sms_api_handle = process.env.sms_api_handle
const sms_api_from = process.env.sms_api_from


const SmsApi = (Destination_MSISDN,body)=>{

    //fetch sms api....
    axios.get(`${sms_api_url}?username=${sms_api_username}&userid=${sms_api_userid}&handle=${sms_api_handle}&from=${sms_api_from}&msg=${body}&to=${+Destination_MSISDN}`)
    .then(response=>{
        console.log(response.data)
        let data = response.data
        SmsRequestLog.create({
            MSISDN:Destination_MSISDN.toString(),
            ResponseBody:data
        })
        
    })
    .catch(error=>{
        console.log("sms sending error")
        
    }) 
}

router.post('/check_mobile',checkModule,MobileValidator,async(req,res)=>{

    try{

        let {mobile} = req.body

        MerchentProfile.findOne({where:{MSISDN:mobile}}).then(async data=>{

            if(data){

                const OTP = genRandomInRange(100000,999999)

                const authtrack = await MerchentUserAuthTrack.findOne({where:{MSISDN:mobile}})

                if(authtrack && authtrack.password != null){

                    return res.status(200).send(OK( {is_firsttime:false}, null, req));

                }
                else if(authtrack){

                    await MerchentUserAuthTrack.update({fullname:data.Merchant_Name,otp:OTP,otp_created_at:currenttimestamp()},{where:{MSISDN:mobile}})

                    if(data.Email){

                        Mail({to:data.Email,subject:notification_title,text:`OTP is ${OTP}`})
                        SmsApi(mobile,`OTP is ${OTP}`)

                    }

                    return res.status(200).send(OK( {is_firsttime:true}, null, req));

                }

                else{

                    await MerchentUserAuthTrack.create({MSISDN:data.MSISDN,fullname:data.Merchant_Name,otp:OTP,otp_created_at:currenttimestamp()})

                    if(data.Email){

                        Mail({to:data.Email,subject:notification_title,text:`OTP is ${OTP}`})
                        SmsApi(mobile,`OTP is ${OTP}`)

                    }
                    return res.status(200).send(OK( {is_firsttime:true}, null, req));

                }
             
            }
            else{

                return res.status(400).send(BAD_REQUEST(req.i18n.__('usernotregistered'), null, req));

            }
        }).catch(e=>{

            console.log(e)
            return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })


    }catch(e){
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/check_otp',checkModule,MobileValidator,async(req,res)=>{

    try{

        let {mobile,otp=0} = req.body

        MerchentUserAuthTrack.findOne({where:{MSISDN:mobile}}).then(async data=>{

            if(data){

                var now = new Date();
                var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

                if(otp == data.otp){

                    if ( SecondDifferenceBetweenToDate(data.otp_created_at,utc) <= otp_valid_time){

                        await MerchentUserAuthTrack.update({otp_used:1},{where:{MSISDN:mobile}})

                        return res.status(200).send(OK( null, null, req));

                    }
                    else{

                        return res.status(400).send(BAD_REQUEST(req.i18n.__('otpexpired'), null, req));

                    }

                }

                else{

                    return res.status(400).send(BAD_REQUEST(req.i18n.__('otpdoesnotmatch'), null, req));

                }
             
            }
            else{

                return res.status(400).send(BAD_REQUEST(req.i18n.__('usernotregistered'), null, req));

            }
        }).catch(e=>{

            console.log(e)
            return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })


    }catch(e){
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})


const somePartOfLogin = async(user,req,res,use_temp_password=false)=>{

    let{MSISDN,parent_id,fullname, ismanager} = user,login_datetime = new Date();
    let is_merchent = parent_id?false:true
    let common_id = parent_id || MSISDN

    let token = await tokenGenerate({MSISDN,parent_id,fullname,is_merchent,ismanager,common_id,login_datetime})

    return res.status(200).send(OK( {user_info:{MSISDN,fullname,is_merchent,ismanager},token},null, req));
}

router.post('/set_password',checkModule,MobileValidator,async(req,res)=>{

    try{

        let {mobile,password} = req.body

        const hasspass = await hassPasswordGenerate(password)


        MerchentUserAuthTrack.update({password:hasspass},{where:{MSISDN:mobile}}).then(async data=>{

            const info = await MerchentUserAuthTrack.findOne({where:{MSISDN:mobile},logging:console.log})
           
            if(info){

                somePartOfLogin(info,req,res)

            }else{

                return res.status(400).send(BAD_REQUEST(req.i18n.__('usernotregistered'), null, req));

            }

        }).catch(e=>{

            console.log(e)
            return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })


    }catch(e){
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})


router.post('/login',checkModule,MobileValidator,async(req,res)=>{

    try{

        let {mobile,password} = req.body

        const info = await MerchentUserAuthTrack.findOne({where:{MSISDN:mobile}})

        if(info){

            const is_match = await verifyPassword(password,info.password)

            if(is_match){
     
              if(info.status == 1){
     
                 somePartOfLogin(info,req,res)
     
              }
              else if (status == 2) {

                return res.status(400).send(BAD_REQUEST(req.i18n.__('accountpendingmessage'), null, req));

              }
              else{
     
                 return res.status(400).send(BAD_REQUEST(req.i18n.__('accountlockedmessage'), null, req));
     
              }
     
            }else{
     
             return res.status(400).send(BAD_REQUEST(req.i18n.__('unauthorized'), null, req));
     
            }

        }
        else{

            return res.status(400).send(BAD_REQUEST(req.i18n.__('usernotregistered'), null, req));

        }
        
    }catch(e){

        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

 router.post('/logout',checkAuthorizaion,async(req,res)=>{

    try{
       
        let authorization = req.header("authorization")
        await jwt.destroy(authorization[1])
        return  res.status(200).send(OK(null, null,req))

    }catch(e){
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
 })

 router.post('/forget_password',async(req,res)=>{

    try{



    }catch(e){
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
 })

 // for mobile app..fopr balance..

 router.post('/applogin',checkModule,async(req,res)=>{

    try{

        console.log(req.body)

        let {MSISDN,Device_Id,Phone_Brand,Phone_Os} = req.body
        let login_datetime = new Date();
        SW_TBL_JSONRX_REGISTRATION.findOne({
            where:{
                MSISDN,
                Device_Id,
                Phone_Brand,
                Phone_Os
            }
        }).then(async data=>{

            if(data) {

                let token = await tokenGenerate({MSISDN,parent_id:MSISDN,common_id:MSISDN,applogin:true,login_datetime})

                return res.status(200).send(OK({token},null, req))

            }
            else{
                return res.status(400).send(BAD_REQUEST(req.i18n.__('unauthorized'), null, req));
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

module.exports = router;