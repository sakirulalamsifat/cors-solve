
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const MerchentUserAuthTrack = sequelize.define('MerchentUserAuthTrack', {
    MSISDN: {
        type: DataTypes.BIGINT, 
        allowNull: false,
        primaryKey: true,
    },  
    parent_id:{
        type: DataTypes.BIGINT,
        allowNull: true
    },
   
    password: { 
        type: DataTypes.TEXT,
        allowNull: true
    },
    fullname:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    email:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    status:{
        type: DataTypes.SMALLINT,
        defaultValue:1
    },
    ismanager:{
        type: DataTypes.SMALLINT,
        defaultValue: 0
    },
    otp:{
        type: DataTypes.INTEGER
    },
    otp_used:{
        type:DataTypes.TINYINT,
        defaultValue:0
    },
    otp_created_at:{
        type:DataTypes.DATE
    },
    created_at:{
        type:DataTypes.DATE,
        defaultValue:sequelize.literal("getdate()")
    }
    
}, {
    tableName: 'MerchentUserAuthTrack',
    freezeTableName: true,
    timestamps: false
});

module.exports = MerchentUserAuthTrack;
