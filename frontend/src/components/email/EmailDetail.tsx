'use client'
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Email } from './EmailList';

export default function EmailDetail({ email }: { email: Email | null }) {
  if (!email) {
    return <Typography color="textSecondary">Select an email to view details</Typography>;
  }
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">{email.subject}</Typography>
      <Typography variant="subtitle2" color="textSecondary">
        From: {email.sender} | {email.date}
      </Typography>
      <Box mt={2}>
        <Typography>{email.preview}</Typography>
      </Box>
    </Paper>
  );
}
