export interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  isUnread: boolean;
  provider: string;
  priority?: 'high' | 'normal' | 'low';
  body?: string;
}
