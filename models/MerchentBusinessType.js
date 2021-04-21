
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const MerchentBusinessType = sequelize.define('MerchentBusinessType', {
    
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    typename: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    
}, {
    tableName: 'MerchentBusinessType',
    freezeTableName: true,
    timestamps: false
});

module.exports = MerchentBusinessType;
