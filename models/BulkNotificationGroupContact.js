import DataTypes from 'sequelize'
import sequelize from '../config/database'

const BulkNotificationGroupContact = sequelize.define(
  'BulkNotificationGroupContact',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MSISDN: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: 'BulkNotificationGroupContact',
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = BulkNotificationGroupContact
