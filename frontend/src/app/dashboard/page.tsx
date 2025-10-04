'use client'
import React from 'react'
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Paper, Button, List, ListItem, ListItemText,
  IconButton, Chip, Divider, Tooltip, Badge, LinearProgress
} from '@mui/material'
import {
  AddCircleOutline, Inbox, CloudUpload, Approval, WarningAmber, ContactSupport, TipsAndUpdates,
  CheckCircleOutline, Info, VerifiedUser, Nightlight, LightMode, Notifications, HelpOutline, History,
  Language, AlternateEmail, AccessTime, Star
} from '@mui/icons-material'

const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const user = {
  name: "John Doe",
  role: "Business Owner",
  avatar: "/avatar-placeholder.png"
}

const quickActions = [
  { label: 'Review Inbox', desc: 'See all business emails at a glance', icon: <Inbox />, href: '/dashboard/inbox', color: 'primary' },
  { label: 'Upload Catalog', desc: 'Add products or services instantly', icon: <CloudUpload />, href: '/dashboard/catalog', color: 'success' },
  { label: 'Draft Approvals', desc: 'Approve AI-generated responses waiting for you', icon: <Approval />, href: '/dashboard/inbox?tab=review', color: 'secondary' },
  { label: 'Live Support', desc: 'Ask for help or request a demo', icon: <ContactSupport />, href: '/support', color: 'warning' }
]

const onboardingTips = [
  "✓ Link all your email accounts for a unified view",
  "✓ Upload your product/service catalog (PDF, Excel, CSV)",
  "✓ Set your auto-reply and priority preferences in Settings",
  "✓ Mark important customers as VIP for faster response",
  "✓ Use the Review tab to approve or edit AI drafts",
]

const pendingTasks = [
  { label: "3 urgent responses need review", icon: <WarningAmber color="error" />, href: "/dashboard/inbox?tab=review", priority: "urgent" },
  { label: "New upload required: services catalog", icon: <CloudUpload color="success" />, href: "/dashboard/catalog", priority: "high" },
  { label: "Finish onboarding for enhanced auto-replies", icon: <TipsAndUpdates color="primary" />, href: "/dashboard/settings", priority: "normal" }
]

const liveNotifications = [
  { label: "AI draft response suggested for 'Bulk Order'", time: "2m ago", href: "/dashboard/inbox?tab=review" },
  { label: "Gmail integration healthy", time: "12m ago", icon: <AlternateEmail color="primary" /> },
  { label: "VIP client reply sent", time: "20m ago", icon: <Star color="warning" /> },
]

const systemStatus = [
  { label: "AI Engine", status: "Online", icon: <VerifiedUser color="success" />, color: "success" },
  { label: "Gmail", status: "Connected", icon: <AlternateEmail color="primary" />, color: "primary" },
  { label: "Outlook", status: "Connected", icon: <Language sx={{ color: "#0078d4" }} />, color: "info" },
  { label: "Bulk Quota", status: "85% Used", icon: <AccessTime color="warning" />, color: "warning", progress: 85 },
]

const whatsNew = [
  { title: "Meet Smart Escalation", desc: "AI now flags requests needing human touch, so nothing is missed." },
  { title: "VIP Customer Routing", desc: "Automatically prioritize top clients for faster help." },
  { title: "Dark Mode Improvements", desc: "Scheduling and accessibility upgrades for less eye strain at night." }
]

export default function HomePage() {
  return (
    <Box sx={{ maxWidth: 1250, mx: "auto", py: 4, minHeight: "85vh" }}>
      {/* Greeting & Profile */}
      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" mb={4} gap={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={user.avatar} sx={{ width: 60, height: 60, boxShadow: 2 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {getGreeting()}, {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {today} • {user.role}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutline />}
          href="/dashboard/catalog"
          sx={{ fontWeight: 700, borderRadius: 2, minWidth: 180, boxShadow: 4 }}
        >
          Quick Upload Catalog
        </Button>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} mb={4}>
        {quickActions.map((action, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                minHeight: 150,
                borderRadius: 4,
                textAlign: "center",
                cursor: "pointer",
                boxShadow: 2,
                p: 0,
                bgcolor: `${action.color}.50`,
                "&:hover": { boxShadow: 7, bgcolor: `${action.color}.100` }
              }}
              onClick={() => window.location.href = action.href}
            >
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: `${action.color}.main`,
                    color: "white",
                    mb: 1,
                    mx: "auto",
                    width: 42,
                    height: 42,
                    boxShadow: 3
                  }}
                >
                  {action.icon}
                </Avatar>
                <Typography variant="subtitle1" fontWeight={700}>{action.label}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {action.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Live Notifications & Tasks */}
      <Grid container spacing={3} mb={4}>
        {/* To-Do Section */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ borderRadius: 4, p: 3, boxShadow: 2, minHeight: 220 }}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Outstanding Tasks
            </Typography>
            <List>
              {pendingTasks.map((t) => (
                <ListItem
                  key={t.label}
                  button
                  onClick={() => t.href && (window.location.href = t.href)}
                  sx={{ borderLeft: t.priority === 'urgent' ? '4px solid #ef4444' : t.priority === 'high' ? '4px solid #f59e0b' : '4px solid #64748b', mb: 1, borderRadius: 2 }}
                >
                  <ListItemText primary={t.label} />
                  {t.icon}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        {/* Live Feed Section */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ borderRadius: 4, p: 3, boxShadow: 2, minHeight: 220 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Notifications color="primary" sx={{ mr: 1 }} />
              <Typography fontWeight="bold">Live Notifications</Typography>
            </Box>
            <List>
              {liveNotifications.map((n, i) => (
                <ListItem key={i} secondaryAction={
                  <Typography color="text.secondary" fontSize={13}>{n.time}</Typography>
                }>
                  <ListItemText primary={n.label} />
                  {n.icon}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Onboarding Tips and What's New */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <TipsAndUpdates color="primary" />
              <Typography variant="h6" fontWeight="bold">Onboarding Tips</Typography>
              <Tooltip title="Get the most out of the platform!"><HelpOutline color="info" /></Tooltip>
            </Box>
            <List>
              {onboardingTips.map((tip, i) => (
                <ListItem key={i} dense>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
            <Button href="/docs" size="small" variant="outlined" sx={{ mt: 2 }}>
              Learn More
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Info color="info" />
              <Typography variant="h6" fontWeight="bold">What's New</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {whatsNew.map((w, i) => (
              <Box key={i} mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">{w.title}</Typography>
                <Typography variant="body2" color="text.secondary">{w.desc}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* System Health */}
      <Paper sx={{ borderRadius: 4, p: 3, boxShadow: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <VerifiedUser color="success" />
          <Typography variant="h6" fontWeight="bold">System Health</Typography>
        </Box>
        <Grid container spacing={2}>
          {systemStatus.map((s, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Box display="flex" alignItems="center" gap={2} bgcolor={`${s.color}.50`} p={2} borderRadius={2}>
                {s.icon}
                <Box>
                  <Typography fontWeight="bold">{s.label}</Typography>
                  <Typography variant="body2" color="text.secondary">{s.status}</Typography>
                  {s.progress !== undefined && (
                    <LinearProgress
                      variant="determinate"
                      value={s.progress}
                      sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: "grey.100" }}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  )
}
