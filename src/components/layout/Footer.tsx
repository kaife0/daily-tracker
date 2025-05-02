import { Box, Container, Grid, Link, Typography, IconButton, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[900],
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* @ts-ignore */}
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" gutterBottom>
                Goal Tracker
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ color: 'grey.400' }}>
                Set goals, track progress, achieve results. Our platform helps you stay focused and motivated.
              </Typography>
            </motion.div>
          </Grid>
          {/* @ts-ignore */}
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <EmailIcon fontSize="small" sx={{ color: 'grey.500' }} />
                <Typography variant="body2" color="grey.400">
                  mdkaif1590@gmail.com
                </Typography>
              </Stack>
              <Box sx={{ mt: 2 }}>
                <IconButton 
                  component={Link}
                  href="https://github.com/kaife0" 
                  target="_blank" 
                  rel="noopener"
                  sx={{ 
                    color: 'grey.400', 
                    '&:hover': { color: 'white' },
                    mr: 1
                  }}
                  aria-label="GitHub"
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton 
                  component={Link}
                  href="https://www.linkedin.com/in/md-kaif-a229652b9" 
                  target="_blank"
                  rel="noopener"
                  sx={{ 
                    color: 'grey.400', 
                    '&:hover': { color: '#0077b5' }
                  }}
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ color: 'grey.500' }}>
            {'© '}
            <Link color="inherit" href="#">
              Goal Tracker
            </Link>{' '}
            {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}