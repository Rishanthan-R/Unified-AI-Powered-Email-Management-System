'use client'
import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Email } from '@/types';

interface Props { email: Email | null }
export default function EmailDetail({ email }: Props) {
  if (!email) {
    return <Typography color="textSecondary">Select an email to view details</Typography>;
  }
  return (
    <Paper sx={{ p: 3 }}>
      <Box mb={2}>
        <Typography variant="h6">{email.subject}</Typography>
        <Typography variant="subtitle2" color="textSecondary">
          From: {email.sender} | {email.date}{' '}
          <Chip label={email.provider} size="small" sx={{ ml: 1 }} />
          {email.priority === 'high' && (
            <Chip label="High" color="error" size="small" sx={{ ml: 1 }} />
          )}
        </Typography>
      </Box>
      <Box>
        <Typography>{email.body || email.preview}</Typography>
      </Box>
    </Paper>
  );
}
