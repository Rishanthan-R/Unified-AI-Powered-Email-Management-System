'use client'
import React, { useEffect, useState } from 'react'
import {
  Grid, Card, CardContent, Typography, Box, LinearProgress, Chip,
  Avatar, IconButton, Paper, Divider, Button, CircularProgress
} from '@mui/material'
import {
  Email, SmartToy, Schedule, TrendingUp, Notifications, CheckCircle,
  AccessTime, Person, Business, Analytics, Reply, Forward, Star,
  FilterList, Warning, AlternateEmail, Language // <-- Add AlternateEmail here!
} from '@mui/icons-material'

import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

// Enhanced types for our dashboard data
interface EmailMetrics {
  totalEmails: number
  businessEmails: number
  aiResponded: number
  pendingReview: number
  escalated: number
  avgResponseTime: string
  successRate: number
}

interface ProviderStats {
  gmail: { count: number; avgTime: string; priority: 'high' | 'medium' | 'low' }
  outlook: { count: number; avgTime: string; priority: 'high' | 'medium' | 'low' }
  yahoo: { count: number; avgTime: string; priority: 'high' | 'medium' | 'low' }
}

interface ProductInsights {
  catalogItems: number
  queriedProducts: number
  topProducts: string[]
  missedOpportunities: string[]
  conversionRate: number
}

// Mock data - replace with API calls
const mockEmailMetrics: EmailMetrics = {
  totalEmails: 247,
  businessEmails: 189,
  aiResponded: 145,
  pendingReview: 28,
  escalated: 30,
  avgResponseTime: '2.3 min',
  successRate: 76.5
}

const mockProviderStats: ProviderStats = {
  gmail: { count: 111, avgTime: '1.8 min', priority: 'high' },
  outlook: { count: 89, avgTime: '2.1 min', priority: 'high' },
  yahoo: { count: 47, avgTime: '3.2 min', priority: 'medium' }
}

const mockProductInsights: ProductInsights = {
  catalogItems: 156,
  queriedProducts: 89,
  topProducts: ['Small Bag Printing', 'Business Cards', 'Flyers', 'Stickers'],
  missedOpportunities: ['Large Banners', 'Vinyl Stickers', 'T-shirt Printing'],
  conversionRate: 67.3
}

// Chart data
const responseTimeData = [
  { time: '09:00', responses: 23 },
  { time: '12:00', responses: 45 },
  { time: '15:00', responses: 67 },
  { time: '18:00', responses: 34 },
  { time: '21:00', responses: 12 }
]

const emailCategoryData = [
  { name: 'AI Resolved', value: 145, color: '#10b981' },
  { name: 'Pending Review', value: 28, color: '#f59e0b' },
  { name: 'Escalated', value: 30, color: '#ef4444' }
]

