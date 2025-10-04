'use client'
import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Paper, List, ListItem, ListItemText, Chip, Button,
  IconButton, Tooltip, Divider
} from '@mui/material'
import {
  CheckCircle, ReportProblem, Edit, ArrowForward, Person, Mail, HighlightOff
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

interface ReviewResponse {
  id: string
  sender: string
  subject: string
  aiResponse: string
  confidence: number
  requiresHuman: boolean
  escalated: boolean
  status: 'pending' | 'approved' | 'rejected'
  original: string
}

const demoResponses: ReviewResponse[] = [
  {
    id: 'r1',
    sender: 'customer1@gmail.com',
    subject: 'Quotation for small bag',
    aiResponse: 'Thank you for your inquiry! Our small bag printing is ₹450 per piece.',
    confidence: 0.99,
    requiresHuman: false,
    escalated: false,
    status: 'pending',
    original: "Can you send a price for small bag printing?"
  },
  {
    id: 'r2',
    sender: 'vip.client@outlook.com',
    subject: 'Bulk order enquiry',
    aiResponse: 'Thank you for your interest in business cards. Our sales team will contact you soon with a bulk quotation.',
    confidence: 0.84,
    requiresHuman: true,
    escalated: false,
    status: 'pending',
    original: 'Need quote for 250 business cards, urgent.'
  },
  {
    id: 'r3',
    sender: 'shopper@yahoo.com',
    subject: 'Big banner printing needed',
    aiResponse: 'Thank you for contacting us! Our service team will review your large banner requirement and reply soon.',
    confidence: 0.60,
    requiresHuman: true,
    escalated: true,
    status: 'pending',
    original: 'Big banner printing needed, size 10x4 feet.'
  }
]

export default function ReviewPage() {
  const [responses, setResponses] = useState<ReviewResponse[]>([])

  useEffect(() => {
    setResponses(demoResponses)
  }, [])

  const handleApprove = (id: string) => {
    setResponses((rs) =>
      rs.map(r => r.id === id ? { ...r, status: 'approved' } : r)
    )
  }

  const handleEscalate = (id: string) => {
    setResponses((rs) =>
      rs.map(r => r.id === id ? { ...r, status: 'rejected' } : r)
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Response Review
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Review, approve, or escalate AI-generated replies to customers. Quick actions for pending, escalated, and low-confidence responses.
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <List>
          <AnimatePresence>
            {responses.filter(r => r.status === 'pending').map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ delay: idx * 0.07 }}
              >
                <ListItem alignItems="flex-start" sx={{ mb: 2, borderRadius: 2, boxShadow: 1, bgcolor: r.escalated ? 'warning.light' : undefined }}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Mail color="primary" /> <b>{r.subject}</b>
                        <Chip
                          size="small"
                          label={r.confidence >= 0.95 ? "High" : r.confidence >= 0.8 ? "Medium" : "Low Confidence"}
                          color={r.confidence >= 0.95 ? "success" : r.confidence >= 0.8 ? "warning" : "error"}
                        />
                        {r.escalated && (
                          <Chip size="small" label="Escalated" color="warning" icon={<ReportProblem />} />
                        )}
                        {r.requiresHuman && (
                          <Chip size="small" label="Human Review" color="primary" icon={<Person />} />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box mt={1}>
                        <Typography variant="body2" fontWeight="bold" gutterBottom color="text.primary">
                          <span style={{ color: '#475569' }}>From:</span> {r.sender}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <span style={{ color: '#a0aec0' }}>Customer asked:</span>
                          {' '}{r.original}
                        </Typography>
                        <Typography variant="body2" color="primary.main" sx={{ background: '#f0f8ff', borderRadius: 1, p: 1, mt: 1 }}>
                          <b>AI Response:</b> {r.aiResponse}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box display="flex" flexDirection="column" gap={1} alignItems="flex-end" minWidth={120}>
                    <Tooltip title="Approve and send">
                      <span>
                        <IconButton
                          color="success"
                          onClick={() => handleApprove(r.id)}
                          disabled={r.status !== 'pending'}
                        >
                          <CheckCircle />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Escalate to human">
                      <span>
                        <IconButton
                          color="error"
                          onClick={() => handleEscalate(r.id)}
                          disabled={r.status !== 'pending'}
                        >
                          <HighlightOff />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </ListItem>
                {idx < responses.length - 1 && <Divider />}
              </motion.div>
            ))}
            {responses.filter(r => r.status === 'pending').length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Typography textAlign="center" sx={{ mt: 8 }} color="text.secondary">
                  All responses reviewed!
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </List>
      </Paper>
    </Box>
  )
}
