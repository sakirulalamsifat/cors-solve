import express from 'express'
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from '../helpers/responseHelper'
import { MerchentUserAuthTrack, MerchentProfile, SW_TBL_PROFILE_MERCHANT_TEMP } from '../models'
import { hassPasswordGenerate } from '../middleware'
import 'dotenv/config'


const router = express.Router()


router.get('/list', async (req, res) => {

    try {

        let { common_id: MSISDN } = req.user_info

        MerchentUserAuthTrack.findAll({ where: { parent_id: MSISDN } }).then(async data => {

            return res.status(200).send(OK(data, null, req));


        }).catch(e => {

            console.log(e)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })


    } catch (e) {
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/create_user', async (req, res) => {

    try {
        let { mobile, fullname, password, email } = req.body

        let { common_id: MSISDN } = req.user_info

        const info = await MerchentUserAuthTrack.findOne({ where: { MSISDN: mobile } })

        if (info) {

            return res.status(400).send(BAD_REQUEST(req.i18n.__('alreadyregisterd'), null, req));

        }

        const hasspass = await hassPasswordGenerate(password)

        MerchentUserAuthTrack.create({ MSISDN: mobile, fullname, password: hasspass, email, parent_id: MSISDN }).then(async data => {

            return res.status(200).send(OK(null, null, req));


        }).catch(e => {
            console.log(e)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })


    } catch (e) {
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.get('/active_user', async (req, res) => {

    try {

        let { mobile } = req.body

        let { common_id: MSISDN } = req.user_info

        const info = await MerchentUserAuthTrack.findOne({ where: { MSISDN: mobile, parent_id: MSISDN } })

        if (!info) {

            return res.status(400).send(BAD_REQUEST(req.i18n.__('usernotregistered'), null, req));

        }


        MerchentUserAuthTrack.update({ status: 1 }, { where: { MSISDN: mobile, parent_id: MSISDN } }).then(async data => {

            return res.status(200).send(OK(null, null, req));


        }).catch(e => {

            console.log(e)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })


    } catch (e) {
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.get('/inactive_user', async (req, res) => {

    try {

        let { mobile } = req.body

        let { common_id: MSISDN } = req.user_info

        const info = await MerchentUserAuthTrack.findOne({ where: { MSISDN: mobile, parent_id: MSISDN } })

        if (!info) {

            return res.status(400).send(BAD_REQUEST(req.i18n.__('usernotregistered'), null, req));

        }


        MerchentUserAuthTrack.update({ status: 0 }, { where: { MSISDN: mobile, parent_id: MSISDN } }).then(async data => {

            return res.status(200).send(OK(null, null, req));


        }).catch(e => {

            console.log(e)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })


    } catch (e) {
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/addtempmerchentprofile', (req, res) => {
    try{
    let {
        MSISDN,
        Acc_Code,
        Merchant_Name,
        Merchant_Nature,
        // ID_Type,
        ID_Number,
        // Id_Issued_Place,
        // ID_Issue_Date,
        // ID_Expiry_Date,
        // ID_Image,
        // License_No,
        // License_Image,
        // Website,
        // Report_Email,
        // Email,
        // PIN,
        // Status,
        Wallet_Type,
        // Keyword_Commission_ID,
        // Keyword_Charge_Id,
        // Merchant_Type,
        // IsCashOut,
        // Bank_Code,
        // Bank_Account_No,
        // Last_Sweep_Date,
        // Sweep_Interval,
        // Holding_Amount,
        // District,
        // Logo_Image,
        City,
        // Business_Contact_Name,
        // Business_Contact_Mobile,
        // Business_Contact_Phone,
        // Business_Contact_Email,
        // Technical_Contact_Name,
        // Technical_Contact_Mobile,
        // Technical_Contact_Phone,
        // Technical_Contact_Email,
        // Account_Contact_Name,
        // Account_Contact_Mobile,
        // Account_Contact_Phone,
        // Account_Contact_Email,
        // Bank_Address,
        // Bank_Swift_Code,
        // Open_Time,
        // Close_Time,
        // Bank_Branch_Code,
        // Merchant_As_Bank_Account_No,
        // Created_By,
        // Created_Date,
        // Modified_By,
        // Modified_Date,
        // Approved_By,
        // Approved_Date,
        // Menu_Code,
        // Is_Visible_On_App,
        // Temp_Status,
        // Operation,
        // Reject_Remarks,
        Fail_Attempt,
        // Is_Agent_Payment,
        // Is_Customer_Payment,
        // Group_Name,
        // Is_Web_Login,
        // CommonBusinessName,
        // Enable_Sms_Notification,
        // ServiceUrl,
        // Exchange_Rate,
        // ID_Front_Image,
        // ID_Back_Image,
        // Latitude,
        // Longitude,
        Communice,
        // Street_House_No,
        // Reward,
        // Branch_Code,
        // Vat_Setting,
        // Total_Merchant_In_Group,
        // Is_Single_Number,
        // Exchange_Rate_Id
    } = req.body;

    // console.log(req.body)
    console.log(req.body)
    // let pmt = new PROFILE_MERCHANT_TEMP({
    //     ...body
    // })

    // console.log('pmt')

    // pmt.save().then(data=>{
    //     console.log(data, 'Here data')
    // })
    // .catch(err=>{
    //     console.log(err)
    // })
    SW_TBL_PROFILE_MERCHANT_TEMP.create({ ...req.body }).then(data=>{
        if( data ){
            return res.status(200).send(OK(data, null, req));
        }
    }).catch(err=>{
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    })

}
catch{
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
}
})

module.exports = router;