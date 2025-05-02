import { useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider, 
  Button, 
  Chip,
  LinearProgress,
  Paper,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  AccessTime, 
  TrendingUp, 
  Flag, 
  Celebration, 
  EmojiEvents,
  Star,
  DonutLarge,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';

import { useGoals } from '../../context/GoalContext';

export default function Dashboard() {
  const { goals, clearAllData } = useGoals();
  const navigate = useNavigate();
  const [chartView, setChartView] = useState<string>('goals');
  const [openDialog, setOpenDialog] = useState<'clear' | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Calculate dashboard metrics
  const completedGoals = goals.filter(goal => goal.progress === 100);
  const inProgressGoals = goals.filter(goal => goal.progress > 0 && goal.progress < 100);
  const notStartedGoals = goals.filter(goal => goal.progress === 0);
  
  const totalMilestones = goals.reduce((total, goal) => total + goal.milestones.length, 0);
  const completedMilestones = goals.reduce(
    (total, goal) => total + goal.milestones.filter(m => m.completed).length, 
    0
  );
  
  const averageProgress = goals.length 
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) 
    : 0;

  // Get upcoming deadlines
  const today = new Date();
  const upcomingDeadlines = [...goals]
    .filter(goal => new Date(goal.targetDate) > today && goal.progress < 100)
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 3);

  // Get recently completed goals
  const recentlyCompleted = [...completedGoals]
    .sort((a, b) => {
      // Find the latest completed milestone in each goal
      const aLatestDate = a.milestones.reduce((latest, milestone) => 
        milestone.completedAt && new Date(milestone.completedAt) > latest ? new Date(milestone.completedAt) : latest, 
        new Date(0)
      );
      const bLatestDate = b.milestones.reduce((latest, milestone) => 
        milestone.completedAt && new Date(milestone.completedAt) > latest ? new Date(milestone.completedAt) : latest, 
        new Date(0)
      );
      return bLatestDate.getTime() - aLatestDate.getTime();
    })
    .slice(0, 3);

  // Format date to be more readable
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Prepare data for charts
  const goalDistributionData = [
    { name: 'Completed', value: completedGoals.length, color: '#4caf50' },
    { name: 'In Progress', value: inProgressGoals.length, color: '#2196f3' },
    { name: 'Not Started', value: notStartedGoals.length, color: '#ff9800' }
  ].filter(item => item.value > 0);

  // Milestone completion data
  const milestoneData = [
    { name: 'Completed', value: completedMilestones, color: '#4caf50' },
    { name: 'Pending', value: totalMilestones - completedMilestones, color: '#ff9800' }
  ].filter(item => item.value > 0);

  // Generate timeline data for the next 6 months
  const timelineData = generateTimelineData();

  function generateTimelineData() {
    const data: Array<{ name: string, goals: number }> = [];
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);
    
    // Group goals by month
    const monthlyGroups: { [key: string]: number } = {};
    
    goals.forEach(goal => {
      const targetDate = new Date(goal.targetDate);
      if (targetDate >= today && targetDate <= endDate) {
        const monthYear = targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!monthlyGroups[monthYear]) {
          monthlyGroups[monthYear] = 0;
        }
        monthlyGroups[monthYear]++;
      }
    });
    
    // Create sorted timeline data
    const sortedMonths = Object.keys(monthlyGroups).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    
    sortedMonths.forEach(month => {
      data.push({
        name: month,
        goals: monthlyGroups[month]
      });
    });
    
    return data;
  }

  // Group goals by progress brackets for progress distribution chart
  const progressDistributionData = [
    { name: '0%', value: goals.filter(g => g.progress === 0).length },
    { name: '1-25%', value: goals.filter(g => g.progress > 0 && g.progress <= 25).length },
    { name: '26-50%', value: goals.filter(g => g.progress > 25 && g.progress <= 50).length },
    { name: '51-75%', value: goals.filter(g => g.progress > 50 && g.progress <= 75).length },
    { name: '76-99%', value: goals.filter(g => g.progress > 75 && g.progress < 100).length },
    { name: '100%', value: goals.filter(g => g.progress === 100).length }
  ];

  const handleChartViewChange = (
    _: React.MouseEvent<HTMLElement>,
    newView: string,
  ) => {
    if (newView !== null) {
      setChartView(newView);
    }
  };

  const handleOpenDialog = (type: 'clear') => {
    setOpenDialog(type);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const handleClearData = () => {
    clearAllData();
    handleCloseDialog();
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        mb: { xs: 3, sm: 4 }, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: { xs: 2, sm: 0 }
      }}>
        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold" fontSize={{ xs: '1.25rem', sm: '1.5rem' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's an overview of your goal progress.
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 1.5, 
          flexWrap: 'wrap',
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-end' }
        }}>
          <Button 
            variant="outlined"
            onClick={() => handleOpenDialog('clear')}
            size={isMobile ? "small" : "medium"}
            startIcon={<DeleteIcon />}
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Clear Data
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate('/goals')}
            size={isMobile ? "small" : "medium"}
            startIcon={<Flag />}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              boxShadow: '0 2px 4px rgba(33, 150, 243, .3)',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}
          >
            Manage Goals
          </Button>
        </Box>
      </Box>

      {/* Dashboard Summary */}
      <Grid container spacing={2} sx={{ mb: { xs: 3, sm: 4 } }}>
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            p: { xs: 2, md: 2.5 }, 
            borderRadius: 2, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="medium" fontSize={{ xs: '0.875rem', sm: '1rem' }}>Total Goals</Typography>
              <Flag color="primary" />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ mb: 1, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>{goals.length}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 0.5 }}>
              <Chip 
                label={`${completedGoals.length} Completed`} 
                size="small" 
                color="success"
                variant="outlined"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              />
              <Chip 
                label={`${inProgressGoals.length} In Progress`} 
                size="small"
                color="info"
                variant="outlined"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            p: { xs: 2, md: 2.5 }, 
            borderRadius: 2, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="medium" fontSize={{ xs: '0.875rem', sm: '1rem' }}>Milestones</Typography>
              <EmojiEvents color="primary" />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ mb: 1, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>{totalMilestones}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.7rem', sm: '0.75rem' }}>{completedMilestones} of {totalMilestones} completed</Typography>
              <Box sx={{ ml: 'auto' }}>
                <Typography variant="body2" fontWeight="medium" fontSize={{ xs: '0.7rem', sm: '0.75rem' }}>
                  {totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}%
                </Typography>
              </Box>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0} 
              sx={{ mt: 0.8, height: 6, borderRadius: 3 }}
            />
          </Paper>
        </Grid>
        
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            p: { xs: 2, md: 2.5 }, 
            borderRadius: 2, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="medium" fontSize={{ xs: '0.875rem', sm: '1rem' }}>Avg. Progress</Typography>
              <TrendingUp color="primary" />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ mb: 1, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>{averageProgress}%</Typography>
            <LinearProgress 
              variant="determinate" 
              value={averageProgress} 
              sx={{ mt: 0.8, height: 6, borderRadius: 3 }}
              color={averageProgress > 75 ? "success" : averageProgress > 50 ? "info" : "warning"}
            />
          </Paper>
        </Grid>
        
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            p: { xs: 2, md: 2.5 }, 
            borderRadius: 2, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="medium" fontSize={{ xs: '0.875rem', sm: '1rem' }}>Upcoming</Typography>
              <AccessTime color="primary" />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ mb: 1, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>{upcomingDeadlines.length}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              {upcomingDeadlines.length === 1 
                ? "1 deadline coming up" 
                : upcomingDeadlines.length > 0
                  ? `${upcomingDeadlines.length} deadlines coming up`
                  : "No upcoming deadlines"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Main Chart Section - Takes 2/3 of width */}
        {/* @ts-ignore */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2, mb: { xs: 3, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              gap: { xs: 1.5, sm: 0 }, 
              mb: 2 
            }}>
              <Typography variant="h6" fontSize={{ xs: '1rem', sm: '1.25rem' }}>Goal Analytics</Typography>
              <ToggleButtonGroup
                size={isMobile ? "small" : "medium"}
                color="primary"
                value={chartView}
                exclusive
                onChange={handleChartViewChange}
                aria-label="chart view options"
              >
                <ToggleButton value="goals">
                  <DonutLarge fontSize="small" sx={{ mr: { xs: 0, sm: 0.5 } }} /> 
                  <Typography sx={{ display: { xs: 'none', md: 'block' } }}>Status</Typography>
                </ToggleButton>
                <ToggleButton value="progress">
                  <BarChartIcon fontSize="small" sx={{ mr: { xs: 0, sm: 0.5 } }} /> 
                  <Typography sx={{ display: { xs: 'none', md: 'block' } }}>Progress</Typography>
                </ToggleButton>
                <ToggleButton value="timeline">
                  <TimelineIcon fontSize="small" sx={{ mr: { xs: 0, sm: 0.5 } }} /> 
                  <Typography sx={{ display: { xs: 'none', md: 'block' } }}>Timeline</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ 
              height: { xs: 250, sm: 300, md: 350 }, 
              mt: 2,
              overflow: 'visible'
            }}>
              {chartView === 'goals' && (
                <>
                  <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                    Goal Status Distribution
                  </Typography>
                  {goalDistributionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={goalDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={isMobile ? 70 : isTablet ? 85 : 100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ percent }) => {
                            // Only show label if percent is large enough to fit text
                            return percent > (isMobile ? 0.2 : 0.15) ? 
                              `${(percent * 100).toFixed(0)}%` : 
                              '';
                          }}
                        >
                          {goalDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} goals`, 'Count']} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        No goals data available
                      </Typography>
                    </Box>
                  )}
                </>
              )}
              
              {chartView === 'progress' && (
                <>
                  <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                    Goal Progress Distribution
                  </Typography>
                  {goals.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={progressDistributionData}
                        margin={{
                          top: 10,
                          right: isMobile ? 10 : 30,
                          left: isMobile ? 0 : 20,
                          bottom: 20,
                        }}
                        barSize={isMobile ? 20 : 30}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          scale="point" 
                          padding={{ left: isMobile ? 10 : 15, right: isMobile ? 10 : 15 }}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          angle={isMobile ? -25 : 0}
                          height={40}
                          textAnchor={isMobile ? "end" : "middle"}
                        />
                        <YAxis 
                          allowDecimals={false} 
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          width={isMobile ? 25 : 35}
                        />
                        <Tooltip formatter={(value) => [`${value} goals`, 'Count']} />
                        <Legend verticalAlign="top" height={36} />
                        <Bar 
                          dataKey="value" 
                          name="Goals" 
                          fill="#8884d8" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        No goals data available
                      </Typography>
                    </Box>
                  )}
                </>
              )}
              
              {chartView === 'timeline' && (
                <>
                  <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                    Upcoming Goals Timeline (Next 6 Months)
                  </Typography>
                  {timelineData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={timelineData}
                        margin={{
                          top: 10,
                          right: isMobile ? 10 : 30,
                          left: isMobile ? 5 : 20,
                          bottom: isMobile ? 45 : 25,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: isMobile ? 10 : 12, textAnchor: 'end' }}
                          height={60}
                          angle={-25}
                        />
                        <YAxis 
                          allowDecimals={false}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          width={isMobile ? 25 : 35}
                        />
                        <Tooltip formatter={(value) => [`${value} goals`, 'Count']} />
                        <Legend verticalAlign="top" height={36} />
                        <Line
                          type="monotone"
                          dataKey="goals"
                          stroke="#8884d8"
                          activeDot={{ r: 6 }}
                          name="Goals Due"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        No upcoming goals in the next 6 months
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Paper>

          {/* Milestone Donut Chart and Progress Summary Combined */}
          <Grid container spacing={3}>
            {/* @ts-ignore */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2, height: '100%' }}>
                <Typography variant="subtitle1" sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 1.5,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  <EmojiEvents fontSize="small" sx={{ mr: 0.8 }} />
                  Milestone Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {totalMilestones > 0 ? (
                  <Box sx={{ 
                    height: { xs: 180, sm: 220 }, 
                    mt: 1, 
                    width: '100%', 
                    position: 'relative', 
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <ResponsiveContainer width="99%" height="99%">
                      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                          data={milestoneData}
                          cx="50%"
                          cy="50%"
                          innerRadius={isMobile ? 25 : 40}
                          outerRadius={isMobile ? 45 : 60}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          labelLine={false}
                          label={({ percent }) => {
                            // Only show label if percent is large enough to fit text
                            return percent > (isMobile ? 0.2 : 0.15) ? 
                              `${(percent * 100).toFixed(0)}%` : 
                              '';
                          }}
                        >
                          {milestoneData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} milestones`, 'Count']} 
                          contentStyle={{ fontSize: isMobile ? '11px' : '13px' }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={isMobile ? 20 : 28} 
                          iconSize={isMobile ? 6 : 10}
                          formatter={(value) => <span style={{ fontSize: isMobile ? '10px' : '12px' }}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', height: { xs: 180, sm: 220 }, alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No milestone data available
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            {/* @ts-ignore */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2, height: '100%' }}>
                <Typography variant="subtitle1" sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 1.5,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  <TrendingUp fontSize="small" sx={{ mr: 0.8 }} />
                  Goal Progress Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, mt: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.65rem', sm: '0.7rem' }}>Completed</Typography>
                      <Typography variant="caption" fontWeight="medium" fontSize={{ xs: '0.65rem', sm: '0.7rem' }}>{completedGoals.length} of {goals.length}</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0} 
                      sx={{ height: { xs: 6, sm: 8 }, borderRadius: 4 }} 
                      color="success"
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.65rem', sm: '0.7rem' }}>In Progress</Typography>
                      <Typography variant="caption" fontWeight="medium" fontSize={{ xs: '0.65rem', sm: '0.7rem' }}>{inProgressGoals.length} of {goals.length}</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={goals.length > 0 ? (inProgressGoals.length / goals.length) * 100 : 0} 
                      sx={{ height: { xs: 6, sm: 8 }, borderRadius: 4 }} 
                      color="info"
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.65rem', sm: '0.7rem' }}>Not Started</Typography>
                      <Typography variant="caption" fontWeight="medium" fontSize={{ xs: '0.65rem', sm: '0.7rem' }}>{notStartedGoals.length} of {goals.length}</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={goals.length > 0 ? (notStartedGoals.length / goals.length) * 100 : 0} 
                      sx={{ height: { xs: 6, sm: 8 }, borderRadius: 4 }} 
                      color="warning"
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.65rem', sm: '0.7rem' }}>Milestone Completion</Typography>
                      <Typography variant="caption" fontWeight="medium" fontSize={{ xs: '0.65rem', sm: '0.7rem' }}>{completedMilestones} of {totalMilestones}</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0} 
                      sx={{ height: { xs: 6, sm: 8 }, borderRadius: 4 }} 
                      color="secondary"
                    />
                  </Box>

                  <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                    <Button 
                      variant="text" 
                      size="small" 
                      onClick={() => navigate('/goals')}
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, textTransform: 'none' }}
                      endIcon={<TrendingUp fontSize="small" />}
                    >
                      View detailed statistics
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Side Panel - Takes 1/3 of width */}
        {/* @ts-ignore */}
        <Grid item xs={12} lg={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Upcoming Deadlines */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2, mb: 3, flex: 1 }}>
            <Typography variant="subtitle1" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1.5,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              <AccessTime fontSize="small" sx={{ mr: 0.8 }} />
              Upcoming Deadlines
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {upcomingDeadlines.length > 0 ? (
              <List disablePadding>
                {upcomingDeadlines.map((goal) => (
                  <ListItem
                    key={goal.id}
                    disablePadding
                    sx={{ 
                      mb: 1.5, 
                      transition: 'transform 0.2s',
                      '&:hover': { 
                        transform: 'translateX(2px)'
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: '100%', 
                        p: { xs: 1.5, sm: 2 }, 
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 1.5,
                        display: 'flex',
                        cursor: 'pointer',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 1, sm: 0 }
                      }}
                      onClick={() => navigate('/goals')}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: { xs: '100%', sm: 'auto' } }}>
                        <ListItemIcon sx={{ minWidth: 'auto', mr: 1.2, color: 'primary.main' }}>
                          <Flag fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={goal.title} 
                          secondary={`Progress: ${goal.progress}%`}
                          primaryTypographyProps={{ 
                            fontWeight: 'medium', 
                            variant: 'body2',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                          secondaryTypographyProps={{ 
                            variant: 'caption',
                            fontSize: { xs: '0.65rem', sm: '0.7rem' }
                          }}
                        />
                      </Box>
                      <Chip 
                        label={formatDate(goal.targetDate)} 
                        color="primary" 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          fontSize: { xs: '0.65rem', sm: '0.7rem' },
                          alignSelf: { xs: 'flex-end', sm: 'center' },
                          ml: { sm: 'auto' }
                        }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="text.secondary" variant="body2">No upcoming deadlines</Typography>
              </Box>
            )}
            
            {upcomingDeadlines.length > 0 && (
              <Box sx={{ textAlign: 'right', mt: 1 }}>
                <Button 
                  variant="text" 
                  size="small"
                  onClick={() => navigate('/goals')}
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, textTransform: 'none' }}
                >
                  View All Goals
                </Button>
              </Box>
            )}
          </Paper>

          {/* Recent Achievements */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2, flex: 1 }}>
            <Typography variant="subtitle1" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1.5,
              fontSize: { xs: '0.875rem', sm: '1rem' } 
            }}>
              <Celebration fontSize="small" sx={{ mr: 0.8 }} />
              Recent Achievements
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {recentlyCompleted.length > 0 ? (
              <List disablePadding>
                {recentlyCompleted.map((goal) => (
                  <ListItem
                    key={goal.id}
                    disablePadding
                    sx={{ 
                      mb: 1.5,
                      transition: 'transform 0.2s',
                      '&:hover': { 
                        transform: 'translateX(2px)'
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: '100%', 
                        p: { xs: 1.5, sm: 2 },
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate('/goals')}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: 'success.main', 
                          width: { xs: 28, sm: 32 }, 
                          height: { xs: 28, sm: 32 },
                          mr: { xs: 1.5, sm: 2 }
                        }}
                      >
                        <Star sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
                      </Avatar>
                      <ListItemText 
                        primary={goal.title} 
                        primaryTypographyProps={{ 
                          fontWeight: 'medium', 
                          variant: 'body2',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          noWrap: true,
                          sx: { maxWidth: { xs: '140px', sm: '180px', md: '220px' } }
                        }}
                      />
                      <Chip 
                        label="100%" 
                        color="success" 
                        size="small"
                        sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' }, ml: 'auto' }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="text.secondary" variant="body2">No completed goals yet</Typography>
              </Box>
            )}
            
            {recentlyCompleted.length > 0 && (
              <Box sx={{ textAlign: 'right', mt: 1 }}>
                <Button 
                  variant="text" 
                  size="small"
                  onClick={() => navigate('/goals')}
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, textTransform: 'none' }}
                >
                  View All Achievements
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog === 'clear'}
        onClose={handleCloseDialog}
        aria-labelledby="clear-dialog-title"
        aria-describedby="clear-dialog-description"
      >
        <DialogTitle id="clear-dialog-title">Clear All Data?</DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-dialog-description">
            This will delete all your goals and progress data. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleClearData} color="error" autoFocus>
            Clear All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}