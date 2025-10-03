'use client'
import React, { useState } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

interface Product {
  id: number;
  name: string;
  price: number;
  sku: string;
  description: string;
}

export default function CatalogPage() {
  const [file, setFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Widget A', price: 29.99, sku: 'WID-A', description: 'Premium widget' },
    { id: 2, name: 'Widget B', price: 19.99, sku: 'WID-B', description: 'Basic widget' }
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    // TODO: Parse file and update products
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Product Catalog Upload</Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <input
          accept=".csv,.json"
          style={{ display: 'none' }}
          id="catalog-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="catalog-upload">
          <Button variant="outlined" component="span">
            Select Catalog File
          </Button>
        </label>
        {file && <Typography sx={{ ml: 2 }}>{file.name}</Typography>}
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
