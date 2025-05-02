import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { motion } from 'framer-motion';

import { useGoals } from '../context/GoalContext';
import GoalCard from '../components/goals/GoalCard';
import CreateGoalForm from '../components/goals/CreateGoalForm';
import { Goal } from '../types';

export default function GoalsPage() {
  const { goals } = useGoals();
  const [openCreateGoal, setOpenCreateGoal] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use URL params to determine initial tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    if (tab === 'team') {
      setTabValue(1);
    } else if (tab === 'completed') {
      setTabValue(2);
    } else {
      setTabValue(0);
    }
  }, [location]);
  
  // Filter goals based on selected tab
  useEffect(() => {
    if (tabValue === 0) {
      // Personal Goals (no teamId)
      setFilteredGoals(goals.filter(goal => !goal.teamId));
    } else if (tabValue === 1) {
      // Team Goals (has teamId)
      setFilteredGoals(goals.filter(goal => goal.teamId));
    } else {
      // Completed Goals (100% progress)
      setFilteredGoals(goals.filter(goal => goal.progress === 100));
    }
  }, [tabValue, goals]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    
    // Update URL when tab changes, without reloading page
    if (newValue === 0) {
      navigate('/goals', { replace: true });
    } else if (newValue === 1) {
      navigate('/goals?tab=team', { replace: true });
    } else if (newValue === 2) {
      navigate('/goals?tab=completed', { replace: true });
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Goals
        </Typography>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />} 
            onClick={() => setOpenCreateGoal(true)}
          >
            Create New Goal
          </Button>
        </motion.div>
      </Box>
      
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Personal Goals" />
          <Tab label="Team Goals" />
          <Tab label="Completed Goals" />
        </Tabs>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        {filteredGoals.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {tabValue === 0 && "You don't have any personal goals yet."}
              {tabValue === 1 && "No team goals available."}
              {tabValue === 2 && "You haven't completed any goals yet."}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Add />}
              onClick={() => setOpenCreateGoal(true)}
              sx={{ mt: 2 }}
            >
              Create Your First Goal
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredGoals.map((goal) => (
              <Grid item xs={12} key={goal.id}>
                <GoalCard goal={goal} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      
      <CreateGoalForm open={openCreateGoal} onClose={() => setOpenCreateGoal(false)} />
    </Container>
  );
}