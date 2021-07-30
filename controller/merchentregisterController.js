import express from 'express'
import path from "path"
import sequelize from '../config/database'
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from '../helpers/responseHelper'
import { SW_TBL_PROFILE_MERCHANT_TEMP } from '../models'


require('dotenv').config()

var fs = require('fs');
const router = express.Router()

const imageupstorageLocation = process.env.imageupstorageLocation

const fileName = OldName => {

    return Date.now() + path.extname(OldName);


};

const DayWithLeadingZero = (d) => (d.getUTCDate() < 10 ? '0' : '') + d.getUTCDate()

const DayOfMonthWithLeadingZero = (d) => ((d.getUTCMonth() + 1) < 10 ? '0' : '') + (d.getUTCMonth() + 1)

const CurrentYearMonthDay = () => {
    var dateObj = new Date();
    var month = DayOfMonthWithLeadingZero(dateObj); //months from 01-12
    var day = DayWithLeadingZero(dateObj);
    var year = dateObj.getUTCFullYear();

    return { year, month, day }

}
const FolderStructure = (OldName) => {

    return new Promise(async (resolve, reject) => {

        let { year, month, day } = CurrentYearMonthDay()

        console.log(year, month, day)

        const filename = `${Date.now()}_${year}-${month}-${day}${path.extname(OldName)}`

        const foldername = `${imageupstorageLocation}/${year}/${month}/${day}`

        if (!fs.existsSync(`${imageupstorageLocation}/${year}`)) {
            await fs.mkdirSync(`${imageupstorageLocation}/${year}`);
            await fs.mkdirSync(`${imageupstorageLocation}/${year}/${month}`);
            await fs.mkdirSync(`${imageupstorageLocation}/${year}/${month}/${day}`);
            resolve({ filename, foldername })
        }
        else if (!fs.existsSync(`${imageupstorageLocation}/${year}/${month}`)) {
            await fs.mkdirSync(`${imageupstorageLocation}/${year}/${month}`);
            await fs.mkdirSync(`${imageupstorageLocation}/${year}/${month}/${day}`);
            resolve({ filename, foldername })
        }
        else if (!fs.existsSync(`${imageupstorageLocation}/${year}/${month}/${day}`)) {
            await fs.mkdirSync(`${imageupstorageLocation}/${year}/${month}/${day}`);
            resolve({ filename, foldername })
        }

        else {

            resolve({ filename, foldername })
        }

    })
}

const allowedFileTypes = process.env.allowedFileTypes

const FileUpload = async (req, res) => {

    return new Promise(async (resolve, reject) => {

        try {

            if (req.files) {

                const file = [];
                const filesNamesArray = [];
                const keyname = []
                let index = 0, errorresponse = {}, iserror = false

                if (req.files['Image_File']) {

                    file.push(req.files['Image_File']);
                    keyname.push('Image_File')

                }

                if (req.files['ID_Image']) {

                    file.push(req.files['ID_Image']);
                    keyname.push('ID_Image')

                }

                if (req.files['License_Image']) {

                    file.push(req.files['License_Image']);
                    keyname.push('License_Image')

                }

                if (req.files['Logo_Image']) {

                    file.push(req.files['Logo_Image']);
                    keyname.push('Logo_Image')

                }

                if (req.files['ID_Front_Image']) {

                    file.push(req.files['ID_Front_Image']);
                    keyname.push('ID_Front_Image')

                }

                if (req.files['ID_Back_Image']) {

                    file.push(req.files['ID_Back_Image']);
                    keyname.push('ID_Back_Image')

                }

                for (const fileElement of file) {

                    if (!allowedFileTypes.includes(fileElement.name.split(".").pop())) {

                        errorresponse[keyname[index]] = `file formates are ${allowedFileTypes.toString()}`
                        iserror = true

                    }
                    index++

                }

                if (iserror) {

                    return res.status(400).send(BAD_REQUEST(null, errorresponse, req));
                }

                let fileElement, fileurl = null, i = 0, filemaneobj = {}, singlefile;
                index = 0

                for (let i = 0; i < file.length; i++) {

                    singlefile = file[i]

                    let { filename, foldername } = await FolderStructure(file[i].name)

                    singlefile.mv(`${foldername}/` + filename, function (err) {

                        // res.writeHead(200, {"Content-Type": "text/plain"});

                        if (err) {
                            console.log(err);

                        } else {
                            console.log("uploaded ", filename);

                        }

                    });

                    filemaneobj[keyname[index]] = filename

                    index++

                }

                resolve(filemaneobj)

            }
            else {

                console.log('no file')
                resolve({});
            }

        } catch (e) {
            console.log('e ', e)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        }
    })
}

