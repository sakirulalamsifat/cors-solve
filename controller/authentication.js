import express from 'express'
import {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
} from '../helpers/responseHelper'

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
//const token = 'MTc2Nzk4NzY1Njc6WU1WQjVrY2VjcDZ0R2pRU0U0QlN3Zz09'

router.post('/getOtp', async (req, res) => {
  try {
    const {
      AppVersion,
      DeviceId,
      FLAG,
      FullName,
      Msisdn,
      OsVersion,
      PhoneBrand,
      PhoneOs,
    } = req.body
    const response = await axios.post(
      `http://3.143.176.192:5013/get-app-otp`,
      {
        AppVersion,
        DeviceId,
        FLAG,
        FullName,
        Msisdn,
        OsVersion,
        PhoneBrand,
        PhoneOs,
      },
      {
        headers: {
          'Request-Url': 'http://3.143.176.192:5001/api/JsonRx/AppRegister',
        },
      }
    )

    return res.status(200).send(OK(response.data, null, req))
  } catch (e) {
    console.log(e)
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

router.post('/validateOtp', async (req, res) => {
  try {
    const {
      AppVersion,
      DeviceId,
      FLAG,
      FullName,
      Msisdn,
      OsVersion,
      PhoneBrand,
      PhoneOs,
      otp,
    } = req.body
    const response = await axios.post(
      `http://3.143.176.192:5001/api/JsonRx/ValidateOtp`,
      {
        AppVersion,
        DeviceId,
        FLAG,
        FullName,
        Msisdn,
        OsVersion,
        PhoneBrand,
        PhoneOs,
        otp,
      }
    )
    return res.status(200).send(OK(response.data, null, req))
  } catch (e) {
    console.log(e)
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

router.post('/cashin', async (req, res) => {
  try {
    const {
      Amount,
      Currency,
      CustomerMsisdn,
      DestinationMsisdn,
      Keyword,
      Msisdn,
      PIN,
      token,
      ReferenceId
    } = req.body
    const response = await axios.post(
      `http://3.143.176.192:5001/api/JsonRx/GetAmlConfirmResponse`,
      {
        Amount,
        Currency,
        CustomerMsisdn,
        DestinationMsisdn,
        Keyword,
        Msisdn,
        PIN,
        ReferenceId
      },
      {
        headers: {
          'Authorization': `Basic ${token}`,
        },
      }
    )


    return res.status(200).send(OK(response.data, null, req))
  } catch (e) {
    console.log(e)
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

router.post('/transaction', async (req, res) => {
  try {
    const {
      AppVersion,
      FullName,
      MessageBody,
      OsVersion,
      PhoneBrand,
      PhoneOs,
      msisdn,
      token
    } = req.body
    const response = await axios.post(
      `http://3.143.176.192:5001/api/JsonRx/Transaction`,
      {
        AppVersion,
        FullName,
        MessageBody,
        OsVersion,
        PhoneBrand,
        PhoneOs,
        msisdn,
      },
      {
        headers: {
          'Authorization': `Basic ${token}`,
        },
      }
    )

    return res.status(200).send(OK(response.data, null, req))
  } catch (e) {
    console.log(e)
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

router.post('/getTransactionResult', async (req, res) => {
  try {
    const {
      AppVersion,
      FullName,
      Msisdn,
      OsVersion,
      PhoneBrand,
      PhoneOs,
      TransactionId,
      token
    } = req.body
    const response = await axios.post(
      `http://3.143.176.192:5001/api/JsonRx/GetTransactionResult`,
      {
        AppVersion,
        FullName,
        Msisdn,
        OsVersion,
        PhoneBrand,
        PhoneOs,
        TransactionId,
      },
      {
        headers: {
          'Authorization': `Basic ${token}`,
        },
      }
    )

    return res.status(200).send(OK(response.data, null, req))
  } catch (e) {
    console.log(e)
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

module.exports = router
