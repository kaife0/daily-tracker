import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Button, 
  MenuItem,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { motion } from 'framer-motion';

const USER_NAME_KEY = 'dailyTracker_userName';

const navigation = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'My Goals', path: '/goals' },
  { name: 'Team Goals', path: '/goals?tab=team' }
];

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState<string>('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  useEffect(() => {
    const storedName = localStorage.getItem(USER_NAME_KEY);
    if (storedName) setUserName(storedName);
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    localStorage.setItem(USER_NAME_KEY, e.target.value);
  };

  // Check if the current route matches the nav item path
  const isActive = (path: string) => {
    if (path === '/goals?tab=team') {
      // For Team Goals, we need to check if the URL has the team tab parameter
      return location.pathname === '/goals' && location.search.includes('tab=team');
    } else if (path === '/goals') {
      // For My Goals, check if we're on the goals page WITHOUT any tab parameter
      // or with a tab parameter that's not "team" (could be "completed")
      return location.pathname === '/goals' && 
        (!location.search || !location.search.includes('tab=team'));
    }
    // For other pages, just match the pathname
    return location.pathname === path;
  };

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #1976d2, #0d47a1)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ px: { xs: 1, md: 2 } }}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
                padding: '6px 16px',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              GOAL TRACKER
            </Typography>
          </motion.div>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {navigation.map((item) => (
                <MenuItem 
                  key={item.name} 
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={item.path}
                  selected={isActive(item.path)}
                >
                  <Typography textAlign="center">{item.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              letterSpacing: { xs: '0.1rem', sm: '0.2rem' },
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            GOAL TRACKER
          </Typography>
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center'
          }}>
            {navigation.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  component={RouterLink}
                  to={item.path}
                  onClick={handleCloseNavMenu}
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    display: 'block', 
                    mx: 1,
                    position: 'relative',
                    fontWeight: isActive(item.path) ? 'bold' : 'medium',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    },
                    '&::after': isActive(item.path) ? {
                      content: '""',
                      position: 'absolute',
                      bottom: '5px',
                      left: '15%',
                      width: '70%',
                      height: '3px',
                      backgroundColor: '#fff',
                      borderRadius: '3px'
                    } : {}
                  }}
                >
                  {item.name}
                </Button>
              </motion.div>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}