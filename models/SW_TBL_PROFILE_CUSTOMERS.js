import DataTypes from 'sequelize'
import sequelize from '../config/database'

const SW_TBL_PROFILE_CUSTOMERS = sequelize.define(
  'SW_TBL_PROFILE_CUST',
  {
    MSISDN: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },

    Acc_Code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    First_Name: {
      type: DataTypes.STRING(100),
    },

    Last_Name: {
      type: DataTypes.STRING(30),
    },

    Email: {
      type: DataTypes.STRING(100),
    },

    ID_Type: {
      type: DataTypes.INTEGER,
    },

    ID_Number: {
      type: DataTypes.STRING(50),
    },

    PIN: {
      type: DataTypes.STRING(100),
    },

    Wallet_Type: {
      type: DataTypes.SMALLINT,
    },

    Keyword_Commission_ID: {
      type: DataTypes.SMALLINT,
    },

    Status: {
      type: DataTypes.SMALLINT,
    },

    KYC_Status: {
      type: DataTypes.SMALLINT,
    },

    Photo_URL: {
      type: DataTypes.STRING,
    },

    ID_Doc_URL: {
      type: DataTypes.STRING,
    },

    Fail_Attempt: {
      type: DataTypes.SMALLINT,
    },

    Id_Type: {
      type: DataTypes.STRING(20),
      defaultValue: '0',
    },

    Keyword_Charge_Id: {
      type: DataTypes.SMALLINT,
    },

    Gender: {
      type: DataTypes.STRING(20),
    },

    DOB: {
      type: DataTypes.DATEONLY,
    },

    Agent_ID: {
      type: DataTypes.BIGINT,
    },

    Created_By: {
      type: DataTypes.STRING(20),
      defaultValue: '0',
    },

    Created_Date: {
      type: DataTypes.DATEONLY,
    },
    Modified_By: {
      type: DataTypes.STRING(20),
    },
    Modified_Date: {
      type: DataTypes.DATEONLY,
    },
    Approved_By: {
      type: DataTypes.STRING(20),
    },
    Approved_Date: {
      type: DataTypes.DATEONLY,
    },
    Nationality: {
      type: DataTypes.SMALLINT,
    },
    ID_Expiry_Date: {
      type: DataTypes.DATEONLY,
    },
    Permanent_District: {
      type: DataTypes.STRING(50),
    },
    KYC_Approved_Date: {
      type: DataTypes.DATEONLY,
    },
    Front_Id_Image_Url: {
      type: DataTypes.STRING(100),
    },
    Back_Id_Image_Url: {
      type: DataTypes.STRING(100),
    },
    Permanent_City: {
      type: DataTypes.STRING(10),
    },
    Reset_Pin_Attempt: {
      type: DataTypes.SMALLINT,
    },
  },
  {
    tableName: 'SW_TBL_PROFILE_CUST',
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = SW_TBL_PROFILE_CUSTOMERS
