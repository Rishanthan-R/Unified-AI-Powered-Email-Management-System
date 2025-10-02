const { Email, EmailAccount, AutoReply, ProductCatalog } = require('../models');
const emailService = require('../services/emailService');
const aiService = require('../services/aiService');
const { Op } = require('sequelize');

class EmailController {
  async getEmails(req, res) {
    try {
      const { page = 1, limit = 50, priority, sentiment } = req.query;
      const offset = (page - 1) * limit;

      const emailAccounts = await EmailAccount.findAll({
        where: { userId: req.user.id },
        attributes: ['id']
      });

      const accountIds = emailAccounts.map(acc => acc.id);

      const where = { emailAccountId: { [Op.in]: accountIds } };
      if (priority) where.aiPriority = priority;
      if (sentiment) where.aiSentiment = sentiment;

      const emails = await Email.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['receivedDate', 'DESC']],
        include: [{
          model: EmailAccount,
          as: 'emailAccount',
          attributes: ['email', 'provider']
        }]
      });

      res.json({
        emails: emails.rows,
        total: emails.count,
        page: parseInt(page),
        totalPages: Math.ceil(emails.count / limit)
      });
    } catch (error) {
      console.error('Get emails error:', error);
      res.status(500).json({ error: 'Failed to get emails' });
    }
  }

  async getEmailById(req, res) {
    try {
      const { id } = req.params;

      const emailAccounts = await EmailAccount.findAll({
        where: { userId: req.user.id },
        attributes: ['id']
      });

      const accountIds = emailAccounts.map(acc => acc.id);

      const email = await Email.findOne({
        where: {
          id,
          emailAccountId: { [Op.in]: accountIds }
        },
        include: [
          {
            model: EmailAccount,
            as: 'emailAccount',
            attributes: ['email', 'provider']
          },
          {
            model: AutoReply,
            as: 'autoReplies',
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      if (!email) {
        return res.status(404).json({ error: 'Email not found' });
      }

      res.json({ email });
    } catch (error) {
      console.error('Get email by id error:', error);
      res.status(500).json({ error: 'Failed to get email' });
    }
  }

  async syncEmails(req, res) {
    try {
      const { emailAccountId } = req.body;

      const newEmails = await emailService.syncEmails(req.user.id, emailAccountId);

      res.json({
        message: 'Emails synced successfully',
        count: newEmails.length
      });
    } catch (error) {
      console.error('Sync emails error:', error);
      res.status(500).json({ error: 'Failed to sync emails' });
    }
  }

  async markAsRead(req, res) {
    try {
      const { id } = req.params;

      const emailAccounts = await EmailAccount.findAll({
        where: { userId: req.user.id },
        attributes: ['id']
      });

      const accountIds = emailAccounts.map(acc => acc.id);

      const email = await Email.findOne({
        where: {
          id,
          emailAccountId: { [Op.in]: accountIds }
        }
      });

      if (!email) {
        return res.status(404).json({ error: 'Email not found' });
      }

      email.isRead = true;
      await email.save();

      res.json({ message: 'Email marked as read' });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ error: 'Failed to mark email as read' });
    }
  }

  async generateAutoReply(req, res) {
    try {
      const { id } = req.params;

      const emailAccounts = await EmailAccount.findAll({
        where: { userId: req.user.id },
        attributes: ['id']
      });

      const accountIds = emailAccounts.map(acc => acc.id);

      const email = await Email.findOne({
        where: {
          id,
          emailAccountId: { [Op.in]: accountIds }
        }
      });

      if (!email) {
        return res.status(404).json({ error: 'Email not found' });
      }

      const products = await ProductCatalog.findAll({
        where: { userId: req.user.id }
      });

      const mentionedProducts = await aiService.detectProductMentions(
        email.body,
        products
      );

      const reply = await aiService.generateAutoReply(
        email.body,
        email.subject,
        mentionedProducts
      );

      const autoReply = await AutoReply.create({
        emailId: email.id,
        generatedReply: reply,
        status: 'pending'
      });

      res.json({ autoReply });
    } catch (error) {
      console.error('Generate auto-reply error:', error);
      res.status(500).json({ error: 'Failed to generate auto-reply' });
    }
  }
}

module.exports = new EmailController();
