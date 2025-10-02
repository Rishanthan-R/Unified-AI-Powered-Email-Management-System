import api from './api';

export interface EmailAccount {
  id: string;
  provider: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export const emailAccountService = {
  getAccounts: async () => {
    const response = await api.get('/email-accounts');
    return response.data;
  },

  initiateGmailAuth: async () => {
    const response = await api.get('/email-accounts/gmail/auth');
    return response.data;
  },

  initiateOutlookAuth: async () => {
    const response = await api.get('/email-accounts/outlook/auth');
    return response.data;
  },

  addImapAccount: async (data: { email: string; imapHost: string; imapPort: number; imapPassword: string }) => {
    const response = await api.post('/email-accounts/imap', data);
    return response.data;
  },

  deleteAccount: async (id: string) => {
    const response = await api.delete(`/email-accounts/${id}`);
    return response.data;
  }
};
