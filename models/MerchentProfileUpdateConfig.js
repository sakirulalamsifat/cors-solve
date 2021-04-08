

import DataTypes from 'sequelize'
import sequelize from '../config/database'

const MerchentProfileUpdateConfig = sequelize.define('MerchentProfileUpdateConfig', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    createdbyname:{
        type:DataTypes.TEXT,
        allowNull:false
    }
}, {
    tableName: 'MerchentProfileUpdateConfig',
    freezeTableName: true,
    timestamps: false
});

module.exports = MerchentProfileUpdateConfig;
