import DataTypes from 'sequelize'
import sequelize from '../config/database'

const MerchentContactGroupLink = sequelize.define('MerchentContactGroupLink', {
    
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    contact_id:{
        type: DataTypes.BIGINT
    },
    group_id:{
        type: DataTypes.BIGINT,
        allowNull: false
    },
    created_by:{
        type:DataTypes.BIGINT
    }
    
}, {
    tableName: 'MerchentContactGroupLink',
    freezeTableName: true,
    timestamps: false
});

module.exports = MerchentContactGroupLink;
