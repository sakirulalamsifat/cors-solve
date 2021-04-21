
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const SW_TBL_ID_TYPE = sequelize.define('SW_TBL_ID_TYPE', {
    
    ID_Type_ID: {
        type: DataTypes.TINYINT,
        allowNull: false,
        primaryKey: true
    },
    ID_Type_Description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Expire: {
        type: DataTypes.INTEGER,
    },
    Created_By:{
        type: DataTypes.TEXT,
    },
    Created_Date:{
        type: DataTypes.DATE
    },
    Modified_By:{
        type:DataTypes.TEXT
    },
    Modified_Date:{
        type: DataTypes.DATE
    },
    Approved_By:{
        type:DataTypes.TEXT
    },
    Approved_Date:{
        type:DataTypes.DATE
    }
    
}, {
    tableName: 'SW_TBL_ID_TYPE',
    freezeTableName: true,
    timestamps: false
});

module.exports = SW_TBL_ID_TYPE;
