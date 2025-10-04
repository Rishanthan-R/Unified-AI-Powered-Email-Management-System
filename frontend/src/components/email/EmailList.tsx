// src/components/email/EmailList.tsx
'use client'
import React from 'react'
import { List, ListItemButton, ListItemText, Avatar, Box, Typography, Chip } from '@mui/material'
import { Email } from '@/types'

interface EmailListProps {
  emails: Email[]
  onSelect: (email: Email) => void
  selectedEmailId?: string | null
}

export default function EmailList({ emails, onSelect, selectedEmailId }: EmailListProps) {
  return (
    <List>
      {emails.map(email => (
        <ListItemButton
          key={email.id}
          selected={email.id === selectedEmailId}
          onClick={() => onSelect(email)}
          sx={{
            borderBottom: '1px solid #eaeaea',
            py: 1,
            '& .MuiListItemText-primary': {
              fontWeight: email.isUnread ? 'bold' : 'normal',
            },
          }}
        >
          <Avatar sx={{ mr: 2 }}>{email.sender[0].toUpperCase()}</Avatar>
          <ListItemText
            primary={email.subject}
            secondary={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.primary"
                  noWrap
                >
                  {email.sender}
                </Typography>

                <Chip label={email.status} size="small" color={email.priority === 'high' ? 'error' : 'default'} />

                <Typography
                  component="span"
                  fontSize="small"
                  color="text.secondary"
                  noWrap
                >
                  {email.preview}
                </Typography>
              </Box>
            }
          />
        </ListItemButton>
      ))}
    </List>
  )
}
