const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AutoReply = sequelize.define('AutoReply', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  emailId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Emails',
      key: 'id'
    }
  },
  generatedReply: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'sent'),
    defaultValue: 'pending'
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = AutoReply;
