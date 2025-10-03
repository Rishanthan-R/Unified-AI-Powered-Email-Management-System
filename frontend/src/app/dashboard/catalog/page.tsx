'use client'
import React, { useState } from 'react'
import {
  Box, Typography, Paper, Button, LinearProgress, Table,
  TableHead, TableRow, TableCell, TableBody, TableContainer
} from '@mui/material'
import { motion } from 'framer-motion'
import { CloudUpload, CheckCircleOutline } from '@mui/icons-material'
import { uploadCatalog } from '@/lib/api'
import { Product } from '@/types'

export default function CatalogPage() {
  const [file, setFile] = useState<File | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null)
    setSuccess(false)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('catalog', file)
    try {
      await uploadCatalog(form)
      // fetch updated catalog
      // mock:
      setProducts([
        { id: 1, name: 'Widget A', price: 29.99, sku: 'WID-A', description: 'Premium widget' },
        { id: 2, name: 'Widget B', price: 19.99, sku: 'WID-B', description: 'Basic widget' }
      ])
      setSuccess(true)
    } catch {
      setSuccess(false)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Product Catalog</Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <input
          accept=".csv,.json"
          style={{ display: 'none' }}
          id="catalog-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="catalog-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUpload />}
            sx={{ mr: 2 }}
          >
            Choose File
          </Button>
        </label>
        {file && <Typography component="span">{file.name}</Typography>}

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            Upload Catalog
          </Button>
        </Box>
        {uploading && <LinearProgress sx={{ mt: 2 }} />}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'success.main' }}>
              <CheckCircleOutline sx={{ mr: 1 }} />
              <Typography>Catalog uploaded successfully!</Typography>
            </Box>
          </motion.div>
        )}
      </Paper>

      {products.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell>${p.price}</TableCell>
                  <TableCell>{p.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
