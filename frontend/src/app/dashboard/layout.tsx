'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  Inbox,
  CloudUpload,
  BarChart as Analytics,
  Notifications,
  AccountCircle,
  DarkMode,
  LightMode,
  Logout,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'

const drawerWidth = 260

const navItems = [
  { text: 'Home', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Inbox', icon: <Inbox />, path: '/dashboard/inbox' },
  { text: 'Catalog', icon: <CloudUpload />, path: '/dashboard/catalog' },
  { text: 'Analytics', icon: <Analytics />, path: '/dashboard/analytics' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { isDark, toggleTheme } = useTheme()
  const path = usePathname()

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const drawer = (
    <Box
      sx={{
        height: '100vh',
        bgcolor: isDark ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <Avatar sx={{ width: 64, height: 64, mx: 'auto', bgcolor: 'primary.main' }}>AI</Avatar>
        </motion.div>
        <Typography variant="h6" color="text.primary" sx={{ mt: 1 }}>Email AI</Typography>
      </Box>
      <List>
        {navItems.map(({ text, icon, path: href }) => (
          <Link href={href} key={text} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem disablePadding>
              <ListItemButton
                selected={path === href}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  mx: 2,
                  color: path === href ? 'white' : 'text.primary',
                  bgcolor: path === href ? 'primary.main' : 'transparent',
                  '&:hover': { bgcolor: path === href ? 'primary.dark' : 'primary.light' },
                }}
              >
                <ListItemIcon sx={{ color: path === href ? 'white' : 'inherit' }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={1}
        sx={{
          ml: { sm: `${drawerWidth}px` },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {navItems.find(i => i.path === path)?.text || 'Dashboard'}
          </Typography>

          <IconButton onClick={toggleTheme} color="inherit">
            {isDark ? <LightMode /> : <DarkMode />}
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <AccountCircle />
          </IconButton>

<Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
  <MenuItem
    component={Link}
    href="/dashboard/profile"
    onClick={handleMenuClose}
  >
    Profile
  </MenuItem>
  <MenuItem
    component={Link}
    href="/dashboard/settings"
    onClick={handleMenuClose}
  >
    Settings
  </MenuItem>
  <Divider />
  <MenuItem onClick={() => window.location.href = '/login'}>
    <Logout sx={{ mr: 1 }} /> Logout
  </MenuItem>
</Menu>


        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {children}
        </motion.div>
      </Box>
    </Box>
  )
}
