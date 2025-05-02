import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Checkbox,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

import { useGoals } from '../../context/GoalContext';
import { Milestone } from '../../types';

interface CreateGoalFormProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateGoalForm({ open, onClose }: CreateGoalFormProps) {
  const { addGoal } = useGoals();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState<Date | null>(new Date());
  const [goalType, setGoalType] = useState('personal'); // 'personal' or 'team'
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState('');

  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      const milestone: Milestone = {
        id: uuidv4(),
        title: newMilestone,
        completed: false,
        goalId: 'temp', // Will be replaced when goal is created
      };
      setMilestones([...milestones, milestone]);
      setNewMilestone('');
    }
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter(milestone => milestone.id !== id));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (title && description && targetDate) {
      // Calculate initial progress if milestones exist
      let initialProgress = 0;
      if (milestones.length > 0) {
        const completedCount = milestones.filter(m => m.completed).length;
        initialProgress = Math.round((completedCount / milestones.length) * 100);
      }
      
      // Create the goal with milestones
      const goalId = uuidv4();
      const goalMilestones = milestones.map(m => ({
        ...m,
        goalId: goalId
      }));
      
      addGoal({
        id: goalId, // Pre-generate ID so milestones can reference it
        title,
        description,
        progress: initialProgress,
        targetDate,
        milestones: goalMilestones,
        createdBy: 'Current User', // In a real app, get actual user info
        teamId: goalType === 'team' ? 'team-1' : undefined, // In a real app, get actual team info
      });
      
      handleClose();
    }
  };

  const handleMilestoneToggle = (id: string) => {
    setMilestones(milestones.map(milestone => {
      if (milestone.id === id) {
        return {
          ...milestone,
          completed: !milestone.completed,
          completedAt: !milestone.completed ? new Date() : undefined
        };
      }
      return milestone;
    }));
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setTargetDate(new Date());
    setGoalType('personal');
    setMilestones([]);
    setNewMilestone('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperComponent={motion.div}
      PaperProps={{
        initial: { y: 50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.3 },
        style: { 
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #f0f0f0', 
        fontWeight: 600,
        p: 3
      }}>Create New Goal</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Goal Title"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Goal Type</InputLabel>
            <Select
              value={goalType}
              label="Goal Type"
              onChange={(e) => setGoalType(e.target.value)}
            >
              <MenuItem value="personal">Personal Goal</MenuItem>
              <MenuItem value="team">Team Goal</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Target Completion Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker 
                value={targetDate}
                onChange={(newValue) => setTargetDate(newValue)}
                format="MM/dd/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  }
                }}
              />
            </LocalizationProvider>
          </Box>
          
          {/* Milestones Section */}
          <Box sx={{ my: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Milestones
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add key steps to accomplish this goal
            </Typography>
            
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                size="small"
                placeholder="Add a milestone"
                variant="outlined"
                fullWidth
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                sx={{ mr: 1 }}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddMilestone}
                disabled={!newMilestone.trim()}
              >
                <Add />
              </Button>
            </Box>
            
            {milestones.length > 0 && (
              <Paper variant="outlined" sx={{ mt: 2 }}>
                <List disablePadding>
                  {milestones.map((milestone, index) => (
                    <>
                      {index > 0 && <Divider />}
                      <ListItem 
                        key={milestone.id} 
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemoveMilestone(milestone.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        }
                      >
                        <Checkbox
                          edge="start"
                          checked={milestone.completed}
                          onChange={() => handleMilestoneToggle(milestone.id)}
                          tabIndex={-1}
                          disableRipple
                        />
                        <ListItemText primary={milestone.title} />
                      </ListItem>
                    </>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            startIcon={<Add />} 
            disabled={!title || !description || !targetDate}
          >
            Create Goal
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}