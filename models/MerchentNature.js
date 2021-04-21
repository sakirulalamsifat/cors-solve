
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const MerchentNature = sequelize.define('MerchentNature', {
    
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    naturename: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    
}, {
    tableName: 'MerchentNature',
    freezeTableName: true,
    timestamps: false
});

module.exports = MerchentNature;
