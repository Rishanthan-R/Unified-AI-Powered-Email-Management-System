'use client'
import React, { useState } from 'react'
import {
  Box, Paper, Typography, Switch, FormControlLabel, Divider,
  TextField, Button, Slider, Select, MenuItem, FormLabel, FormGroup
} from '@mui/material'
import { Save, InfoOutlined } from '@mui/icons-material'

export default function SettingsPage() {
  // State for settings
  const [darkMode, setDarkMode] = useState(false)
  const [autoReply, setAutoReply] = useState(true)
  const [replyConfidence, setReplyConfidence] = useState(75)
  const [businessHours, setBusinessHours] = useState([9, 18])
  const [defaultProvider, setDefaultProvider] = useState('gmail')
  const [signature, setSignature] = useState('Best regards,\nYour Company Team')

  const handleSave = () => {
    // TODO: Save settings to backend/user profile
    alert('Settings saved!')
  }

  return (
    <Box sx={{ maxWidth: 620, mx: 'auto', py: 3 }}>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                disabled
              />
            }
            label="Dark Mode (theme setting is global and can be changed from the top bar)"
          />
          <FormControlLabel
            control={
              <Switch
                checked={autoReply}
                onChange={(e) => setAutoReply(e.target.checked)}
              />
            }
            label="Enable AI Auto-Reply"
          />
          <Divider sx={{ my: 3 }} />

          <FormLabel sx={{ mb: 1 }}>AI Reply Confidence Threshold</FormLabel>
          <Slider
            value={replyConfidence}
            onChange={(_, newValue) => setReplyConfidence(newValue as number)}
            valueLabelDisplay="auto"
            step={1}
            min={50}
            max={100}
            marks={[
              { value: 70, label: 'Safe' },
              { value: 85, label: 'Advanced' }
            ]}
            sx={{ width: 250, mb: 2 }}
          />
          <Typography variant="caption" color="text.secondary">
            Only send automated replies when AI is at least this confident. Lower values allow more auto-responses, higher values send only when extra certain.
          </Typography>
          <Divider sx={{ my: 3 }} />

          <FormLabel sx={{ mb: 1, mt: 2 }}>Business Hours</FormLabel>
          <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
            <TextField
              label="From"
              type="number"
              size="small"
              value={businessHours[0]}
              onChange={e => setBusinessHours([parseInt(e.target.value), businessHours[1]])}
              InputProps={{ inputProps: { min: 0, max: 23 } }}
              sx={{ width: 80 }}
            />
            <Typography>to</Typography>
            <TextField
              label="To"
              type="number"
              size="small"
              value={businessHours[1]}
              onChange={e => setBusinessHours([businessHours[0], parseInt(e.target.value)])}
              InputProps={{ inputProps: { min: 0, max: 23 } }}
              sx={{ width: 80 }}
            />
            <Typography>Hrs</Typography>
            <InfoOutlined color="disabled" fontSize="small" sx={{ ml: 1 }} />
          </Box>
          <Typography variant="caption" color="text.secondary">
            AI will only send auto-replies during these hours.
          </Typography>
          <Divider sx={{ my: 3 }} />

          <FormLabel sx={{ mb: 1 }}>Default Email Provider for Outgoing Replies</FormLabel>
          <Select
            value={defaultProvider}
            onChange={e => setDefaultProvider(e.target.value)}
            size="small"
            sx={{ width: 200, mb: 2 }}
          >
            <MenuItem value="gmail">Gmail</MenuItem>
            <MenuItem value="outlook">Outlook</MenuItem>
            <MenuItem value="yahoo">Yahoo</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
          <Divider sx={{ my: 3 }} />

          <FormLabel sx={{ mb: 1 }}>Default Signature</FormLabel>
          <TextField
            multiline
            minRows={3}
            value={signature}
            onChange={e => setSignature(e.target.value)}
            sx={{ width: '100%', mb: 2 }}
            variant="outlined"
          />

          <Divider sx={{ my: 3 }} />

          <Button variant="contained" onClick={handleSave} size="large" startIcon={<Save />}>
            Save Settings
          </Button>
        </FormGroup>
      </Paper>
    </Box>
  )
}
