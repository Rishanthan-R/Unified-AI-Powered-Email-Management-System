'use client'
import React, { useEffect, useState } from 'react'
import { Grid, Card, CardContent, Typography, Box } from '@mui/material'
import { Email, Send, ShoppingCart, BarChart } from '@mui/icons-material'
import { motion } from 'framer-motion'

interface Stat { icon: React.ReactNode; label: string; value: number }

export default function DashboardHome() {
  const [stats, setStats] = useState<Stat[]>([])

  useEffect(() => {
    // Mock stats; replace with API calls
    setStats([
      { icon: <Email color="primary" />, label: 'Total Emails', value: 1234 },
      { icon: <Send color="success" />, label: 'AI Responses', value: 89 },
      { icon: <ShoppingCart color="secondary" />, label: 'Orders Processed', value: 45 },
      { icon: <BarChart color="warning" />, label: 'Catalog Items', value: 120 }
    ])
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
      <Grid container spacing={3}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {stat.icon}
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">{stat.label}</Typography>
                      <Typography variant="h5">{stat.value}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
