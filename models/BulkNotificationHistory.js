import DataTypes from 'sequelize'
import sequelize from '../config/database'

const BulkNotificationHistory = sequelize.define(
  'BulkNotificationHistory',
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_app_notification: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
      allowNull: false,
    },
    is_email_notification: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    is_sms_notification: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('getdate()'),
    },
    approved_by: {
      type: DataTypes.STRING,
    },
    approved_at: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'BulkNotificationHistory',
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = BulkNotificationHistory
