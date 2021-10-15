import express from 'express'
import {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
} from '../helpers/responseHelper'
import {
  MerchentProfile,
  BulkNotification,
  BulkNotificationGroupContact,
  SW_TBL_PROFILE_AGENTS,
  SW_TBL_PROFILE_CUSTOMERS,
} from '../models'

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

const mlajan_notification_api_base_url =
  process.env.mlajan_notification_api_base_url

const SmsApi = (Destination_MSISDN, body, sms, email) => {
  //fetch sms api....
  axios.post(`${mlajan_notification_api_base_url}/api/smsRouter`, {
    Msisdn: Destination_MSISDN,
    Message: body,
    Keyword: 'AOTP',
    SendSms: sms,
    sendemail: email,
  })
}

router.post('/get_message_info', async (req, res) => {
  try {
    const { id } = req.body
    const storedData = []
    let smsFlag = `Y`
    let emailFlag = true
    const notificationData = await BulkNotification.findOne({ where: { id } })

    if (notificationData) {
      if (notificationData.is_sms_notification == 1) {
        smsFlag = 'Y'
      } else {
        smsFlag = 'N'
      }

      if (notificationData.is_email_notification == 1) {
        emailFlag = true
      } else {
        emailFlag = false
      }
      if (notificationData.group_id == 1) {
        const merchentMSISDN = await MerchentProfile.findAll({})

        merchentMSISDN.map((data) => {
          SmsApi(data.MSISDN, notificationData.body, smsFlag, emailFlag)
        })
      }

      if (notificationData.group_id == 2) {
        const agentMSISDN = await SW_TBL_PROFILE_AGENTS.findAll({})

        agentMSISDN.map((data) => {
          SmsApi(data.MSISDN, notificationData.body, smsFlag, emailFlag)
        })
      }

      if (notificationData.group_id == 3) {
        const customerMSISDN = await SW_TBL_PROFILE_CUSTOMERS.findAll({})

        customerMSISDN.map((data) => {
          SmsApi(data.MSISDN, notificationData.body, smsFlag, emailFlag)
        })
      } else {
        const otherMSISDN = await BulkNotificationGroupContact.findAll({
          where: { group_id: notificationData.group_id },
        })
        otherMSISDN.map((data) => {
          SmsApi(data.MSISDN, notificationData.body, smsFlag, emailFlag)
        })
      }

      res.status(200).send(OK('Notification Sent', null, req))
    } else {
      console.log('notification ID does not exist')
      res
        .status(400)
        .send(BAD_REQUEST('notification ID does not exist', null, req))
    }
  } catch (e) {
    console.log(e)
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

module.exports = router
