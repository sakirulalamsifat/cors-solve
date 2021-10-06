
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const MerchentAgentProfileMap = sequelize.define('MerchentAgentProfileMap', {
    
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    Merchent_MSISDN: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    Agent_MSISDN: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
    
}, {
    tableName: 'MerchentAgentProfileMap',
    freezeTableName: true,
    timestamps: false
});

module.exports = MerchentAgentProfileMap;
