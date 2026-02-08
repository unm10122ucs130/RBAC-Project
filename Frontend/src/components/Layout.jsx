
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon,
  Badge as BadgeIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, logout, hasPermission } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, path: '/users', permission: 'USER_READ' },
    { text: 'Roles', icon: <SecurityIcon />, path: '/roles', permission: 'ROLE_READ' },
    { text: 'Employees', icon: <BadgeIcon />, path: '/employees', permission: 'EMPLOYEE_READ' },
    { text: 'Projects', icon: <AssignmentIcon />, path: '/projects', permission: 'PROJECT_READ' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          RBAC System
        </Typography>
      </Toolbar>

      <Divider />

      <List>
        {menuItems.map((item) =>
          (!item.permission || hasPermission(item.permission)) && (
            <ListItem
              key={item.text}
              component={NavLink}
              to={item.path}
              sx={{
                color: 'text.primary',
                '&.active': {
                  backgroundColor: '#e3f2fd',
                  borderRight: '4px solid #1976d2'
                },
                '&:hover': {
                  backgroundColor: '#f5f9ff'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          )
        )}
      </List>

      <Divider />

      <List>
        <ListItem
          button
          onClick={logout}
          sx={{
            color: 'error.main',
            '&:hover': { backgroundColor: '#fdecea' }
          }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      {/* 🔝 APP BAR */}
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" fontWeight="bold">
            Dashboard
          </Typography>
          <Box sx={{ml:'auto', display: 'flex', alignItems: 'center', gap: 2}}>
            <Typography variant="h1" sx={{color: 'text.light', fontSize: 24,textTransform:'capitalize'}}>
              {user?.username}
            </Typography>
            <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: 'white',
              fontSize: 22,
              color: 'primary.main',
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          </Box>
          

        </Toolbar>
      </AppBar>

      {/* 📂 DRAWER */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              backgroundColor: '#fafafa'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* 📄 MAIN CONTENT + FOOTER */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar />

        {/* Page Content */}
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>

        {/* 🔻 FOOTER */}
        <Box
          sx={{
            mt: 4,
            py: 2,
            textAlign: 'center',
            color: 'text.secondary',
            borderTop: '1px solid #eee'
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} RBAC System
          </Typography>
          <Typography variant="caption">
            Secure • Scalable • Role-Based Access Control
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
