const { google } = require('googleapis');
const axios = require('axios');

class OAuthService {
  constructor() {
    this.gmailClient = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );
  }

  getGmailAuthUrl(userId) {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    return this.gmailClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: userId
    });
  }

  async getGmailTokens(code) {
    const { tokens } = await this.gmailClient.getToken(code);
    return tokens;
  }

  async refreshGmailToken(refreshToken) {
    this.gmailClient.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await this.gmailClient.refreshAccessToken();
    return credentials;
  }

  getOutlookAuthUrl(userId) {
    const params = new URLSearchParams({
      client_id: process.env.OUTLOOK_CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
      scope: 'openid profile email Mail.Read Mail.Send offline_access',
      state: userId,
      response_mode: 'query'
    });

    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
  }

  async getOutlookTokens(code) {
    const response = await axios.post(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      new URLSearchParams({
        client_id: process.env.OUTLOOK_CLIENT_ID,
        client_secret: process.env.OUTLOOK_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
        grant_type: 'authorization_code'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  }

  async refreshOutlookToken(refreshToken) {
    const response = await axios.post(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      new URLSearchParams({
        client_id: process.env.OUTLOOK_CLIENT_ID,
        client_secret: process.env.OUTLOOK_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  }
}

module.exports = new OAuthService();
