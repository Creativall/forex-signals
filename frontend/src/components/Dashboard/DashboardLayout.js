import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import TopNavigation from './TopNavigation';
import Sidebar from './Sidebar';

const drawerWidth = 280;

const DashboardLayout = ({ 
  user, 
  onLogout, 
  activeTab, 
  onTabChange, 
  children,
  notifications = [],
  onMarkNotificationsRead
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.9)} 0%, ${alpha('#ffffff', 0.95)} 100%)`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.1)}`,
          color: theme.palette.text.primary,
        }}
      >
        <TopNavigation
          user={user}
          onLogout={onLogout}
          onMenuToggle={handleDrawerToggle}
          notifications={notifications}
          onMarkNotificationsRead={onMarkNotificationsRead}
          isMobile={isMobile}
        />
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: theme.palette.mode === 'dark' 
                ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
                : `linear-gradient(180deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha('#ffffff', 0.9)} 100%)`,
              backdropFilter: 'blur(20px)',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            },
          }}
        >
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={onTabChange}
            onClose={() => setMobileOpen(false)}
            isMobile={true}
          />
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: theme.palette.mode === 'dark' 
                ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
                : `linear-gradient(180deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha('#ffffff', 0.9)} 100%)`,
              backdropFilter: 'blur(20px)',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            },
          }}
          open
        >
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={onTabChange}
            isMobile={false}
          />
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: theme.palette.mode === 'dark'
            ? `radial-gradient(ellipse at top, ${alpha(theme.palette.primary.dark, 0.05)} 0%, ${theme.palette.background.default} 50%)`
            : `radial-gradient(ellipse at top, ${alpha(theme.palette.primary.light, 0.03)} 0%, ${theme.palette.background.default} 50%)`,
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Container
          maxWidth={false}
          sx={{
            py: { xs: 2, md: 3 },
            px: { xs: 2, md: 3 },
            maxWidth: '1600px',
            mx: 'auto',
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout; 