import DataTypes from 'sequelize'
import sequelize from '../config/database'

const SW_TBL_PROFILE_AGENTS = sequelize.define(
  'SW_TBL_PROFILE_AGENTS',
  {
    MSISDN: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    PIN:{
      type: DataTypes.STRING(100),
      allowNull: false,
  },
 

  Acc_Code:{
      type: DataTypes.STRING(10),
      allowNull: false,
  },

  Agent_Name:{
      type: DataTypes.STRING(100)
  },
  

  Agent_Nature: {
      type: DataTypes.STRING(30)
  },
  

  Reg_Type:{
      type: DataTypes.STRING(30)
  },
  

  Agent_Group:{
      type: DataTypes.STRING(30)
  },
  

  Business_Type:{
      type: DataTypes.STRING(30)
  },
  

  Email:{
      type: DataTypes.STRING(100)
  },
  

  District:{
      type: DataTypes.STRING(100)
  },
  

  City:{
      type: DataTypes.STRING(50)
    },
  
  

    Wallet_Type:{
      type: DataTypes.SMALLINT
  },
  

  Keyword_Commission_ID:{
      type: DataTypes.SMALLINT
  },
  

  Keyword_Charge_Id:{
      type: DataTypes.INTEGER
  },
 

  PARENT_MSISDN :{
      type: DataTypes.BIGINT
  },
  

  Status :{
      type: DataTypes.SMALLINT,
      defaultValue : 0
  },
 

  Id_Type:{
      type: DataTypes.STRING(20),
      defaultValue : "0"
  },
  

  Created_By:{
      type: DataTypes.STRING(20)
  },
  

  Approved_By:{
      type: DataTypes.STRING(20)
  },
  

  Branch_Code :{
      type: DataTypes.STRING(4),
      defaultValue : "0"
  },
 

  Communice : {
      type: DataTypes.STRING(100),
      defaultValue : "ROSEAU"
  },
  

  Vat_Setting:{
      type: DataTypes.STRING(10),
      defaultValue : "0"
  },
  

  Exchange_Rate_Id : {
      type: DataTypes.INTEGER,
      defaultValue : 0
  }
 
  },
  {
    tableName: 'SW_TBL_PROFILE_AGENTS',
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = SW_TBL_PROFILE_AGENTS
