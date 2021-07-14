
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const BulkPaymentReportTemp = sequelize.define('BulkPaymentReportTemp', {
    
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    MSISDN:{
        type: DataTypes.BIGINT,
    },
    filename: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.SMALLINT,
        defaultValue:0
    },
    uploaded_by:{
        type: DataTypes.BIGINT,
        defaultValue : 0
    }
    
}, {
    tableName: 'BulkPaymentReportTemp',
    freezeTableName: true,
    timestamps: false
});

module.exports = BulkPaymentReportTemp;