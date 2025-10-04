'use client'
import React, { useRef, useState } from 'react'
import {
  Box, Paper, Typography, Avatar, Button, TextField, Grid, Divider, IconButton
} from '@mui/material'
import { Edit, Save, UploadFile } from '@mui/icons-material'

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatar, setAvatar] = useState<string>('/avatar-placeholder.png') // Use a placeholder SVG/image
  const [name, setName] = useState('John Doe')
  const [email, setEmail] = useState('john@company.com')
  const [company, setCompany] = useState('My Company')
  const [role, setRole] = useState('Business Owner')
  const [phone, setPhone] = useState('+94 77 123 4567')
  const [editing, setEditing] = useState(false)

  // Handle avatar upload (demo: just show preview)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.onload = evt => {
        setAvatar(evt.target?.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleSave = () => {
    setEditing(false)
    // TODO: Save to backend profile
    alert('Profile updated!')
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={avatar}
                alt={name}
                sx={{ width: 110, height: 110, mb: 2, boxShadow: 3 }}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
              <Button
                startIcon={<UploadFile />}
                size="small"
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    value={name}
                    disabled={!editing}
                    onChange={e => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company"
                    fullWidth
                    value={company}
                    disabled={!editing}
                    onChange={e => setCompany(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Role"
                    fullWidth
                    value={role}
                    disabled={!editing}
                    onChange={e => setRole(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    fullWidth
                    value={phone}
                    disabled={!editing}
                    onChange={e => setPhone(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', gap: 2 }}>
                {!editing ? (
                  <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
                    Save Profile
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
