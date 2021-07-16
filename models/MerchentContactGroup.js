import DataTypes from 'sequelize'
import sequelize from '../config/database'

const MerchentContactGroup = sequelize.define('MerchentContactGroup', {
    
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    group_name:{
        type: DataTypes.STRING(100)
    },
    created_by:{
        type: DataTypes.BIGINT,
        allowNull: false
    }
    
}, {
    tableName: 'MerchentContactGroup',
    freezeTableName: true,
    timestamps: false
});

module.exports = MerchentContactGroup;
