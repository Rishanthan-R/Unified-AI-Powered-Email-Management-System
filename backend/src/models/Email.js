const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Email = sequelize.define('Email', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  emailAccountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'EmailAccounts',
      key: 'id'
    }
  },
  messageId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  from: {
    type: DataTypes.STRING,
    allowNull: false
  },
  to: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  subject: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  receivedDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  aiIntent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  aiSentiment: {
    type: DataTypes.STRING,
    allowNull: true
  },
  aiPriority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    allowNull: true
  },
  aiSummary: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['emailAccountId']
    },
    {
      fields: ['messageId']
    },
    {
      fields: ['receivedDate']
    }
  ]
});

module.exports = Email;
