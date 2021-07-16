
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const  MerchentContact = sequelize.define('MerchentContact', {
    
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    MSISDN: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    name:{
        type: DataTypes.STRING(100)
    },
    created_by:{
        type: DataTypes.BIGINT
    }
    
}, {
    tableName: 'MerchentContact',
    freezeTableName: true,
    timestamps: false
});

module.exports = MerchentContact;
