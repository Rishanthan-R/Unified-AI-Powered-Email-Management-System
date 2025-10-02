const { google } = require('googleapis');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const axios = require('axios');
const { Email, EmailAccount } = require('../models');
const aiService = require('./aiService');

class EmailService {
  async fetchGmailEmails(emailAccount) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        process.env.GMAIL_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        access_token: emailAccount.accessToken,
        refresh_token: emailAccount.refreshToken
      });

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 50,
        q: 'is:unread'
      });

      if (!response.data.messages) {
        return [];
      }

      const emails = [];
      for (const message of response.data.messages) {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full'
        });

        const headers = msg.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value || '';
        const from = headers.find(h => h.name === 'From')?.value || '';
        const to = headers.find(h => h.name === 'To')?.value || '';
        const date = headers.find(h => h.name === 'Date')?.value || '';

        let body = '';
        if (msg.data.payload.body.data) {
          body = Buffer.from(msg.data.payload.body.data, 'base64').toString();
        } else if (msg.data.payload.parts) {
          const textPart = msg.data.payload.parts.find(p => p.mimeType === 'text/plain');
          if (textPart?.body.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString();
          }
        }

        emails.push({
          messageId: message.id,
          from,
          to,
          subject,
          body,
          receivedDate: new Date(date)
        });
      }

      return emails;
    } catch (error) {
      console.error('Gmail fetch error:', error);
      throw error;
    }
  }

  async fetchOutlookEmails(emailAccount) {
    try {
      const response = await axios.get(
        'https://graph.microsoft.com/v1.0/me/messages',
        {
          headers: {
            Authorization: `Bearer ${emailAccount.accessToken}`
          },
          params: {
            $top: 50,
            $filter: 'isRead eq false',
            $orderby: 'receivedDateTime desc'
          }
        }
      );

      return response.data.value.map(msg => ({
        messageId: msg.id,
        from: msg.from.emailAddress.address,
        to: msg.toRecipients.map(r => r.emailAddress.address).join(', '),
        subject: msg.subject,
        body: msg.body.content,
        receivedDate: new Date(msg.receivedDateTime)
      }));
    } catch (error) {
      console.error('Outlook fetch error:', error);
      throw error;
    }
  }

  async fetchImapEmails(emailAccount) {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: emailAccount.email,
        password: emailAccount.imapPassword,
        host: emailAccount.imapHost,
        port: emailAccount.imapPort || 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
      });

      const emails = [];

      imap.once('ready', () => {
        imap.openBox('INBOX', true, (err, box) => {
          if (err) {
            reject(err);
            return;
          }

          imap.search(['UNSEEN'], (err, results) => {
            if (err || !results || results.length === 0) {
              imap.end();
              resolve([]);
              return;
            }

            const fetch = imap.fetch(results.slice(0, 50), {
              bodies: '',
              struct: true
            });

            fetch.on('message', (msg) => {
              msg.on('body', (stream) => {
                simpleParser(stream, async (err, parsed) => {
                  if (!err && parsed) {
                    emails.push({
                      messageId: parsed.messageId,
                      from: parsed.from.text,
                      to: parsed.to.text,
                      subject: parsed.subject,
                      body: parsed.text || parsed.html,
                      receivedDate: parsed.date || new Date()
                    });
                  }
                });
              });
            });

            fetch.once('end', () => {
              imap.end();
            });
          });
        });
      });

      imap.once('error', (err) => {
        reject(err);
      });

      imap.once('end', () => {
        resolve(emails);
      });

      imap.connect();
    });
  }

  async syncEmails(userId, emailAccountId) {
    try {
      const emailAccount = await EmailAccount.findByPk(emailAccountId);
      
      if (!emailAccount || emailAccount.userId !== userId) {
        throw new Error('Email account not found');
      }

      let fetchedEmails = [];

      switch (emailAccount.provider) {
        case 'gmail':
          fetchedEmails = await this.fetchGmailEmails(emailAccount);
          break;
        case 'outlook':
          fetchedEmails = await this.fetchOutlookEmails(emailAccount);
          break;
        case 'imap':
          fetchedEmails = await this.fetchImapEmails(emailAccount);
          break;
      }

      const savedEmails = [];

      for (const emailData of fetchedEmails) {
        const existingEmail = await Email.findOne({
          where: {
            emailAccountId: emailAccount.id,
            messageId: emailData.messageId
          }
        });

        if (!existingEmail) {
          const aiAnalysis = await aiService.analyzeEmail(
            emailData.body,
            emailData.subject
          );

          const email = await Email.create({
            emailAccountId: emailAccount.id,
            messageId: emailData.messageId,
            from: emailData.from,
            to: emailData.to,
            subject: emailData.subject,
            body: emailData.body,
            receivedDate: emailData.receivedDate,
            aiIntent: aiAnalysis.intent,
            aiSentiment: aiAnalysis.sentiment,
            aiPriority: aiAnalysis.priority,
            aiSummary: aiAnalysis.summary
          });

          savedEmails.push(email);
        }
      }

      return savedEmails;
    } catch (error) {
      console.error('Sync emails error:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
