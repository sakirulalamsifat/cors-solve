
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const SW_TBL_PROFILE_MERCHANT = sequelize.define('SW_TBL_PROFILE_MERCHANT', {
    
    MSISDN: {
        type: DataTypes.BIGINT, 
        allowNull: false,
        primaryKey: true
    },
    Merchant_Name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Email: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    MerchantGroup : {
        type: DataTypes.BIGINT
    },
    Status:{
        type: DataTypes.TINYINT
    },
    Acc_Code:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Merchant_Nature:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    ID_Type:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    ID_Number:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Id_Issued_Place:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    ID_Issue_Date:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    ID_Expiry_Date:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    ID_Image:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    License_No:{
        type: DataTypes.TEXT,
        allowNull: true
    },
   Latitude :{
        type: DataTypes.TEXT,
        allowNull: false
    },
    Longitude :{
        type: DataTypes.TEXT,
        allowNull: false
    },
    License_Image:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Website:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Report_Email:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Wallet_Type:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Keyword_Commission_ID:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    Keyword_Charge_Id:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    Merchant_Type:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Bank_Code:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Bank_Account_No:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Last_Sweep_Date:{
        type: DataTypes.DATE,
        allowNull: true
    },
    Sweep_Interval:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    Holding_Amount:{
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    District:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Logo_Image:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    City:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Business_Contact_Name:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Business_Contact_Mobile:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Business_Contact_Phone:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Business_Contact_Email:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Technical_Contact_Name:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Technical_Contact_Mobile:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Technical_Contact_Phone:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Technical_Contact_Email:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Account_Contact_Name:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Account_Contact_Mobile:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Account_Contact_Phone:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Account_Contact_Email:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Created_Date:{
        type: DataTypes.DATE,
        allowNull: true
    },
    Group_Name:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    CommonBusinessName:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    ID_Front_Image:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    ID_Back_Image:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Communice:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Branch_Code:{
        type: DataTypes.STRING(4),
        allowNull: true
    },
    Street_House_No:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    Vat_Setting:{
        type: DataTypes.STRING(10),
        allowNull: true
    },
    Open_Time:{
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Close_Time:{
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Exchange_Rate_Id:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
    
    
}, {
    tableName: 'SW_TBL_PROFILE_MERCHANT',
    freezeTableName: true,
    timestamps: false
});

module.exports = SW_TBL_PROFILE_MERCHANT;
