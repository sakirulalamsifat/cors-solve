import express from 'express'
import jwt from 'jsonwebtoken';
import {checkModule,checkAuthorizaion,hassPasswordGenerate,tokenGenerate,verifyPassword} from '../middleware';
import {CustomerOtherInformationValidator,MobileValidator} from '../middleware/validator'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'
import {MerchentUserAuthTrack,MerchentProfile} from '../models'
import {genRandomInRange,currenttimestamp,SecondDifferenceBetweenToDate} from '../helpers/utilities'
import {Mail} from '../helpers/mail'
import 'dotenv/config'


const router = express.Router()

const notification_title = process.env.notification_title
const otp_valid_time = process.env.otp_valid_time

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

                    Mail({to:'mokbulhossain098@gmail.com',subject:notification_title,text:`OTP is ${OTP}`})
                    if(data.Email){

                      //  Mail({to:data.Email,subject:notification_title,text:OTP})

                    }

                    return res.status(200).send(OK( {is_firsttime:true}, null, req));

                }

                else{

                    await MerchentUserAuthTrack.create({MSISDN:data.MSISDN,fullname:data.Merchant_Name,otp:OTP,otp_created_at:currenttimestamp()})

                    Mail({to:'mokbulhossain098@gmail.com',subject:notification_title,text:`OTP is ${OTP}`})
                    if(data.Email){

                      //  Mail({to:data.Email,subject:notification_title,text:OTP})

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

    let{MSISDN,parent_id,fullname} = user,login_datetime = new Date();
    let is_merchent = parent_id?false:true

    let token = await tokenGenerate({MSISDN,parent_id,fullname,is_merchent,login_datetime})

    return res.status(200).send(OK( {user_info:{MSISDN,fullname,is_merchent},token},null, req));
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
     
              if(info.status){
     
                 somePartOfLogin(info,req,res)
     
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

module.exports = router;