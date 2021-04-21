
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const SW_VW_MERCHANT_REPORT = sequelize.define('SW_VW_MERCHANT_REPORT', {
    
    Transaction_ID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    Created_Date: {
        type: DataTypes.TEXT,
    },
    Amount: {
        type: DataTypes.DOUBLE,
    },
    Wallet_MSISDN:{
        type: DataTypes.TEXT,
    },
    Keyword:{
        type: DataTypes.TEXT
    },
    Operation:{
        type:DataTypes.TEXT
    },
    OpType:{
        type:DataTypes.TEXT
    },
    Balance_Before:{
        type: DataTypes.DOUBLE
    },
    Balance_After:{
        type:DataTypes.DOUBLE
    },
    Status:{
        type: DataTypes.TINYINT
    },
    Reference_ID:{
        type:DataTypes.TEXT
    },
    Source_Wallet_ID:{
        type:DataTypes.TEXT
    },
    Dest_Wallet_Id:{
        type: DataTypes.BIGINT
    },
    Charging_Party:{
        type: DataTypes.TEXT
    }
    
}, {
    tableName: 'SW_VW_MERCHANT_REPORT',
    freezeTableName: true,
    timestamps: false
});

module.exports = SW_VW_MERCHANT_REPORT;
