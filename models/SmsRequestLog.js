

import DataTypes from 'sequelize'
import sequelize from '../config/database'

const SmsRequestLog = sequelize.define('SmsRequestLog', {
    ID:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    MSISDN: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ResponseBody:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_at:{
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'SmsRequestLog',
    freezeTableName: true,
    timestamps: false
});

module.exports = SmsRequestLog;
