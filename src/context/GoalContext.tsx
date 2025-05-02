import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Goal, Comment, Milestone } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'createdAt' | 'comments'>) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  addComment: (goalId: string, text: string, author?: string) => void;
  addMilestone: (goalId: string, title: string) => void;
  updateMilestone: (goalId: string, milestoneId: string, title: string) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  updateProgress: (goalId: string, progress: number) => void;
  clearAllData: () => void;
}

const LOCAL_STORAGE_KEY = 'dailyTracker_goals';
const USER_NAME_KEY = 'dailyTracker_userName';

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  
  // Load data from localStorage on first render
  useEffect(() => {
    const storedGoals = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (storedGoals) {
      try {
        const parsedGoals = JSON.parse(storedGoals);
        
        // Convert string dates back to Date objects
        const processedGoals = parsedGoals.map((goal: any) => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
          targetDate: new Date(goal.targetDate),
          milestones: goal.milestones.map((milestone: any) => ({
            ...milestone,
            completedAt: milestone.completedAt ? new Date(milestone.completedAt) : undefined
          })),
          comments: goal.comments.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt)
          }))
        }));
        
        setGoals(processedGoals);
      } catch (error) {
        console.error("Failed to parse goals from localStorage:", error);
        setGoals([]);
      }
    } 
  }, []);

  // Save to localStorage whenever goals change
  useEffect(() => {
    try {
      if (goals.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(goals));
      } else if (goals.length === 0) {
        // If all goals were deleted, clear local storage
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to save goals to localStorage:", error);
      // Consider showing an error notification to the user here
    }
  }, [goals]);

  const clearAllData = () => {
    setGoals([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const getUserName = () => {
    return localStorage.getItem(USER_NAME_KEY) || 'Current User';
  };

  const addGoal = (goal: Omit<Goal, 'createdAt' | 'comments'>) => {
    const newGoal: Goal = {
      ...goal,
      id: goal.id || uuidv4(), // Use provided ID or generate a new one
      createdAt: new Date(),
      createdBy: goal.createdBy || getUserName(),
      comments: [],
      milestones: goal.milestones || [], // Use provided milestones or empty array
    };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map(goal => (goal.id === updatedGoal.id ? updatedGoal : goal)));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const addComment = (goalId: string, text: string, author?: string) => {
    const newComment: Comment = {
      id: uuidv4(),
      text,
      author: author || getUserName(),
      createdAt: new Date(),
      goalId,
    };

    setGoals(
      goals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            comments: [...goal.comments, newComment],
          };
        }
        return goal;
      })
    );
  };

  const addMilestone = (goalId: string, title: string) => {
    const newMilestone: Milestone = {
      id: uuidv4(),
      title,
      completed: false,
      goalId,
    };

    setGoals(
      goals.map(goal => {
        if (goal.id === goalId) {
          // Add the milestone to the goal
          const updatedMilestones = [...goal.milestones, newMilestone];
          
          // Recalculate progress based on the milestone completion status
          const totalMilestones = updatedMilestones.length;
          const completedMilestones = updatedMilestones.filter(m => m.completed).length;
          
          // If we have milestones, update progress accordingly
          let newProgress = goal.progress;
          if (totalMilestones > 0) {
            // The milestone-based progress might decrease when adding a new uncompleted milestone
            // Only update if goal was previously at 100% or if it's a new goal with no progress
            const milestoneProgress = Math.round((completedMilestones / totalMilestones) * 100);
            if (goal.progress === 100 || goal.progress === 0 || goal.milestones.length === 0) {
              newProgress = milestoneProgress;
            }
          }
            
          return {
            ...goal,
            milestones: updatedMilestones,
            progress: newProgress
          };
        }
        return goal;
      })
    );
  };

  const updateMilestone = (goalId: string, milestoneId: string, title: string) => {
    setGoals(
      goals.map(goal => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map(milestone => {
            if (milestone.id === milestoneId) {
              return {
                ...milestone,
                title,
              };
            }
            return milestone;
          });
          return {
            ...goal,
            milestones: updatedMilestones,
          };
        }
        return goal;
      })
    );
  };

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    setGoals(
      goals.map(goal => {
        if (goal.id === goalId) {
          // First, check if the milestone to be deleted is completed
          const milestoneToDelete = goal.milestones.find(m => m.id === milestoneId);
          const wasCompleted = milestoneToDelete?.completed || false;
          
          // Filter out the milestone to delete
          const updatedMilestones = goal.milestones.filter(milestone => milestone.id !== milestoneId);
          
          // Recalculate progress based on remaining milestones
          const totalMilestones = updatedMilestones.length;
          const completedMilestones = updatedMilestones.filter(m => m.completed).length;
          
          // Calculate new progress
          let newProgress = goal.progress;
          if (totalMilestones > 0) {
            // Calculate milestone-based progress with the remaining milestones
            const milestoneProgress = Math.round((completedMilestones / totalMilestones) * 100);
            
            // If the deleted milestone was completed, we might need to adjust progress down
            if (wasCompleted) {
              newProgress = milestoneProgress;
            } else {
              // If we deleted an uncompleted milestone, progress might increase
              newProgress = Math.max(milestoneProgress, goal.progress);
            }
            
            // If all remaining milestones are complete, set to 100%
            if (completedMilestones === totalMilestones && totalMilestones > 0) {
              newProgress = 100;
            }
          } else {
            // If no milestones remain, keep the current progress
            // This prevents progress from being reset when all milestones are removed
          }
          
          return {
            ...goal,
            milestones: updatedMilestones,
            progress: newProgress,
          };
        }
        return goal;
      })
    );
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(
      goals.map(goal => {
        if (goal.id === goalId) {
          // Find the milestone we're toggling
          const milestoneToToggle = goal.milestones.find(m => m.id === milestoneId);
          if (!milestoneToToggle) return goal;
          
          const willBeCompleted = !milestoneToToggle.completed;
          
          // Update all milestones, toggling the selected one
          const updatedMilestones = goal.milestones.map(milestone => {
            if (milestone.id === milestoneId) {
              return {
                ...milestone,
                completed: willBeCompleted,
                completedAt: willBeCompleted ? new Date() : undefined,
              };
            }
            return milestone;
          });
          
          // Calculate new progress based on completed milestones
          const totalMilestones = updatedMilestones.length;
          const completedMilestones = updatedMilestones.filter(m => m.completed).length;
          
          // Always calculate new progress when toggling milestones
          let newProgress = goal.progress;
          if (totalMilestones > 0) {
            // Calculate milestone-based progress
            const milestoneProgress = Math.round((completedMilestones / totalMilestones) * 100);
            
            // If unchecking a milestone, always update the progress
            if (!willBeCompleted) {
              newProgress = milestoneProgress;
            } else {
              // When checking a milestone, use the higher value
              newProgress = Math.max(milestoneProgress, goal.progress);
            }
            
            // If all milestones are complete, set to 100%
            if (completedMilestones === totalMilestones) {
              newProgress = 100;
            } 
            // If goal was previously 100% but now has uncompleted milestones, update progress
            else if (goal.progress === 100 && completedMilestones < totalMilestones) {
              newProgress = milestoneProgress;
            }
          }
            
          return {
            ...goal,
            milestones: updatedMilestones,
            progress: newProgress
          };
        }
        return goal;
      })
    );
  };

  const updateProgress = (goalId: string, progress: number) => {
    setGoals(
      goals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            progress,
          };
        }
        return goal;
      })
    );
  };

  const value = {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    addComment,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    toggleMilestone,
    updateProgress,
    clearAllData
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};