'use client'
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, TextField, Button, IconButton, InputAdornment,
  Alert, Fade, Paper, LinearProgress, Chip, useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Visibility, VisibilityOff, Mail, Lock, ArrowForward, DarkMode, LightMode,
  Google, GitHub, Apple, CheckCircle, ErrorOutline
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '@/components/providers/ThemeProvider';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => i);
  
  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((particle) => (
        <motion.div
          key={particle}
          style={{
            position: 'absolute',
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.3)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </Box>
  );
};

// Advanced gradient background
const GradientBackground = ({ isDark }: { isDark: boolean }) => (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      background: isDark
        ? `linear-gradient(135deg, 
            #0f172a 0%, 
            #1e293b 25%, 
            #334155 50%, 
            #1e293b 75%, 
            #0f172a 100%)`
        : `linear-gradient(135deg, 
            #667eea 0%, 
            #764ba2 25%, 
            #f093fb 50%, 
            #f5576c 75%, 
            #4facfe 100%)`,
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: isDark
          ? `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
             radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
             radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)`
          : `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
             radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
             radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)`,
      },
    }}
  >
    <FloatingParticles />
  </Box>
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginStep, setLoginStep] = useState(0); // 0: form, 1: loading, 2: success
  const { isDark, toggleTheme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useMediaQuery('(max-width:900px)');

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const watchedFields = watch();

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setLoginError('');
    setLoginStep(1);
    
    // Simulate API call with realistic timing
    setTimeout(() => {
      if (data.email === 'admin@email.ai' && data.password === 'password') {
        setLoginStep(2);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setLoginError('Invalid credentials. Try admin@email.ai / password');
        setLoginStep(0);
      }
      setIsLoading(false);
    }, 2000);
  };

  const socialButtons = [
    { icon: <Google />, name: 'Google', color: '#ea4335' },
    { icon: <GitHub />, name: 'GitHub', color: '#333' },
    { icon: <Apple />, name: 'Apple', color: '#000' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <GradientBackground isDark={isDark} />
      
      {/* Interactive cursor glow */}
      <Box
        sx={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 1,
          background: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(99, 102, 241, 0.1) 0%, transparent 100%)`,
          inset: 0,
        }}
      />

      {/* Theme toggle with advanced styling */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}
      >
        <IconButton
          onClick={toggleTheme}
          sx={{
            borderRadius: '50%',
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <motion.div
            animate={{ rotate: isDark ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {isDark ? <LightMode /> : <DarkMode />}
          </motion.div>
        </IconButton>
      </motion.div>

      <Container 
        maxWidth="lg" 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          position: 'relative', 
          zIndex: 2,
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            width: '100%', 
            alignItems: 'center', 
            gap: { xs: 3, md: 6 },
            flexDirection: { xs: 'column', md: 'row' },
            py: { xs: 4, md: 0 }
          }}
        >
          
          {/* Left side - Marketing content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ 
              flex: 1, 
              display: 'flex',
              width: '100%',
              maxWidth: { xs: '100%', md: 500 },
              order: { xs: 2, md: 1 }
            }}
          >
            <Box sx={{ 
              color: 'white', 
              maxWidth: { xs: '100%', md: 500 },
              textAlign: { xs: 'center', md: 'left' },
              px: { xs: 2, md: 0 }
            }}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Typography 
                  variant={isMobile ? "h4" : "h2"} 
                  fontWeight="bold" 
                  gutterBottom 
                  sx={{ 
                    background: 'linear-gradient(45deg, #fff 30%, rgba(255,255,255,0.7) 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Welcome to the Future of Email
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Typography 
                  variant={isMobile ? "body1" : "h6"} 
                  sx={{ 
                    opacity: 0.9, 
                    mb: 4, 
                    fontWeight: 300,
                    px: { xs: 2, md: 0 }
                  }}
                >
                  Experience AI-powered email management that revolutionizes your productivity. 
                  Unify all your accounts, automate responses, and never miss important messages again.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1.5, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  px: { xs: 2, md: 0 }
                }}>
                  {['AI-Powered', 'Multi-Provider', 'Secure', 'Real-time'].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <Chip
                        label={feature}
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          fontSize: { xs: '0.7rem', sm: '0.875rem' },
                          height: { xs: 28, sm: 32 }
                        }}
                      />
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Box>
          </motion.div>

          {/* Right side - Login form */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ 
              flex: 1, 
              width: '100%',
              maxWidth: { xs: '100%', sm: 450, md: 500 },
              order: { xs: 1, md: 2 }
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, sm: 5, md: 6 },
                borderRadius: 4,
                background: isDark
                  ? 'rgba(30, 41, 59, 0.8)'
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
                boxShadow: isDark
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                width: '100%',
                maxWidth: { xs: '100%', sm: 450, md: 500 },
                mx: 'auto'
              }}
            >
              <Box textAlign="center" mb={4}>
                <motion.div
                  animate={{ 
                    rotateY: loginStep === 2 ? 360 : 0,
                    scale: loginStep === 2 ? 1.2 : 1 
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <Box
                    sx={{
                      width: { xs: 80, sm: 100 },
                      height: { xs: 80, sm: 100 },
                      borderRadius: '50%',
                      background: loginStep === 2 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -3,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
                        animation: loginStep === 1 ? 'spin 2s linear infinite' : 'none',
                        zIndex: -1,
                      },
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {loginStep === 2 ? (
                        <motion.div
                          key="success"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <CheckCircle sx={{ fontSize: { xs: 40, sm: 50 }, color: 'white' }} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="mail"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Mail sx={{ fontSize: { xs: 40, sm: 50 }, color: 'white' }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                </motion.div>

                <AnimatePresence mode="wait">
                  {loginStep === 2 ? (
                    <motion.div
                      key="success-text"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                        Welcome Back!
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Redirecting to your dashboard...
                      </Typography>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="login-text"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Sign In
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Enter your credentials to access your account
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>

              <AnimatePresence>
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert 
                      severity="error" 
                      icon={<ErrorOutline />}
                      sx={{ mb: 3, borderRadius: 2 }}
                    >
                      {loginError}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {loginStep !== 2 && (
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      margin="normal"
                      {...register('email')}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail color={watchedFields.email ? 'primary' : 'action'} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
                          },
                        },
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      margin="normal"
                      {...register('password')}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color={watchedFields.password ? 'primary' : 'action'} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              disabled={isLoading}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
                          },
                        },
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      endIcon={!isLoading && <ArrowForward />}
                      sx={{
                        height: 56,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                        transition: 'all 0.3s ease',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                          transition: 'left 0.5s',
                        },
                        '&:hover::before': {
                          left: '100%',
                        },
                      }}
                    >
                      {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                              }}
                            />
                          </motion.div>
                          Signing In...
                        </Box>
                      ) : (
                        'Sign In'
                      )}
                    </Button>

                    {isLoading && (
                      <LinearProgress
                        sx={{
                          mt: 1,
                          borderRadius: 1,
                          height: 4,
                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                          },
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Social login buttons */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Or continue with
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mt: 2 }}>
                        {socialButtons.map((social, index) => (
                          <motion.div
                            key={social.name}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <IconButton
                              sx={{
                                width: 44,
                                height: 44,
                                bgcolor: 'background.paper',
                                border: '2px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)',
                                },
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {social.icon}
                            </IconButton>
                          </motion.div>
                        ))}
                      </Box>
                    </Box>
                  </motion.div>
                </Box>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Box textAlign="center" mt={3}>
                  <Typography variant="body2" color="text.secondary">
                    Demo Credentials: <strong>admin@email.ai</strong> / <strong>password</strong>
                  </Typography>
                </Box>
              </motion.div>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}