// src/components/email/EmailDetail.tsx
'use client'
import React from 'react'
import { Box, Typography, Divider, Chip } from '@mui/material'
import { Email } from '@/types'

export default function EmailDetail({ email }: { email: Email }) {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold">{email.subject}</Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        From: {email.sender} | {new Date(email.date).toLocaleString()}
      </Typography>
      <Chip label={email.provider.toUpperCase()} color="info" size="small" sx={{ mb: 2 }} />
      <Divider />
      <Box mt={2}>
        <Typography variant="body1" whiteSpace="pre-line">{email.body || email.preview}</Typography>
      </Box>
    </Box>
  )
}
