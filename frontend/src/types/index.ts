export interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  body?: string;
  date: string;
  isUnread: boolean;
  provider: 'gmail' | 'outlook' | 'yahoo' | 'other';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  category: 'business' | 'spam' | 'promotion' | 'social';
  aiProcessed: boolean;
  aiResponse?: string;
  aiConfidence?: number;
  requiresHuman?: boolean;
  escalated?: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  sku: string;
  description: string;
  category?: string;
  inStock?: boolean;
  queryCount?: number; // How often this product is asked about
}

export interface AIResponse {
  id: string;
  emailId: string;
  responseText: string;
  confidence: number;
  matchedProducts: Product[];
  responseType: 'complete' | 'partial' | 'escalate';
  sentAt?: string;
  humanReviewed?: boolean;
}

export interface BusinessMetrics {
  totalEmails: number;
  businessEmails: number;
  aiResponded: number;
  pendingReview: number;
  escalated: number;
  avgResponseTime: string;
  successRate: number;
  conversionRate: number;
}
