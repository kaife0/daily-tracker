import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  CheckCircle, 
  Speed, 
  Timeline, 
  People, 
  TrendingUp, 
  Star
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div
    whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
    transition={{ duration: 0.3 }}
  >
    <Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Box sx={{ mb: 2, color: 'primary.main' }}>
          {icon}
        </Box>
        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Card>
  </motion.div>
);

export default function LandingPage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 10, md: 20 },
          px: 3,
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Set Goals, Track Progress, Achieve More
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Typography 
              variant="h6" 
              component="p" 
              sx={{ 
                mb: 5, 
                maxWidth: '800px', 
                mx: 'auto',
                opacity: 0.9
              }}
            >
              The smart way to manage personal and team goals. Track progress, celebrate wins, and reach new heights together.
            </Typography>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              component={RouterLink} 
              to="/dashboard" 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ 
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: 5,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(66, 165, 245, 0.4)',
                }
              }}
            >
              Get Started Now
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            component="span" 
            sx={{ 
              color: 'primary.main', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontSize: '0.9rem'
            }}
          >
            Key Features
          </Typography>
          <Typography variant="h3" component="h2" sx={{ mt: 1, mb: 2, fontWeight: 700 }}>
            Why Choose Goal Tracker
          </Typography>
          <Divider sx={{ width: 80, mx: 'auto', mb: 3, borderColor: 'primary.main', borderWidth: 2 }} />
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Our platform provides powerful tools to help you set, track and achieve your goals more effectively.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<Speed sx={{ fontSize: 50 }} />} 
              title="Progress Tracking" 
              description="Visualize your progress with intuitive charts and metrics that keep you motivated and on target."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<Timeline sx={{ fontSize: 50 }} />} 
              title="Milestone Management" 
              description="Break down your goals into achievable milestones to make complex objectives more manageable."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              icon={<People sx={{ fontSize: 50 }} />} 
              title="Team Collaboration" 
              description="Work together with your team on shared goals with real-time updates and communication."
            />
          </Grid>
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'rgba(66, 165, 245, 0.05)', py: 8 }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography 
                  component="span" 
                  sx={{ 
                    color: 'primary.main', 
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontSize: '0.9rem'
                  }}
                >
                  Simple Process
                </Typography>
                <Typography variant="h3" component="h2" sx={{ mt: 1, mb: 4, fontWeight: 700 }}>
                  How It Works
                </Typography>
                
                <List>
                  {[
                    {
                      icon: <CheckCircle color="primary" />,
                      primary: 'Create your goals',
                      secondary: 'Set clear objectives with descriptions, target dates and progress metrics.'
                    },
                    {
                      icon: <Star color="primary" />,
                      primary: 'Add milestones',
                      secondary: 'Break down goals into achievable steps with their own completion tracking.'
                    },
                    {
                      icon: <TrendingUp color="primary" />,
                      primary: 'Track your progress',
                      secondary: 'Update your progress and see visual representations of how far you\'ve come.'
                    },
                    {
                      icon: <People color="primary" />,
                      primary: 'Collaborate with others',
                      secondary: 'Share goals with your team, add comments, and work together to achieve more.'
                    }
                  ].map((item, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="h6">{item.primary}</Typography>} 
                        secondary={item.secondary}
                      />
                    </ListItem>
                  ))}
                </List>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(rgba(25, 118, 210, 0.9), rgba(13, 71, 161, 0.9)), url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          py: 10,
          px: 3
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Ready to Achieve Your Goals?
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, opacity: 0.9 }}>
            Reach your full potential with Goal Tracker.
          </Typography>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              component={RouterLink} 
              to="/dashboard" 
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main', 
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              Start Tracking Now
            </Button>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}