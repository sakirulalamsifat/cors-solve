

import DataTypes from 'sequelize'
import sequelize from '../config/database'

const MerchentReportTemp = sequelize.define('MerchentReportTemp', {
  
    Transaction_ID:{
        type: DataTypes.BIGINT
    },
    Amount:{
        type: DataTypes.DOUBLE,
        defaultValue:0
    },
    Wallet_MSISDN:{
        type: DataTypes.BIGINT
    },
    Keyword:{
        type: DataTypes.TEXT
    },
    Operation:{
        type: DataTypes.TEXT
    },
    OpType:{
        type: DataTypes.TEXT
    },
    Balance_Before:{
        type: DataTypes.DOUBLE,
        defaultValue:0
    },
    Balance_After:{
        type: DataTypes.DOUBLE,
        defaultValue:0
    },
    Status:{
        type: DataTypes.SMALLINT
    },
    Reference_ID:{
        type: DataTypes.TEXT
    },
    Source_Wallet_ID:{
        type: DataTypes.TEXT
    },
    Dest_Wallet_ID:{
        type: DataTypes.TEXT
    },
    Charge_Payer:{
        type: DataTypes.TEXT
    },
    Created_Date:{
        type: DataTypes.DATE
    }
}, {
    tableName: 'MerchentReportTemp',
    freezeTableName: true,
    timestamps: false
});

module.exports = MerchentReportTemp;
