import { Box } from '@mui/material';
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
}