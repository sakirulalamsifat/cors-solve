import DataTypes from 'sequelize'
import sequelize from '../config/database'

const SW_TBL_JSONRX_REGISTRATION = sequelize.define('SW_TBL_JSONRX_REGISTRATION', {
    
    MSISDN: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    Device_Id: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Phone_Brand: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Phone_Os: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'SW_TBL_JSONRX_REGISTRATION',
    freezeTableName: true,
    timestamps: false
});

module.exports = SW_TBL_JSONRX_REGISTRATION;