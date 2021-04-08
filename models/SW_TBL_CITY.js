
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const SW_TBL_CITY = sequelize.define('SW_TBL_CITY', {
    City_Id:{
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false,
    },
    City_Name_English: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    City_Name_Khmer:{
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'SW_TBL_CITY',
    freezeTableName: true,
    timestamps: false
});

module.exports = SW_TBL_CITY;