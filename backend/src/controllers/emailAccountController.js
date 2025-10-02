const { EmailAccount } = require('../models');
const oauthService = require('../services/oauthService');

class EmailAccountController {
  async getAccounts(req, res) {
    try {
      const accounts = await EmailAccount.findAll({
        where: { userId: req.user.id },
        attributes: ['id', 'provider', 'email', 'isActive', 'createdAt']
      });

      res.json({ accounts });
    } catch (error) {
      console.error('Get accounts error:', error);
      res.status(500).json({ error: 'Failed to get accounts' });
    }
  }

  async initiateGmailAuth(req, res) {
    try {
      const authUrl = oauthService.getGmailAuthUrl(req.user.id);
      res.json({ authUrl });
    } catch (error) {
      console.error('Gmail auth initiation error:', error);
      res.status(500).json({ error: 'Failed to initiate Gmail authentication' });
    }
  }

  async handleGmailCallback(req, res) {
    try {
      const { code, state } = req.query;
      const userId = state;

      const tokens = await oauthService.getGmailTokens(code);

      // Get user email from Google
      const { google } = require('googleapis');
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();

      const expiryDate = new Date();
      expiryDate.setSeconds(expiryDate.getSeconds() + tokens.expiry_date);

      await EmailAccount.create({
        userId,
        provider: 'gmail',
        email: userInfo.data.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: expiryDate
      });

      res.redirect(`${process.env.FRONTEND_URL}/dashboard?gmail=connected`);
    } catch (error) {
      console.error('Gmail callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=gmail_failed`);
    }
  }

  async initiateOutlookAuth(req, res) {
    try {
      const authUrl = oauthService.getOutlookAuthUrl(req.user.id);
      res.json({ authUrl });
    } catch (error) {
      console.error('Outlook auth initiation error:', error);
      res.status(500).json({ error: 'Failed to initiate Outlook authentication' });
    }
  }

  async handleOutlookCallback(req, res) {
    try {
      const { code, state } = req.query;
      const userId = state;

      const tokens = await oauthService.getOutlookTokens(code);

      const expiryDate = new Date();
      expiryDate.setSeconds(expiryDate.getSeconds() + tokens.expires_in);

      // Get user email from Microsoft Graph
      const axios = require('axios');
      const userInfo = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });

      await EmailAccount.create({
        userId,
        provider: 'outlook',
        email: userInfo.data.mail || userInfo.data.userPrincipalName,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: expiryDate
      });

      res.redirect(`${process.env.FRONTEND_URL}/dashboard?outlook=connected`);
    } catch (error) {
      console.error('Outlook callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=outlook_failed`);
    }
  }

  async addImapAccount(req, res) {
    try {
      const { email, imapHost, imapPort, imapPassword } = req.body;

      const account = await EmailAccount.create({
        userId: req.user.id,
        provider: 'imap',
        email,
        imapHost,
        imapPort: imapPort || 993,
        imapPassword
      });

      res.status(201).json({
        account: {
          id: account.id,
          provider: account.provider,
          email: account.email
        }
      });
    } catch (error) {
      console.error('Add IMAP account error:', error);
      res.status(500).json({ error: 'Failed to add IMAP account' });
    }
  }

  async deleteAccount(req, res) {
    try {
      const { id } = req.params;

      const account = await EmailAccount.findOne({
        where: { id, userId: req.user.id }
      });

      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      await account.destroy();
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ error: 'Failed to delete account' });
    }
  }
}

module.exports = new EmailAccountController();
