'use client'
import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material'
import { Search, PriorityHigh, FiberManualRecord } from '@mui/icons-material'
import EmailList from '@/components/email/EmailList'
import EmailDetail from '@/components/email/EmailDetail'
import { Email } from '@/types'
import { fetchEmails } from '@/lib/api'
import { motion } from 'framer-motion'

export default function InboxPage() {
  const muiTheme = useTheme()
  const isSmDown = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const [emails, setEmails] = useState<Email[]>([])
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Load emails on mount (simulate API call)
  useEffect(() => {
  // DEMO EMAILS ARRAY
  const demoEmails: Email[] = [
    {
      id: '1',
      sender: 'customer1@gmail.com',
      subject: 'Quotation needed for small bag',
      preview: 'Can you send a price for small bag printing?',
      body: 'Hello,\nI am looking for the price for your small bag printing service. Please send a quotation.\nThank you.\n— Customer One',
      date: '2025-10-04T09:15:00Z',
      isUnread: true,
      provider: 'gmail',
      priority: 'high',
      category: 'business',
      aiProcessed: true,
      aiResponse: 'Thank you for your inquiry! Our small bag printing is ₹450 per piece.',
      aiConfidence: 0.99,
      requiresHuman: false,
      escalated: false,
    },
    {
      id: '2',
      sender: 'vip.client@outlook.com',
      subject: 'Bulk order enquiry (business cards)',
      preview: 'Need quote for 250 business cards, urgent.',
      body: 'Hi,\nCan you send your best price for 250 business cards printed front and back?\nPlease reply urgently.\n— VIP Client',
      date: '2025-10-04T08:50:00Z',
      isUnread: true,
      provider: 'outlook',
      priority: 'urgent',
      category: 'business',
      aiProcessed: true,
      aiResponse: 'Thank you for your interest in business cards. Our sales team will contact you soon with a bulk quotation.',
      aiConfidence: 0.84,
      requiresHuman: true,
      escalated: false,
    },
    {
      id: '3',
      sender: 'shopper@yahoo.com',
      subject: 'Do you print big banners?',
      preview: 'Big banner printing needed, size 10x4 feet.',
      body: 'Hello,\nDo you offer big banner printing (10x4 feet)? Please reply with price and timeline.\nRegards,\nShopper',
      date: '2025-10-03T19:33:00Z',
      isUnread: false,
      provider: 'yahoo',
      priority: 'normal',
      category: 'business',
      aiProcessed: true,
      aiResponse: 'Thank you for contacting us! Our service team will review your large banner requirement and reply soon.',
      aiConfidence: 0.60,
      requiresHuman: true,
      escalated: true,
    },
    {
      id: '4',
      sender: 'newsletter@site.com',
      subject: 'Promotion: New printing equipment!',
      preview: 'Check out our new printers and offers.',
      body: 'This is an automated marketing email.',
      date: '2025-10-02T11:12:00Z',
      isUnread: false,
      provider: 'gmail',
      priority: 'low',
      category: 'promotion',
      aiProcessed: false
    },
    {
      id: '5',
      sender: 'student23@col.uni',
      subject: 'Request for price list',
      preview: 'Can you share your price list for all products?',
      body: 'Hi, Please send me a full price list. Regards.',
      date: '2025-10-04T10:09:00Z',
      isUnread: false,
      provider: 'gmail',
      priority: 'normal',
      category: 'business',
      aiProcessed: true,
      aiResponse: 'Thank you! Please find the price list attached for your reference.',
      aiConfidence: 0.97,
      requiresHuman: false
    }
  ];
  setEmails(demoEmails)
  setFilteredEmails(demoEmails)
  setSelectedEmail(demoEmails[0])
}, [])


  // Filter emails on search term change
  useEffect(() => {
    const filtered = emails.filter(email =>
      email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEmails(filtered)
  }, [searchTerm, emails])

  return (
    <Box sx={{ width: '100%' }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom>
        Unified Inbox
      </Typography>

      {/* Search field */}
      <TextField
        placeholder="Search emails..."
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={2}>
        {/* Email List */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              height: isSmDown ? 'auto' : '75vh',
              overflowY: 'auto',
              borderRadius: 3,
              p: 1,
              bgcolor: muiTheme.palette.background.paper
            }}
          >
            <EmailList
              emails={filteredEmails}
              onSelect={setSelectedEmail}
              selectedEmailId={selectedEmail?.id}
            />
          </Paper>
        </Grid>

        {/* Email Detail */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              height: isSmDown ? 'auto' : '75vh',
              overflowY: 'auto',
              borderRadius: 3,
              p: 3,
              bgcolor: muiTheme.palette.background.paper
            }}
          >
            {selectedEmail ? (
              <EmailDetail email={selectedEmail} />
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" mt={10}>
                No email selected
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
