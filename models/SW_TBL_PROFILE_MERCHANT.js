
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
    Status:{
        type: DataTypes.TINYINT
    }
    
}, {
    tableName: 'SW_TBL_PROFILE_MERCHANT',
    freezeTableName: true,
    timestamps: false
});

module.exports = SW_TBL_PROFILE_MERCHANT;
