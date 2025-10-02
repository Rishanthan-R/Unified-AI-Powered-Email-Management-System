const User = require('./User');
const EmailAccount = require('./EmailAccount');
const Email = require('./Email');
const AutoReply = require('./AutoReply');
const ProductCatalog = require('./ProductCatalog');

// Define relationships
User.hasMany(EmailAccount, { foreignKey: 'userId', as: 'emailAccounts' });
EmailAccount.belongsTo(User, { foreignKey: 'userId', as: 'user' });

EmailAccount.hasMany(Email, { foreignKey: 'emailAccountId', as: 'emails' });
Email.belongsTo(EmailAccount, { foreignKey: 'emailAccountId', as: 'emailAccount' });

Email.hasMany(AutoReply, { foreignKey: 'emailId', as: 'autoReplies' });
AutoReply.belongsTo(Email, { foreignKey: 'emailId', as: 'email' });

User.hasMany(ProductCatalog, { foreignKey: 'userId', as: 'products' });
ProductCatalog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  EmailAccount,
  Email,
  AutoReply,
  ProductCatalog
};
