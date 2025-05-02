import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress, 
  Box, 
  Chip, 
  IconButton, 
  Menu,
  MenuItem,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
  Button,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Fade,
  ListItemSecondaryAction,
} from '@mui/material';
import { 
  MoreVert, 
  Comment as CommentIcon, 
  EmojiEvents, 
  Today,
  Add, 
  Delete, 
  Edit, 
  ExpandMore, 
  ExpandLess,
  Save,
  Cancel
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { Goal, Comment, Milestone } from '../../types';
import { useGoals } from '../../context/GoalContext';

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const { updateProgress, addComment, addMilestone, updateMilestone, deleteMilestone, toggleMilestone, deleteGoal, updateGoal } = useGoals();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandMilestones, setExpandMilestones] = useState(false);
  const [expandComments, setExpandComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newMilestone, setNewMilestone] = useState('');
  const [progress, setProgress] = useState(goal.progress);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [editGoalOpen, setEditGoalOpen] = useState(false);
  const [editedGoal, setEditedGoal] = useState<Goal>({...goal});
  const [deleteCommentConfirmOpen, setDeleteCommentConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [editedMilestoneText, setEditedMilestoneText] = useState('');
  const [deleteMilestoneConfirmOpen, setDeleteMilestoneConfirmOpen] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateProgress = () => {
    updateProgress(goal.id, progress);
    handleMenuClose();
  };

  const handleDeleteGoal = () => {
    deleteGoal(goal.id);
    handleMenuClose();
  };

  const handleSubmitComment = (event: React.FormEvent) => {
    event.preventDefault();
    if (newComment.trim()) {
      addComment(goal.id, newComment, 'Current User'); // In a real app, get actual user info
      setNewComment('');
    }
  };

  const handleSubmitMilestone = (event: React.FormEvent) => {
    event.preventDefault();
    if (newMilestone.trim()) {
      // When adding a new milestone, adjust progress
      const updatedGoal = {...goal};
      const totalMilestonesCount = updatedGoal.milestones.length + 1; // +1 for the new milestone
      const completedMilestonesCount = updatedGoal.milestones.filter(m => m.completed).length;
      
      // Calculate new progress based on milestone completion rate
      const newProgress = Math.max(
        Math.round((completedMilestonesCount / totalMilestonesCount) * 100), 
        updatedGoal.progress
      );
      
      addMilestone(goal.id, newMilestone);
      updateProgress(goal.id, newProgress);
      setNewMilestone('');
    }
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    // Find the milestone in the goal object
    const milestone = goal.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    // Toggle milestone status
    const willBeCompleted = !milestone.completed;
    
    // Call the toggle function
    toggleMilestone(goalId, milestoneId);
    
    // Calculate new progress after toggling
    const totalMilestones = goal.milestones.length;
    // Anticipate the future state after toggling
    let completedMilestones = goal.milestones.filter(m => m.completed).length;
    if (willBeCompleted) {
      completedMilestones += 1;
    } else {
      completedMilestones -= 1;
    }
    
    // Update progress based on milestone completion
    const newProgress = Math.round((completedMilestones / totalMilestones) * 100);
    updateProgress(goalId, newProgress);
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditedCommentText(comment.text);
  };

  const handleSaveComment = (commentId: string) => {
    if (editedCommentText.trim()) {
      // Find comment in goal's comments
      const updatedGoal = {...goal};
      const commentIndex = updatedGoal.comments.findIndex(c => c.id === commentId);
      
      if (commentIndex !== -1) {
        updatedGoal.comments[commentIndex] = {
          ...updatedGoal.comments[commentIndex],
          text: editedCommentText
        };
        
        updateGoal(updatedGoal);
      }
      
      setEditingComment(null);
      setEditedCommentText('');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteCommentConfirmOpen(true);
  };

  const confirmDeleteComment = () => {
    if (commentToDelete) {
      const updatedGoal = {...goal};
      updatedGoal.comments = updatedGoal.comments.filter(c => c.id !== commentToDelete);
      updateGoal(updatedGoal);
      setDeleteCommentConfirmOpen(false);
      setCommentToDelete(null);
    }
  };

  const handleCancelEditComment = () => {
    setEditingComment(null);
    setEditedCommentText('');
  };

  // Milestone editing functions
  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone.id);
    setEditedMilestoneText(milestone.title);
  };

  const handleSaveMilestone = (milestoneId: string) => {
    if (editedMilestoneText.trim()) {
      updateMilestone(goal.id, milestoneId, editedMilestoneText);
      setEditingMilestone(null);
      setEditedMilestoneText('');
    }
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    setMilestoneToDelete(milestoneId);
    setDeleteMilestoneConfirmOpen(true);
  };

  const confirmDeleteMilestone = () => {
    if (milestoneToDelete) {
      deleteMilestone(goal.id, milestoneToDelete);
      
      // Recalculate progress after deleting milestone
      const remainingMilestones = goal.milestones.filter(m => m.id !== milestoneToDelete);
      const totalCount = remainingMilestones.length;
      const completedCount = remainingMilestones.filter(m => m.completed).length;
      
      if (totalCount > 0) {
        const newProgress = Math.round((completedCount / totalCount) * 100);
        updateProgress(goal.id, newProgress);
      }
      
      setDeleteMilestoneConfirmOpen(false);
      setMilestoneToDelete(null);
    }
  };

  const handleCancelEditMilestone = () => {
    setEditingMilestone(null);
    setEditedMilestoneText('');
  };

  const openEditGoalDialog = () => {
    setEditedGoal({...goal});
    setEditGoalOpen(true);
    handleMenuClose();
  };

  const handleEditGoalSave = () => {
    updateGoal(editedGoal);
    setEditGoalOpen(false);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'error';
    if (progress < 70) return 'warning';
    return 'success';
  };

  // Format date to be more readable
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const completedMilestones = goal.milestones.filter(m => m.completed).length;
  const totalMilestones = goal.milestones.length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <Card 
        sx={{ 
          marginBottom: 3, 
          borderRadius: 2,
          boxShadow: 3,
          position: 'relative',
          overflow: 'visible'
        }}
      >
        {completedMilestones > 0 && totalMilestones > 0 && completedMilestones === totalMilestones && (
          <Chip
            icon={<EmojiEvents />}
            label="Completed"
            color="success"
            sx={{
              position: 'absolute',
              top: -12,
              right: 16,
              zIndex: 1
            }}
          />
        )}

        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h5" component="div" gutterBottom>
              {goal.title}
            </Typography>
            <IconButton aria-label="settings" onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
            <Menu
              id="goal-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={openEditGoalDialog}>
                <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Goal
              </MenuItem>
              <MenuItem>
                <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>Progress:</Typography>
                  <TextField
                    size="small"
                    type="number"
                    value={progress}
                    inputProps={{ min: 0, max: 100 }}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    sx={{ width: 70, mr: 1 }}
                  />
                  <Button size="small" onClick={handleUpdateProgress}>Update</Button>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleDeleteGoal}>
                <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Goal
              </MenuItem>
            </Menu>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {goal.description}
          </Typography>

          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Today fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Target: {formatDate(goal.targetDate)}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Progress</Typography>
              <Typography variant="body2" color="text.secondary">{goal.progress}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={goal.progress} 
              color={getProgressColor(goal.progress)}
              sx={{ 
                height: 10, 
                borderRadius: 5,
                '& .MuiLinearProgress-bar': {
                  transition: 'transform 0.5s ease-out'
                }
              }}
            />
          </Box>

          {/* Milestones Section */}
          <Box sx={{ mb: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                p: 1,
                borderRadius: 1
              }}
              onClick={() => setExpandMilestones(!expandMilestones)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmojiEvents fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Milestones ({completedMilestones}/{totalMilestones})
                </Typography>
              </Box>
              {expandMilestones ? <ExpandLess /> : <ExpandMore />}
            </Box>
            
            <Collapse in={expandMilestones} timeout="auto" unmountOnExit>
              <List dense>
                {goal.milestones.map((milestone) => (
                  <ListItem 
                    key={milestone.id} 
                    sx={{
                      pr: { xs: 6, sm: 8 }, // Responsive padding for action buttons
                      position: 'relative',
                      '&:hover .milestone-actions': {
                        opacity: 1,
                      }
                    }}
                  >
                    {editingMilestone === milestone.id ? (
                      <>
                        <TextField
                          size="small"
                          fullWidth
                          value={editedMilestoneText}
                          onChange={(e) => setEditedMilestoneText(e.target.value)}
                          sx={{ mr: 1 }}
                          autoFocus
                        />
                        <Box sx={{ 
                          position: 'absolute', 
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)'  
                        }}>
                          <IconButton 
                            size="small" 
                            color="default" 
                            onClick={handleCancelEditMilestone}
                            sx={{ mr: 0.5 }}
                            aria-label="cancel"
                          >
                            <Cancel fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => handleSaveMilestone(milestone.id)}
                            aria-label="save"
                            disabled={!editedMilestoneText.trim()}
                          >
                            <Save fontSize="small" />
                          </IconButton>
                        </Box>
                      </>
                    ) : (
                      <>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={milestone.completed}
                            onChange={() => handleToggleMilestone(goal.id, milestone.id)}
                            color="primary"
                          />
                        </ListItemIcon>
                        <ListItemText 
                          primary={milestone.title}
                          primaryTypographyProps={{
                            noWrap: false,
                            sx: { 
                              wordBreak: 'break-word',
                              fontSize: { xs: '0.875rem', sm: '0.95rem' }
                            }
                          }}
                          secondary={milestone.completedAt ? `Completed: ${formatDate(milestone.completedAt)}` : ''}
                          secondaryTypographyProps={{
                            sx: { fontSize: { xs: '0.7rem', sm: '0.8rem' } }
                          }}
                          sx={{ pr: { xs: 5, sm: 6 } }} // Make room for buttons
                        />
                        <ListItemSecondaryAction className="milestone-actions" sx={{ opacity: { xs: 1, sm: 0 }, transition: 'opacity 0.2s' }}>
                          <Tooltip title="Edit milestone">
                            <IconButton 
                              edge="end" 
                              aria-label="edit milestone" 
                              size="small" 
                              onClick={() => handleEditMilestone(milestone)}
                              sx={{ mr: 0.5 }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete milestone">
                            <IconButton 
                              edge="end" 
                              aria-label="delete milestone" 
                              size="small" 
                              onClick={() => handleDeleteMilestone(milestone.id)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </>
                    )}
                  </ListItem>
                ))}
                <ListItem>
                  <Box component="form" onSubmit={handleSubmitMilestone} sx={{ display: 'flex', width: '100%' }}>
                    <TextField
                      size="small"
                      placeholder="Add new milestone"
                      value={newMilestone}
                      onChange={(e) => setNewMilestone(e.target.value)}
                      fullWidth
                      sx={{ mr: 1 }}
                    />
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="small" 
                      startIcon={<Add />}
                      disabled={!newMilestone.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </ListItem>
              </List>
            </Collapse>
          </Box>

          {/* Comments Section */}
          <Divider sx={{ mb: 2 }} />
          <Box>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                p: 1,
                borderRadius: 1
              }}
              onClick={() => setExpandComments(!expandComments)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CommentIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Comments ({goal.comments.length})
                </Typography>
              </Box>
              {expandComments ? <ExpandLess /> : <ExpandMore />}
            </Box>
            
            <Collapse in={expandComments} timeout="auto" unmountOnExit>
              <List dense sx={{ pt: 0 }}>
                {goal.comments.map((comment: Comment) => (
                  <ListItem 
                    key={comment.id} 
                    alignItems="flex-start" 
                    sx={{ 
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32 }}>{comment.author.substring(0, 1)}</Avatar>
                    </ListItemIcon>
                    {editingComment === comment.id ? (
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          size="small"
                          fullWidth
                          multiline
                          value={editedCommentText}
                          onChange={(e) => setEditedCommentText(e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button 
                            size="small" 
                            startIcon={<Cancel />}
                            onClick={handleCancelEditComment}
                            sx={{ mr: 1 }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="small" 
                            variant="contained"
                            color="primary"
                            startIcon={<Save />}
                            onClick={() => handleSaveComment(comment.id)}
                            disabled={!editedCommentText.trim()}
                          >
                            Save
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2">{comment.author}</Typography>
                              {comment.author === 'Current User' && (
                                <Box>
                                  <Tooltip title="Edit comment" arrow TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                                    <IconButton 
                                      size="small"
                                      onClick={() => handleEditComment(comment)}
                                      sx={{ mr: 0.5 }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete comment" arrow TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                                    <IconButton 
                                      size="small"
                                      onClick={() => handleDeleteComment(comment.id)}
                                      color="error"
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              )}
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" component="span">{comment.text}</Typography>
                              <Typography variant="caption" component="div" color="text.secondary">
                                {formatDate(comment.createdAt)}
                              </Typography>
                            </>
                          }
                        />
                      </>
                    )}
                  </ListItem>
                ))}
                <ListItem>
                  <Box component="form" onSubmit={handleSubmitComment} sx={{ display: 'flex', width: '100%' }}>
                    <TextField
                      size="small"
                      placeholder="Add a comment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      fullWidth
                      sx={{ mr: 1 }}
                    />
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="small" 
                      startIcon={<Add />}
                      disabled={!newComment.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </ListItem>
              </List>
            </Collapse>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Goal Dialog */}
      <Dialog 
        open={editGoalOpen} 
        onClose={() => setEditGoalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Goal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={editedGoal.title}
            onChange={(e) => setEditedGoal({...editedGoal, title: e.target.value})}
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
            value={editedGoal.description}
            onChange={(e) => setEditedGoal({...editedGoal, description: e.target.value})}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Progress"
            type="number"
            fullWidth
            variant="outlined"
            value={editedGoal.progress}
            onChange={(e) => setEditedGoal({...editedGoal, progress: Number(e.target.value)})}
            inputProps={{ min: 0, max: 100 }}
            required
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditGoalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEditGoalSave}
            variant="contained" 
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Comment Confirmation Dialog */}
      <Dialog
        open={deleteCommentConfirmOpen}
        onClose={() => setDeleteCommentConfirmOpen(false)}
      >
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this comment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCommentConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteComment} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Milestone Confirmation Dialog */}
      <Dialog
        open={deleteMilestoneConfirmOpen}
        onClose={() => setDeleteMilestoneConfirmOpen(false)}
      >
        <DialogTitle>Delete Milestone</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this milestone?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteMilestoneConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteMilestone} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}