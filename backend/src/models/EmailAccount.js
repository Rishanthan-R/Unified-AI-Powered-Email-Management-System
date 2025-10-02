const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EmailAccount = sequelize.define('EmailAccount', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  provider: {
    type: DataTypes.ENUM('gmail', 'outlook', 'imap'),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accessToken: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  imapHost: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imapPort: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  imapPassword: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = EmailAccount;
