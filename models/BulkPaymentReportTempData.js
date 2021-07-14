
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const BulkPaymentReportTempData = sequelize.define('BulkPaymentReportTempData', {
    
    Row_ID: {
        type: DataTypes.BIGINT, 
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    
    },  
    Merchant_Wallet_ID:{
        type: DataTypes.BIGINT,
        allowNull: false
    },
   
    Destination_Wallet_ID: { 
        type: DataTypes.STRING(30),
        allowNull: true
    },
    Amount:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    Keyword:{
        type: DataTypes.STRING(5),
        defaultValue:'PMMP'
    },
    Date:{
        type: DataTypes.DATE
    },
    Transaction_ID:{
        type:DataTypes.BIGINT
    },
    Process_date:{
        type:DataTypes.DATE
    },
    Status:{
        type:DataTypes.TINYINT,
       defaultValue:0
    },
    Upload_File_Name:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    Remarks:{
        type:DataTypes.STRING(300),
        allowNull:true
    },
    Created_Date:{
        type:DataTypes.DATE,
        defaultValue:sequelize.literal("getdate()")
    }
    
}, {
    tableName: 'BulkPaymentReportTempData',
    freezeTableName: true,
    timestamps: false
});

module.exports = BulkPaymentReportTempData;
