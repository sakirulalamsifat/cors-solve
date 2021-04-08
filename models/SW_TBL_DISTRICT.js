
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const SW_TBL_DISTRICT = sequelize.define('SW_TBL_DISTRICT', {
    District_Id:{
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false,
    },
    District_Name_English: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    District_Name_Khmer:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    City_Id:{
        type: DataTypes.TEXT,
        allowNull:false
    }
}, {
    tableName: 'SW_TBL_DISTRICT',
    freezeTableName: true,
    timestamps: false
});

module.exports = SW_TBL_DISTRICT;