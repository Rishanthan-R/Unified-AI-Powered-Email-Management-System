'use client'
import React, { useState, useRef } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  LinearProgress,
} from '@mui/material'
import { CloudUpload, PictureAsPdf, InsertDriveFile, Delete } from '@mui/icons-material'
import { motion } from 'framer-motion'

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain'
]

export default function CatalogPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selectedFiles = e.target.files
    if (!selectedFiles) return

    // Filter accepted file types
    const filtered = Array.from(selectedFiles).filter(f => ACCEPTED_FILE_TYPES.includes(f.type))

    if (filtered.length !== selectedFiles.length) {
      setError('Some files were rejected. Only PDF, Word, Excel, CSV, and Text files allowed.')
    }

    setFiles(prev => [...prev, ...filtered])
    e.target.value = ''
    setSuccess(false)
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please add one or more files to upload.')
      return
    }
    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      // Prepare form data
      const formData = new FormData()
      files.forEach(file => formData.append('catalog', file))

      // Replace with your actual API call
      await new Promise((r) => setTimeout(r, 2000))

      setSuccess(true)
      setFiles([])
    } catch (e) {
      setError('Upload failed, please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const renderIcon = (type: string) => {
    switch (type) {
      case 'application/pdf':
        return <PictureAsPdf color="error" />
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <InsertDriveFile color="primary" />
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return <InsertDriveFile color="success" />
      case 'text/csv':
      case 'text/plain':
        return <InsertDriveFile color="secondary" />
      default:
        return <InsertDriveFile />
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload Your Product Catalog(s)
      </Typography>

      <Paper sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.9)', borderRadius: 3 }}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_FILE_TYPES.join(',')}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            Select Files
          </Button>

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
          >
            {uploading ? 'Uploading...' : 'Upload Catalog'}
          </Button>
        </Box>

        {uploading && <LinearProgress sx={{ mt: 2, borderRadius: 1 }} />}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ marginRight: 8 }}
            >
              <CheckCircleOutline color="success" />
            </motion.div>
            Catalog uploaded successfully!
          </Alert>
        )}

        {files.length > 0 && (
          <List sx={{ mt: 2, maxHeight: 300, overflowY: 'auto' }}>
            {files.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFile(index)} disabled={uploading}>
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemIcon>{renderIcon(file.type)}</ListItemIcon>
                <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  )
}
