
import MerchentProfile from './SW_TBL_PROFILE_MERCHANT'



import SW_TBL_PROFILE_AGENTS from './SW_TBL_PROFILE_AGENTS'
import SW_TBL_PROFILE_CUSTOMERS from './SW_TBL_PROFILE_CUSTOMERS'


import BulkNotification from './BulkNotification'
import BulkNotificationGroup from './BulkNotificationGroup'
import BulkNotificationGroupContact from './BulkNotificationGroupContact'
import BulkNotificationHistory from './BulkNotificationHistory'
import BulkNotificationTemp from './BulkNotificationTemp'


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


BulkNotification.hasMany(BulkNotificationGroupContact, {
  targetKey: 'group_id',
  foreignKey: 'group_id',
  as:'bulk_notification_contact'
})


BulkNotificationGroupContact.belongsTo(BulkNotification, {
  targetKey: 'group_id',
  foreignKey: 'group_id',
  as:'bulk_notification'
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
 
  MerchentProfile,
  BulkNotification,
  BulkNotificationGroup,
  BulkNotificationGroupContact,
  BulkNotificationHistory,
  BulkNotificationTemp,
  SW_TBL_PROFILE_AGENTS,
  SW_TBL_PROFILE_CUSTOMERS
}
