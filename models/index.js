import MerchentUserAuthTrack from './MerchentUserAuthTrack'
import MerchentProfile from './SW_TBL_PROFILE_MERCHANT'
import BulkPayment from './SW_TBL_BULK_PAYMENT'
import BulkPaymentReportTempData from './BulkPaymentReportTempData'
import SmsRequestLog from './SmsRequestLog'
import SW_TBL_PROFILE_MERCHANT_TEMP from './SW_TBL_PROFILE_MERCHANT_TEMP'
import MerchentProfileUpdateConfig from './MerchentProfileUpdateConfig'

import SW_TBL_CITY from './SW_TBL_CITY'
import SW_TBL_COUNTRY from './SW_TBL_COUNTRY'
import SW_TBL_DISTRICT from './SW_TBL_DISTRICT'
import SW_TBL_ID_TYPE from './SW_TBL_ID_TYPE'
import SW_TBL_WALLET from './SW_TBL_WALLET'
import MerchentBusinessType from './MerchentBusinessType'
import MerchentNature from './MerchentNature'
import SW_VW_MERCHANT_REPORT from './SW_VW_MERCHANT_REPORT'
import MerchentReportTemp from './MerchentTransectionReportTemp'
import SW_TBL_JSONRX_REGISTRATION from './SW_TBL_JSONRX_REGISTRATION'
import BulkPaymentReportTemp from './BulkPaymentReportTemp'

import MerchentContact from './MerchentContact'
import MerchentContactGroup from './MerchentContactGroup'
import MerchentContactGroupLink from './MerchentContactGroupLink'
import CreditUnionMembership from './CreditUnionMembership'
import MerchentAgentProfileMap from './MerchentAgentProfileMap'

import BulkNotification from './BulkNotification'
import BulkNotificationGroup from './BulkNotificationGroup'
import BulkNotificationGroupContact from './BulkNotificationGroupContact'
import BulkNotificationHistory from './BulkNotificationHistory'
import BulkNotificationTemp from './BulkNotificationTemp'

MerchentContact.hasMany(MerchentContactGroupLink, {
  targetKey: 'id',
  foreignKey: 'contact_id',
  as: 'merchent_contact_group_link',
})

MerchentContactGroupLink.belongsTo(MerchentContact, {
  targetKey: 'id',
  foreignKey: 'contact_id',
  as: 'merchent_contact',
})

BulkNotificationGroup.hasMany(BulkNotificationGroupContact, {
  targetKey: 'id',
  foreignKey: 'group_id',
  as:'bulk_notification_group_contact'
})

BulkNotificationGroupContact.belongsTo(BulkNotificationGroup, {
  targetKey: 'id',
  foreignKey: 'group_id',
  as:'group_contact'
})

// BulkNotificationGroup.hasMany(BulkNotificationTemp, {
//   targetKey: 'id',
//   foreignKey: 'group_id',
//   as:'bulk_notification_group_contact'
// })

// BulkNotificationTemp.belongsTo(BulkNotificationGroup, {
//   targetKey: 'id',
//   foreignKey: 'group_id',
//   as:'group_contact'
// })

module.exports = {
  CreditUnionMembership,
  SW_TBL_JSONRX_REGISTRATION,
  MerchentUserAuthTrack,
  MerchentProfile,
  BulkPayment,
  SmsRequestLog,
  MerchentReportTemp,
  BulkPaymentReportTempData,
  SW_TBL_PROFILE_MERCHANT_TEMP,
  MerchentProfileUpdateConfig,
  BulkPaymentReportTemp,
  SW_TBL_CITY,
  SW_TBL_COUNTRY,
  SW_TBL_DISTRICT,
  SW_TBL_ID_TYPE,
  SW_TBL_WALLET,
  MerchentBusinessType,
  MerchentNature,
  SW_VW_MERCHANT_REPORT,
  MerchentContact,
  MerchentContactGroup,
  MerchentContactGroupLink,
  BulkNotification,
  BulkNotificationGroup,
  BulkNotificationGroupContact,
  BulkNotificationHistory,
  BulkNotificationTemp,
}
