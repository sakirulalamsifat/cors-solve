import DataTypes from 'sequelize'
import sequelize from '../config/database'

const BulkNotificationGroup = sequelize.define(
  'BulkNotificationGroup',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    group_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: 'BulkNotificationGroup',
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = BulkNotificationGroup