// router.get('/aluser', (req, res)=>{
//   MerchentProfile.findAll({ where: { } }).then(user=>{
//     res.json(user)
//   })
// })

router.post('/register', async (req, res) => {

    try {
        let { ID_Image = null, License_Image = null, Logo_Image = null, ID_Front_Image = null, ID_Back_Image = null } = await FileUpload(req, res)

        let {
            MSISDN,
            Merchant_Name,
            Merchant_Nature,
            ID_Type = null,
            ID_Number = null,
            Id_Issued_Place = null,
            ID_Issue_Date = null,
            ID_Expiry_Date = null,
            // ID_image,
            License_No = null,
            // License_image,
            Business_Type,
            Email,
            Bank_Code,
            Bank_Account_No,
            Sweep_Interval,
            District,
            // Logo_Image,
            Bank_Address,
            Bank_Swift_Code,
            // ID_Front_image,
            // ID_Back_Image,
            Latitude,
            Longitude,
            Communice,
            Street_House_No,
            Branch_Code,
            CommonBusinessName,
            City
        } = req.body

        console.log(req.body.Id_Issued_Date)

        const currentDate = sequelize.literal("getdate()")

        Sweep_Interval = +Sweep_Interval
        var addingdaysformattedinsql = sequelize.literal("GETDATE() + " + Sweep_Interval)


        let Acc_Code = 'M' + Math.floor((Math.random() * 1000000) + 1).toString(),
            Status = 0,
            Wallet_Type = 107,
            Keyword_Commission_ID = 1,
            Keyword_Charge_Id = 1,
            Merchant_Type = 'Normal',
            IsCashOut = 0,
            Last_Sweep_Date = addingdaysformattedinsql,
            Holding_Ammount = 0,
            Created_By = 'business1',
            Created_Date = currentDate,
            Modified_By = 'business2',
            Reward = 1,
            Vat_Setting = '0',
            Is_Single_Number = 0,
            Is_visible_On_App = 0,
            Operation = 'Insert',
            Is_Agent_Payment = 0,
            Menu_Code = null,
            Is_Web_Login = 1,
            Enable_Sms_Notification = 1,
            Fail_Attempt = 0,
            Temp_Status = 0

        SW_TBL_PROFILE_MERCHANT_TEMP.create({
            MSISDN,
            Merchant_Name,
            Merchant_Nature,
            ID_Type,
            ID_Number,
            Id_Issued_Place,
            //need to add in database
            ID_Issue_Date,
            ID_Expiry_Date,
            ID_Image,
            License_No,
            License_Image,
            //need to add in database
            // Business_Type,
            Email,
            Bank_Code,
            Bank_Account_No,
            Sweep_Interval,
            District,
            Logo_Image,
            Bank_Address,
            Bank_Swift_Code,
            ID_Front_Image,
            ID_Back_Image,
            Latitude,
            Longitude,
            Communice,
            Street_House_No,
            Branch_Code,
            CommonBusinessName,
            City,

            Acc_Code,
            Status,
            Wallet_Type,
            Keyword_Commission_ID,
            Keyword_Charge_Id,
            Merchant_Type,
            IsCashOut,
            Last_Sweep_Date,
            //need to add on database
            // Holding_Ammount,
            Created_By,
            Created_Date,
            Modified_By,
            // Modified_Date,
            Reward,
            Vat_Setting,
            Is_Single_Number,
            Is_visible_On_App,
            Operation,
            Is_Agent_Payment,
            Menu_Code,
            Is_Web_Login,
            Enable_Sms_Notification,
            Fail_Attempt,
            Temp_Status
        }).then(value => {
            console.log(value)
            return res.status(200).send(OK(value, null, req));
        }).catch(error => {
            console.log(error)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })

    } catch (e) {
        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/v2/register', async (req, res) => {

    try {
        //console.log("Hello world")
        // let { ID_Image = null, License_Image = null, Logo_Image = null, ID_Front_Image = null, ID_Back_Image = null } = await FileUpload(req, res)

        let {
            MSISDN,
            Merchant_Name,
            Merchant_Nature,
            ID_Type = null,
            ID_Number = null,
            Id_Issued_Place = null,
            ID_Issue_Date = null,
            ID_Expiry_Date = null,
            //image need to upload
            ID_image = null,
            License_image = null,
            Logo_Image = null,
            ID_Front_image = null,
            ID_Back_Image = null,
            //image need to upload

            // new
            Account_Contact_Name = null,
            Website = null,
            Facebook = null,
            Instagram=null,
            Twitter = null,
            BriefDescription=null,
            TelephoneNo=null,
            MerchantRegistrationReference = null,
            AuthorizedMerchantsFullName = null,
            ProjectedValueofTransactions = null,
            Principals = null,
            BusinessOwnershipStructure = null,
            CreditUnionMembership = null,
            CreditUnionDepositAccount = null,
            //new
            License_No = null,
            Business_Type,
            Email,
            Bank_Code,
            Bank_Account_No,
            Sweep_Interval,
            District,
            Bank_Address,
            Bank_Swift_Code,
            Latitude,
            Longitude,
            Communice,
            Street_House_No,
            Branch_Code,
            CommonBusinessName,
            City
        } = req.body

        console.log(req.body.Id_Issued_Date)

        const currentDate = sequelize.literal("getdate()")

        Sweep_Interval = +Sweep_Interval
        var addingdaysformattedinsql = sequelize.literal("GETDATE() + " + Sweep_Interval)


        let Acc_Code = 'M' + Math.floor((Math.random() * 1000000) + 1).toString(),
            Status = 0,
            Wallet_Type = 107,
            Keyword_Commission_ID = 1,
            Keyword_Charge_Id = 1,
            Merchant_Type = 'Normal',
            IsCashOut = 0,
            Last_Sweep_Date = addingdaysformattedinsql,
            Holding_Ammount = 0,
            Created_By = 'business1',
            Created_Date = currentDate,
            Modified_By = 'business2',
            Reward = 1,
            Vat_Setting = '0',
            Is_Single_Number = 0,
            Is_visible_On_App = 0,
            Operation = 'Insert',
            Is_Agent_Payment = 0,
            Menu_Code = null,
            Is_Web_Login = 1,
            Enable_Sms_Notification = 1,
            Fail_Attempt = 0,
            Temp_Status = 0

        SW_TBL_PROFILE_MERCHANT_TEMP.create({
            MSISDN,
            Merchant_Name,
            Merchant_Nature,
            PrimaryContactName : Account_Contact_Name,
            ID_Type,
            ID_Number,
            Id_Issued_Place,
            //need to add in database
            ID_Issue_Date,
            ID_Expiry_Date,
            ID_image,
            License_No,
            License_image,
            //need to add in database

            // new
            Website,
            Facebook,
            Instagram,
            Twitter,
            BriefDescription,
            TelephoneNo,
            MerchantRegistrationReference,
            AuthorizedMerchantsFullName,
            ProjectedValueofTransactions,
            Principals,
            BusinessOwnershipStructure,
            CreditUnionMembership,
            CreditUnionDepositAccount,

            //new
            // Business_Type,
            Email,
            Bank_Code,
            Bank_Account_No,
            Sweep_Interval,
            District,
            Logo_Image,
            Bank_Address,
            Bank_Swift_Code,
            ID_Front_image,
            ID_Back_Image,
            Latitude,
            Longitude,
            Communice,
            Street_House_No,
            Branch_Code,
            CommonBusinessName,
            City,

            Acc_Code,
            Status,
            Wallet_Type,
            Keyword_Commission_ID,
            Keyword_Charge_Id,
            Merchant_Type,
            IsCashOut,
            Last_Sweep_Date,
            //need to add on database
            // Holding_Ammount,
            Created_By,
            Created_Date,
            Modified_By,
            // Modified_Date,
            Reward,
            Vat_Setting,
            Is_Single_Number,
            Is_visible_On_App,
            Operation,
            Is_Agent_Payment,
            Menu_Code,
            Is_Web_Login,
            Enable_Sms_Notification,
            Fail_Attempt,
            Temp_Status
        }).then(value => {
            console.log(value)
            return res.status(200).send(OK(value, null, req));
        }).catch(error => {
            console.log(error)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })

    } catch (e) {
        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

router.post('/mlajan_fileupload', async(req, res) => {

    try {

        let { Image_File = null} = await FileUpload(req, res)

        return res.status(200).send(OK(Image_File, null, req))

    }  catch (e) {

        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
})

module.exports = router;