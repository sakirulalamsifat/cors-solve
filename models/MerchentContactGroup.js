import DataTypes from 'sequelize'
import sequelize from '../config/database'

const MerchentContactGroup = sequelize.define('MerchentContactGroup', {
    
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    group_name:{
        type: DataTypes.TEXT
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