export default function EnhancedDashboard() {
  const [metrics, setMetrics] = useState<EmailMetrics>(mockEmailMetrics)
  const [providers, setProviders] = useState<ProviderStats>(mockProviderStats)
  const [products, setProducts] = useState<ProductInsights>(mockProductInsights)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('today')

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box display="flex" justifyContent="between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              AI Email Command Center
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time insights into your automated email operations
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            {['today', '7days', '30days'].map((period) => (
              <Button
                key={period}
                variant={selectedTimeframe === period ? 'contained' : 'outlined'}
                onClick={() => setSelectedTimeframe(period)}
                size="small"
              >
                {period === 'today' ? 'Today' : period === '7days' ? '7 Days' : '30 Days'}
              </Button>
            ))}
          </Box>
        </Box>
      </motion.div>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} mb={4}>
        {[
          {
            title: 'Total Business Emails',
            value: metrics.businessEmails,
            subtitle: 'Filtered from spam/promotions',
            icon: <Email color="primary" />,
            color: 'primary',
            trend: '+12%',
            delay: 0
          },
          {
            title: 'AI Auto-Responded',
            value: metrics.aiResponded,
            subtitle: `${metrics.successRate}% success rate`,
            icon: <SmartToy sx={{ color: '#10b981' }} />,
            color: 'success',
            trend: '+8%',
            delay: 0.1
          },
          {
            title: 'Pending Review',
            value: metrics.pendingReview,
            subtitle: 'Need human verification',
            icon: <Schedule sx={{ color: '#f59e0b' }} />,
            color: 'warning',
            trend: '-3%',
            delay: 0.2
          },
          {
            title: 'Avg Response Time',
            value: metrics.avgResponseTime,
            subtitle: 'Faster than industry avg',
            icon: <AccessTime sx={{ color: '#06b6d4' }} />,
            color: 'info',
            trend: '-15%',
            delay: 0.3
          }
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={metric.title}>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: metric.delay, duration: 0.5 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  background: `linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0.1) 100%)`,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 40px rgba(99, 102, 241, 0.2)'
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="between" alignItems="flex-start" mb={2}>
                    <Avatar sx={{ bgcolor: 'background.paper', boxShadow: 2 }}>
                      {metric.icon}
                    </Avatar>
                    <Chip 
                      label={metric.trend} 
                      size="small" 
                      color={metric.trend.startsWith('+') ? 'success' : metric.trend.startsWith('-') ? 'error' : 'default'}
                    />
                  </Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  </Typography>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {metric.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {metric.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        {/* Response Time Chart */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="600">
                    AI Response Activity
                  </Typography>
                  <IconButton><FilterList /></IconButton>
                </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="responses" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#6366f1', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Email Categories Pie Chart */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Email Resolution Status
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={emailCategoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {emailCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box mt={2}>
                  {emailCategoryData.map((item) => (
                    <Box key={item.name} display="flex" justifyContent="between" alignItems="center" mb={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box width={12} height={12} bgcolor={item.color} borderRadius="50%" />
                        <Typography variant="body2">{item.name}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="600">{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Email Providers & Product Insights */}
      <Grid container spacing={3} mb={4}>
        {/* Email Provider Statistics */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Email Provider Performance
                </Typography>
                {Object.entries(providers).map(([provider, stats]) => {
                  const providerIcons = {
                       gmail: <AlternateEmail sx={{ color: '#ea4335' }} />,
                      outlook: <Language sx={{ color: '#0078d4' }} />,
                      yahoo: <Email sx={{ color: '#7c3aed' }} />
                      }
                  
                  return (
                    <Box key={provider} mb={3}>
                      <Box display="flex" justifyContent="between" alignItems="center" mb={1}>
                        <Box display="flex" alignItems="center" gap={2}>
                          {providerIcons[provider as keyof typeof providerIcons]}
                          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                            {provider}
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="body2" fontWeight="600">
                            {stats.count} emails
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Avg: {stats.avgTime}
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.count / metrics.businessEmails) * 100}
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: stats.priority === 'high' ? '#10b981' : stats.priority === 'medium' ? '#f59e0b' : '#64748b'
                          }
                        }}
                      />
                    </Box>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Product Insights */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Product Intelligence
                </Typography>
                
                <Box mb={3}>
                  <Box display="flex" justifyContent="between" mb={1}>
                    <Typography variant="body2">Catalog Coverage</Typography>
                    <Typography variant="body2" fontWeight="600">
                      {products.queriedProducts}/{products.catalogItems} items
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(products.queriedProducts / products.catalogItems) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Box mb={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    🔥 Top Requested Products
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {products.topProducts.map((product) => (
                      <Chip
                        key={product}
                        label={product}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    💡 Missed Opportunities
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {products.missedOpportunities.map((product) => (
                      <Chip
                        key={product}
                        label={product}
                        size="small"
                        color="warning"
                        variant="outlined"
                        icon={<Warning sx={{ fontSize: 16 }} />}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Review Pending Emails', icon: <Schedule />, color: 'warning', count: 28 },
                { label: 'Check Escalated Items', icon: <Warning />, color: 'error', count: 30 },
                { label: 'Update Catalog', icon: <Business />, color: 'info', count: null },
                { label: 'View Analytics', icon: <Analytics />, color: 'primary', count: null }
              ].map((action) => (
                <Grid item xs={12} sm={6} md={3} key={action.label}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={action.icon}
                    endIcon={action.count && (
                      <Chip 
                        label={action.count} 
                        size="small" 
                        color={action.color as any}
                      />
                    )}
                    sx={{ 
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderColor: `${action.color}.main`,
                      '&:hover': {
                        bgcolor: `${action.color}.50`,
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {action.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  )
}
