'use client'
import React from 'react';
import { List, ListItem, ListItemText, Avatar, Typography } from '@mui/material';

export interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  isUnread: boolean;
}

export default function EmailList({
  emails,
  onSelect,
}: {
  emails: Email[];
  onSelect: (email: Email) => void;
}) {
  return (
    <List>
      {emails.map((email) => (
        <ListItem
          key={email.id}
          button
          onClick={() => onSelect(email)}
          sx={{ background: email.isUnread ? '#f3f4f6' : 'white' }}
        >
          <Avatar sx={{ mr: 2 }}>{email.sender[0].toUpperCase()}</Avatar>
          <ListItemText
            primary={
              <Typography fontWeight={email.isUnread ? 600 : 400}>
                {email.sender} - {email.subject}
              </Typography>
            }
            secondary={email.preview}
          />
        </ListItem>
      ))}
    </List>
  );
}
