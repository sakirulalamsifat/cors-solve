
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const CreditUnionMembership = sequelize.define('CreditUnionMembership', {
    
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    
}, {
    tableName: 'CreditUnionMembership',
    freezeTableName: true,
    timestamps: false
});

module.exports = CreditUnionMembership;
