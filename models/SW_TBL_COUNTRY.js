
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const SW_TBL_COUNTRY = sequelize.define('SW_TBL_COUNTRY', {
    Country_Id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    Country_Name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    tableName: 'SW_TBL_COUNTRY',
    freezeTableName: true,
    timestamps: false
});

module.exports = SW_TBL_COUNTRY;