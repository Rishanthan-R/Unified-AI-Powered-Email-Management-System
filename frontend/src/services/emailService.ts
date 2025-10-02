import api from './api';

export interface Email {
  id: string;
  messageId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  receivedDate: string;
  isRead: boolean;
  aiIntent?: string;
  aiSentiment?: string;
  aiPriority?: string;
  aiSummary?: string;
  emailAccount?: {
    email: string;
    provider: string;
  };
}

export const emailService = {
  getEmails: async (params?: { page?: number; limit?: number; priority?: string; sentiment?: string }) => {
    const response = await api.get('/emails', { params });
    return response.data;
  },

  getEmailById: async (id: string) => {
    const response = await api.get(`/emails/${id}`);
    return response.data;
  },

  syncEmails: async (emailAccountId: string) => {
    const response = await api.post('/emails/sync', { emailAccountId });
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch(`/emails/${id}/read`);
    return response.data;
  },

  generateAutoReply: async (id: string) => {
    const response = await api.post(`/emails/${id}/auto-reply`);
    return response.data;
  }
};
