
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const  MerchentContact = sequelize.define('MerchentContact', {
    
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    MSISDN: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    name:{
        type: DataTypes.TEXT
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
