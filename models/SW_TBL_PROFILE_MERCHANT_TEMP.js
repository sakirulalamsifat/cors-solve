

import DataTypes, { BIGINT, TEXT } from 'sequelize'
import sequelize from '../config/database'

const SW_TBL_PROFILE_MERCHANT_TEMP = sequelize.define('SW_TBL_PROFILE_MERCHANT_TEMP', {
    RowId:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    MSISDN: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    Acc_Code:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    Merchant_Name:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    Merchant_Nature:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    ID_Type:{
        type: DataTypes.TEXT,
    },
    ID_Number:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    Id_Issued_Place:{
        type: DataTypes.TEXT,
    },
    
    
    //new add -- neew to add in Database 
    // Id_Issued_Date:{
    //     type: DataTypes.TEXT
    // },
    // Business_Type:{
    //     type:DataTypes.TEXT
    // },
    // Holding_Ammount:{
    //     type:DataTypes.DOUBLE
    // },


    ID_Expiry_Date:{
        type: DataTypes.TEXT,
    },
    ID_Image:{
        type: DataTypes.TEXT,
    },
    License_No:{
        type: DataTypes.TEXT
    },
    License_Image:{
        type: DataTypes.TEXT
    },
    Website:{
        type: DataTypes.TEXT
    },
    Report_Email:{
        type: DataTypes.TEXT,
    },
    Email:{
        type: DataTypes.TEXT,
    },
    PIN:{
        type: DataTypes.TINYINT
    },
    Status:{
        type: DataTypes.TINYINT
    },
    Wallet_Type:{
        type: DataTypes.TINYINT,
        allowNullL : false
    },
    Keyword_Commission_ID:{
        type: DataTypes.TINYINT,
    },
    Keyword_Charge_Id :{
        type: DataTypes.TINYINT
    },
    Merchant_Type:{
        type: DataTypes.TEXT
    },
    IsCashOut:{
        type: DataTypes.TINYINT
    },
    Bank_Code:{
        type: DataTypes.TEXT,
    },

    //new Added
    Bank_Account_No:{
        type: DataTypes.TEXT
    },
    Last_Sweep_Date:{
        type: DataTypes.DATE,
    },
    Sweep_Interval :{
        type: DataTypes.TINYINT
    },
    Holding_Amount:{
        type: DataTypes.INTEGER
    },
    District:{
        type: DataTypes.TEXT
    },
    Logo_Image:{
        type: DataTypes.TEXT
    },
    City:{
        type: DataTypes.TEXT,
        allowNullL : false
    },
    Business_Contact_Name:{
        type: DataTypes.TEXT,
    },
    Business_Contact_Mobile :{
        type: DataTypes.TEXT
    },

    //newadded
    Business_Contact_Phone:{
        type:DataTypes.TEXT
    },
    Business_Contact_Email:{
        type: DataTypes.TEXT
    },
    Technical_Contact_Name:{
        type: DataTypes.TEXT
    },
    Technical_Contact_Mobile:{
        type: DataTypes.TEXT,
    },
    Technical_Contact_Phone:{
        type: DataTypes.TEXT,
    },
    Technical_Contact_Email :{
        type: DataTypes.TEXT
    },
    Account_Contact_Name:{
        type: DataTypes.TEXT
    },
    Account_Contact_Mobile:{
        type: DataTypes.TEXT
    },
    Account_Contact_Phone:{
        type: DataTypes.TEXT
    },
    Account_Contact_Email:{
        type: DataTypes.TEXT,
    },
    Bank_Address:{
        type: DataTypes.TEXT,
    },
    Bank_Swift_Code :{
        type: DataTypes.TEXT
    },
    Open_Time:{
        type: DataTypes.TEXT
    },
    Close_Time:{
        type: DataTypes.TEXT
    },
    Bank_Branch_Code:{
        type: DataTypes.TEXT,
    },
    Merchant_As_Bank_Account_No:{
        type: DataTypes.TEXT,
    },
    Created_By :{
        type: DataTypes.TEXT
    },
    Created_Date:{
        type: DataTypes.DATE
    },
    Modified_By:{
        type: DataTypes.TEXT
    },
    Modified_Date:{
        type: DataTypes.DATE
    },
    Approved_By:{
        type: DataTypes.TEXT,
    },
    Approved_Date:{
        type: DataTypes.DATE,
    },
    Menu_Code :{
        type: DataTypes.TEXT
    },
    Is_Visible_On_App:{
        type: DataTypes.TINYINT
    },
    Temp_Status:{
        type: DataTypes.TINYINT
    },
    Operation:{
        type: DataTypes.TEXT,
    },
    Reject_Remarks:{
        type: DataTypes.TEXT,
    },
    Fail_Attempt :{
        type: DataTypes.TINYINT,
        allowNull:false
    },
    Is_Agent_Payment:{
        type: DataTypes.TINYINT
    },
    Is_Customer_Payment:{
        type: DataTypes.TINYINT
    },
    Group_Name:{
        type: DataTypes.TEXT
    },
    Is_Web_Login:{
        type: DataTypes.TINYINT
    },
    CommonBusinessName:{
        type: DataTypes.TEXT
    },
    Enable_Sms_Notification:{
        type: DataTypes.TINYINT,
    },
    ServiceUrl:{
        type: DataTypes.DATE,
    },
    Exchange_Rate :{
        type: DataTypes.DECIMAL
    },
    ID_Front_Image:{
        type: DataTypes.BIGINT
    },
    ID_Back_Image:{
        type: DataTypes.TINYINT
    },
    Latitude:{
        type: DataTypes.TEXT,
    },
    Longitude:{
        type: DataTypes.TEXT,
    },
    Communice :{
        type: DataTypes.TINYINT,
        allowNull:false
    },
    Reward:{
        type: DataTypes.INTEGER
    },
    Branch_Code:{
        type: DataTypes.TEXT
    },
    Vat_Setting:{
        type: DataTypes.TEXT
    },

    ///
    Total_Merchant_In_Group:{
        type: DataTypes.INTEGER,
    },
    Is_Single_Number :{
        type: DataTypes.TINYINT,
    },
    Exchange_Rate_Id:{
        type: DataTypes.INTEGER
    },
}, {
    tableName: 'SW_TBL_PROFILE_MERCHANT_TEMP',
    freezeTableName: true,
    timestamps: false
});

module.exports = SW_TBL_PROFILE_MERCHANT_TEMP;

// iscashout, Holding_Amount Is_Visible_On_App,, Is_Agent_Payment
//Is_Customer_Payment Is_Web_Login Enable_Sms_Notification Is_Single_Number