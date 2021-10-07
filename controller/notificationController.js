import express from 'express'
import {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
} from '../helpers/responseHelper'
import {
  BulkNotification,
  BulkNotificationGroup,
  BulkNotificationGroupContact,
  BulkNotificationHistory,
  BulkNotificationTemp,
} from '../models'
import { hassPasswordGenerate } from '../middleware'
import { base64fileUpload } from '../helpers/utilities'
import { encryptString } from '../config/encrypter'
import sequelize from '../config/database'
import 'dotenv/config'
import csv from 'csv-parser'
import fs from 'fs'
import { Sequelize } from 'sequelize'
import 'dotenv/config'

const Op = Sequelize.Op

const router = express.Router()

const publicDir = process.env.publicDir

String.prototype.isNumber = function () {
  return /^\d+$/.test(this)
}

const processcsvfile = async (csvurl,group_id, uploaded_by) => {
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
          MSISDN: row['MSISDN'],
          group_id
        }
        dataforupload.push(rowdata)
      })
      .on('end', () => {
        // BulkPayment.bulkCreate(dataforupload).then(async data=>{
        BulkNotificationGroupContact.bulkCreate(dataforupload)
          .then(async (data) => {
            console.log('CSV file successfully processed')
            resolve(dataforupload)
          })
          .catch((e) => {
            console.log(e)
            resolve([])
          })
      })
  })
}

router.post('/create_notificationgroup', async (req, res) => {
  try {
    const { group_name } = req.body

    BulkNotificationGroup.create({
      group_name: group_name,
    })
      .then((data) => {
        return res.status(200).send(OK(data, null, req))
      })
      .catch((error) => {
        console.log(error)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
      })
  } catch (e) {
    console.log(e);
    return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    
  }
})

router.get('/view_notificationgroup', async (req, res) => {
  
  try {
    BulkNotificationGroup.findAll() .then((data) => {

      return res.status(200).send(OK(data, null, req))
    })
    .catch((error) => {
      console.log(error)
      return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    })
  } catch (e) {
    console.log(e)
    return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

router.post('/delete_notificationgroup', async (req, res) => {
  try {
    let { id } = req.body

    await BulkNotificationGroup.destroy({ where: { id } })

    return res.status(200).send(OK(null, null, req))
  } catch (e) {
    console.log(e)
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

router.post('/edit_notificationgroup', async (req, res) => {
  try {
    let { id } = req.body
    const { groupName } = req.body

    BulkNotificationGroup.update({ group_name: groupName }, { where: { id } })
      .then((data) => {
        return res.status(200).send(OK(null, null, req))
      })
      .catch((e) => {
        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
      })
  } catch (e) {
    console.log(e)
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

router.post('/upload', async (req, res) => {
  try {
    let { report_file, group_id, uploaded_by } = req.body

    if (!report_file) {
      return res
        .status(400)
        .send(BAD_REQUEST(req.i18n.__('filemissing'), null, req))
    }

    let Url = await base64fileUpload(report_file, 'csv')

    if (!Url) {
      return res
        .status(400)
        .send(BAD_REQUEST(req.i18n.__('corruptedfile'), null, req))
    }

    const dataforupload = await processcsvfile(Url,group_id, uploaded_by)

    return res.status(200).send(OK(dataforupload, null, req))

  } catch (e) {

    console.log(e)
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

router.post('/create_BulkNotification', async (req, res) => {
  try {
    const {
      group_id,
      title,
      body,
      is_app_notification,
      is_email_notification,
      is_sms_notification,
      created_by
    } = req.body
    BulkNotificationTemp.create({
      group_id,
      title,
      body,
      is_app_notification,
      is_email_notification,
      is_sms_notification,
      created_by,
      created_at: Sequelize.fn('getdate'),
      approved_by: null,
    })
      .then(async (data) => {
        return res.status(200).send(OK(null, null, req))
      })
      .catch((e) => {
        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
      })
  } catch (e) {
    console.log(e);
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

router.post('/approve_bulknotification', async (req, res) => {
  try {
    let { id, approved_by } = req.body
     BulkNotificationTemp.findOne({
      where: { id },
      order: [['id', 'ASC']],
    }).then(newValue=>{

      if(newValue) {
        let { created_at } = newValue['dataValues']

        if (created_at) {
          created_at = new Date(created_at).toLocaleDateString('fr-CA')
        }

        BulkNotificationHistory.create({ ...newValue['dataValues'],created_at, approved_by })

        BulkNotification.create({ ...newValue['dataValues'], approved_by})
          .then(async (data) => {
            return res.status(200).send(OK(null, null, req))
          })
          .catch((e) => {
            console.log(e)
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
          })        
      }
    }) .catch((e) => {
      console.log(e)
      return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    })


  } catch (e) {

    console.log(e)
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

router.post('/reject_bulknotification', async (req, res) => {
  try {
    let { id, approved_by } = req.body
     BulkNotificationTemp.findOne({
      where: { id },
      order: [['id', 'ASC']],
    }).then(newValue => {

      let { created_at } = newValue['dataValues']

      if (created_at) {
        created_at = new Date(created_at).toLocaleDateString('fr-CA')
      }
      BulkNotificationHistory.create({...newValue['dataValues'],created_at,approved_by})
  
      BulkNotification.destroy({ where: { id } })
        .then(async (data) => {
          return res.status(200).send(OK(null, null, req))
        })
        .catch((e) => {
          console.log(e)
          return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
        })

    }).catch((e) => {
      console.log(e)
      return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    })
    //let { MSISDN : approved_by } = req.user_info
    if (!newValue) {
      return res.status(200).send('no notification with this id found')
    }

    let { created_at } = newValue['dataValues']

    if (created_at) {
      created_at = new Date(created_at).toLocaleDateString('fr-CA')
    }
    BulkNotificationHistory.create({
      ...newValue['dataValues'],
      created_at,
      approved_by
    })
      .then(async (data) => {
        return res.status(200).send(OK(null, null, req))
      })
      .catch((e) => {
        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
      })

    BulkNotificationTemp.destroy({ where: { id } })
      .then(async (data) => {
        return res.status(200).send(OK(null, null, req))
      })
      .catch((e) => {
        console.log(e)
        return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
      })
  } catch (e) {
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

router.get('/pendingNotificationByMe', async (req, res) => {
  try {
    let { MSISDN} = req.user_info
    BulkNotificationTemp.findAll({
      where:{created_by: { [Op.like]: MSISDN }},
      order:[['id', 'DESC']]
    }) .then((data) => {
      return res.status(200).send(data)
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).send(error)
    })
    
    
  } catch (e) {
    console.log(e);
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

router.get('/pendingNotificationNotByMe', async (req, res) => {
  try {
    let { MSISDN} = req.user_info
    BulkNotificationTemp.findAll({
      where:{created_by: { [Op.notLike]: MSISDN }},
      order:[['id', 'DESC']]
    }) .then((data) => {
      return res.status(200).send(data)
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).send(error)
    })
    
    
  } catch (e) {
    console.log(e);
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

module.exports = router
