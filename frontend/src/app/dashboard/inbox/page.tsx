'use client'
import React, { useState } from 'react';
import { Grid, Paper } from '@mui/material';
import EmailList, { Email } from '@/components/email/EmailList';
import EmailDetail from '@/components/email/EmailDetail';

const mockEmails: Email[] = [
  {
    id: '1',
    sender: 'john@example.com',
    subject: 'Product Inquiry - Widget A',
    preview: 'Hello, I am interested in Widget A. What is the price?',
    date: '2025-10-03',
    isUnread: true,
  },
  {
    id: '2',
    sender: 'sarah@business.com',
    subject: 'Order Status Update',
    preview: 'Can you please update me on my recent order?',
    date: '2025-10-03',
    isUnread: false,
  },
];

export default function InboxPage() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ height: '80vh', overflow: 'auto' }}>
          <EmailList emails={mockEmails} onSelect={setSelectedEmail} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <EmailDetail email={selectedEmail} />
      </Grid>
    </Grid>
  );
}
