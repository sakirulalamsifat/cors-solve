import DataTypes from 'sequelize'
import sequelize from '../config/database'

const BulkNotification = sequelize.define(
  'BulkNotification',
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
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATEONLY,
      defaultValue: sequelize.literal('getdate()'),
    },
    approved_by: {
      type: DataTypes.STRING,
    },
    approved_at: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    tableName: 'BulkNotification',
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = BulkNotification
