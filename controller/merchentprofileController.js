import express from 'express'
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from '../helpers/responseHelper'
import { MerchentUserAuthTrack, MerchentProfile, SW_TBL_PROFILE_MERCHANT_TEMP, MerchentProfileUpdateConfig } from '../models'
import { hassPasswordGenerate } from '../middleware'
import sequelize from '../config/database'

import path from "path";

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

router.post('/update', async (req, res) => {

  try {
    let { ID_Image = null, License_Image = null, Logo_Image = null, ID_Front_Image = null, ID_Back_Image = null } = await FileUpload(req, res)

    let {
      ID_Number,
      Id_Issued_Place,
      Merchant_Name ,
      Merchant_Nature,
      Wallet_Type,
      
      License_No,
      Website,
      Report_Email,
      Email,
      Bank_Code,
      Bank_Account_No,
      District,
      City,
      Business_Contact_Name,
      Business_Contact_Mobile,
      Business_Contact_Phone,
      Business_Contact_Email,
      Technical_Contact_Name,
      Technical_Contact_Mobile,
      Technical_Contact_Phone,
      Technical_Contact_Email,
      Account_Contact_Name,
      Account_Contact_Mobile,
      Account_Contact_Phone,
      Account_Contact_Email,
      Bank_Address,
      Bank_Swift_Code,
      Bank_Branch_Code,
      Latitude,
      Longitude,
      Communice,
      Street_House_No
    } = req.body

    let ID_Issue_Date = new  Date(), ID_Expiry_Date = new Date();

    let { MSISDN, is_merchent } = req.user_info

    const Temp_Status = 0, Status = 0

    MerchentProfile.findOne({ where: { MSISDN } }).then(async data => {
      console.log(data, 'data')
      let { ID_Image1, License_Image1, Logo_Image1, ID_Front_Image1, ID_Back_Image1 } = data

      ID_Image = ID_Image ? ID_Image : ID_Image1
      License_Image = License_Image ? License_Image : License_Image1
      Logo_Image = Logo_Image ? Logo_Image : Logo_Image1
      ID_Front_Image = ID_Front_Image ? ID_Front_Image : ID_Front_Image1
      ID_Back_Image = ID_Back_Image ? ID_Back_Image : ID_Back_Image1

      const configinfo = await MerchentProfileUpdateConfig.findOne()

      const Created_By = configinfo ? configinfo.createdbyname : 'bussiness1'


      sequelize.query(`EXEC SW_PROC_MERCHANTS_PROFILE 
                      @flag = "U",
                      @MSISDN=${MSISDN},
                      
                      @Merchant_Name = '${Merchant_Name}',
                      @Merchant_Nature =  ${Merchant_Nature},
                      @Wallet_Type = ${Wallet_Type},
                      @ID_Number = '${ID_Number}',
                      @ID_Issue_Date = '${ID_Issue_Date}',
                      @ID_Expiry_Date = '${ID_Expiry_Date}',
                    

                      @License_No = '${License_No}',
                      @License_Image = '${License_Image}',
                      @Website = '${Website}',
                      @Report_Email = '${Report_Email}',
                      @Email = '${Email}',
                      @Bank_Code = '${Bank_Code}',
                    
                      @Bank_Account_No = '${Bank_Account_No}',
                      @District = '${District}',
                      @Logo_Image = '${Logo_Image}',
                      @City = '${City}',
                      @Business_Contact_Name = '${Business_Contact_Name}',
                      @Business_Contact_Mobile = '${Business_Contact_Mobile}',
                      @Business_Contact_Phone = '${Business_Contact_Phone}',
                      @Business_Contact_Email = '${Business_Contact_Email}',
                      @Technical_Contact_Name = '${Technical_Contact_Name}',
                      @Technical_Contact_Mobile  = '${Technical_Contact_Mobile}',
                      @Technical_Contact_Phone = '${Technical_Contact_Phone}',
                      @Technical_Contact_Email = '${Technical_Contact_Email}',
                      @Account_Contact_Name = '${Account_Contact_Name}',
                      @Account_Contact_Mobile = '${Account_Contact_Mobile}',
                      @Account_Contact_Phone = '${Account_Contact_Phone}',
                      @Account_Contact_Email = '${Account_Contact_Email}',
                      @Bank_Address = '${Bank_Address}',
                      @Bank_Swift_Code = '${Bank_Swift_Code}',
                      @Bank_Branch_Code = '${Bank_Branch_Code}',
                      @Status = ${Status},
                      @ID_Front_Image = '${ID_Front_Image}',
                      @ID_Back_Image = '${ID_Back_Image}',
                      @Latitude = '${Latitude}',
                      @Longitude = '${Longitude}',
                      @Communice = '${Communice}'
                      `).then(value => {
          console.log(value, 'val')
        return res.status(200).send(OK(null, null, req));
      }).catch(e => {
        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
      })

    }).catch(e => {
      console.log(e)
      return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    })

  } catch (e){
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

module.exports = router;