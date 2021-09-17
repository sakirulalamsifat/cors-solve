
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const SW_TBL_WALLET = sequelize.define('SW_TBL_WALLET', {
    
    Wallet_MSISDN: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    Wallet_Code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Amount: {
        type: DataTypes.DOUBLE,
    },
    Created_By:{
        type: DataTypes.TEXT,
    },
    Created_Date:{
        type: DataTypes.DATE
    },
    Status:{
        type:DataTypes.TINYINT
    },
    Last_Transaction_ID:{
        type:DataTypes.BIGINT
    },
    Last_Transaction_Amount:{
        type: DataTypes.DOUBLE
    },
    Balance_Before:{
        type: DataTypes.DOUBLE
    },
    Modified_By:{
        type:DataTypes.TEXT
    },
    Modified_Date:{
        type: DataTypes.DATE
    },
    Current_Year_Reward_Point:{
        type:DataTypes.BIGINT
    },
    Last_Year_Reward_Point:{
        type:DataTypes.DATE
    }
    
}, {
    tableName: 'SW_TBL_WALLET',
    freezeTableName: true,
    timestamps: false
});

module.exports = SW_TBL_WALLET;
