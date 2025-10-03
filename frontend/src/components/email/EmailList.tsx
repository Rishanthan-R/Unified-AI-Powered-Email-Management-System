'use client'
import React from 'react';
import { List, ListItem, ListItemText, Avatar, Chip, Typography } from '@mui/material';
import { Email } from '@/types';

interface EmailListProps {
  emails: Email[];
  onSelect: (email: Email) => void;
  selectedEmailId?: string | null;
}

export default function EmailList({ emails, onSelect, selectedEmailId }: EmailListProps) {
  return (
    <List>
      {emails.map((email) => (
        <ListItem
          key={email.id}
          onClick={() => onSelect(email)}
          selected={email.id === selectedEmailId}
          alignItems="flex-start"
          button
          sx={{ background: email.isUnread ? '#f0f6ff' : '#fff' }}
        >
          <Avatar sx={{ mr: 2 }}>{email.sender[0].toUpperCase()}</Avatar>
          <ListItemText
            primary={
              <Typography fontWeight={email.isUnread ? 600 : 400}>
                {email.sender} — {email.subject}
              </Typography>
            }
            secondary={
              <>
                <Typography variant="body2" color="text.secondary">{email.preview}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {email.date} <Chip label={email.provider} size="small" sx={{ ml: 1 }} />
                  {email.priority === 'high' && <Chip label="High" color="error" size="small" sx={{ ml: 1 }} />}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
