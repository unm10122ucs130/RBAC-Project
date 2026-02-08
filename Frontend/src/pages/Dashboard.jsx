 // frontend/src/pages/Dashboard.js

import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  Chip
} from '@mui/material';
import {
  AutoGraph,
  Security,
  Settings,
  RocketLaunch,
  Tune,
  CheckCircle,
  ArrowForwardIos
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

/*   Feature list - Data   */
const features = [
  {
    title: 'Security Control',
    desc: 'Manage authentication and access rules',
    icon: <Security />,
    color: '#ff6b6b'
  },
  {
    title: 'System Configuration',
    desc: 'Configure modules and preferences',
    icon: <Settings />,
    color: '#4dabf7'
  },
  {
    title: 'Analytics Ready',
    desc: 'Monitor system performance',
    icon: <AutoGraph />,
    color: '#20c997'
  },
  {
    title: 'Advanced Settings',
    desc: 'Fine tune platform behavior',
    icon: <Tune />,
    color: '#845ef7'
  }
];

/*    Activity data    */
const activities = [
  'Logged in successfully',
  'Dashboard loaded',
  'System permissions verified',
  'User session active'
];

const Dashboard = () => {
  const { user, role } = useAuth();

  return (
    <Box>
      {/*   Header   */}
      <Paper
        sx={{
          p: 5,
          mb: 4,
          borderRadius: 5,
          color: '#fff',
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)'
        }}
      >
        <Typography variant="h3" fontWeight="bold" textTransform="capitalize">
          Welcome back, {user?.username}
        </Typography>

        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Role: {role?.charAt(0) + role?.slice(1).toLowerCase()}
        </Typography>

        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Control, configure, and monitor your system seamlessly
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<RocketLaunch />}
            sx={{
              bgcolor: '#fff',
              color: '#1976d2',
              fontWeight: 'bold',
              borderRadius: 3,
              '&:hover': { bgcolor: '#f0f0f0' }
            }}
          >
            Get Started
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* ------------Profile--------*/}
        <Grid item xs={12} width="100%">
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: '#1976d2',
                  fontSize: 28,
                  mr: 2
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>

              <Box>
                <Typography variant="h6" textTransform="capitalize">
                  {user?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {role?.charAt(0) + role?.slice(1).toLowerCase()}
                </Typography>
              </Box>

              <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                <Typography variant="body2">
                  Status: <strong>Active</strong>
                </Typography>
                <Typography variant="body2">
                  Last Login: <strong>Today</strong>
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary" align="center">
              “Empowering your access control, one permission at a time.”
            </Typography>
          </Paper>
        </Grid>

        {/*     Feature list     */}
        <Grid item xs={12} width='100%'>
          <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
            {features.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  borderBottom:
                    index !== features.length - 1
                      ? '1px solid #eee'
                      : 'none',
                  transition: '0.3s',
                  '&:hover': {
                    backgroundColor: '#f5f9ff'
                  }
                }}
              >
                <Avatar sx={{ bgcolor: item.color, mr: 2 }}>
                  {item.icon}
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>

                <ArrowForwardIos
                  fontSize="small"
                  sx={{ color: '#999' }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} width='100%'>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              backgroundColor: '#f9fafb'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {activities.map((activity, index) => (
              <Box
                key={index}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr auto',
                  alignItems: 'center',
                  gap: 2,
                  py: 1.5,
                  borderBottom:
                    index !== activities.length - 1
                      ? '1px dashed #e0e0e0'
                      : 'none'
                }}
              >
                {/* Icon column */}
                <Avatar
                  sx={{
                    bgcolor: '#e8f5e9',
                    color: '#2e7d32',
                    width: 32,
                    height: 32
                  }}
                >
                  <CheckCircle fontSize="small" />
                </Avatar>

                {/* Message column */}
                <Typography variant="body2">
                  {activity}
                </Typography>

                {/* Time column */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Just now
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;
