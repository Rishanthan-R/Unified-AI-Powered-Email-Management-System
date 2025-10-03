'use client'
import React, { useEffect, useState } from 'react'
import { Grid, Paper, Box, Typography, TextField, InputAdornment, IconButton } from '@mui/material'
import { Search } from '@mui/icons-material'
import EmailList from '@/components/email/EmailList'
import EmailDetail from '@/components/email/EmailDetail'
import { Email } from '@/types'
import { fetchEmails } from '@/lib/api'

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[]>([])
  const [filtered, setFiltered] = useState<Email[]>([])
  const [selected, setSelected] = useState<Email | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchEmails().then(data => { setEmails(data); setFiltered(data) })
  }, [])

  useEffect(() => {
    setFiltered(emails.filter(e =>
      e.sender.includes(search) || e.subject.includes(search)
    ))
  }, [search, emails])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Unified Inbox</Typography>
      <TextField
        fullWidth
        placeholder="Search emails..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '75vh', overflow: 'auto', p: 1 }}>
            <EmailList emails={filtered} onSelect={setSelected} selectedEmailId={selected?.id} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '75vh', overflow: 'auto' }}>
            <EmailDetail email={selected} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
