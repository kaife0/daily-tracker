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
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add } from '@mui/icons-material';
import { motion } from 'framer-motion';

import { useGoals } from '../../context/GoalContext';

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (title && description && targetDate) {
      addGoal({
        title,
        description,
        progress: 0,
        targetDate,
        createdBy: 'Current User', // In a real app, get actual user info
        teamId: goalType === 'team' ? 'team-1' : undefined, // In a real app, get actual team info
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setTargetDate(new Date());
    setGoalType('personal');
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