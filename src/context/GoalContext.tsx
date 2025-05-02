import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Goal, Comment, Milestone } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { generateSampleGoals } from '../utils/sampleData';

interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'comments' | 'milestones'>) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  addComment: (goalId: string, text: string, author: string) => void;
  addMilestone: (goalId: string, title: string) => void;
  updateMilestone: (goalId: string, milestoneId: string, title: string) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  updateProgress: (goalId: string, progress: number) => void;
  resetToSampleData: () => void;
  clearAllData: () => void;
  hasSampleData: boolean;
}

const LOCAL_STORAGE_KEY = 'dailyTracker_goals';
const SAMPLE_DATA_FLAG_KEY = 'dailyTracker_hasSampleData';

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [hasSampleData, setHasSampleData] = useState<boolean>(false);
  
  // Load data from localStorage on first render
  useEffect(() => {
    const storedGoals = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedSampleFlag = localStorage.getItem(SAMPLE_DATA_FLAG_KEY);
    
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
        setHasSampleData(storedSampleFlag === 'true');
      } catch (error) {
        console.error("Failed to parse goals from localStorage:", error);
        loadSampleData();
      }
    } else {
      // No stored goals, load sample data
      loadSampleData();
    }
  }, []);

  // Save to localStorage whenever goals change
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(goals));
      localStorage.setItem(SAMPLE_DATA_FLAG_KEY, hasSampleData.toString());
    } else if (goals.length === 0) {
      // If all goals were deleted, clear local storage
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.setItem(SAMPLE_DATA_FLAG_KEY, 'false');
    }
  }, [goals, hasSampleData]);

  const loadSampleData = () => {
    const sampleGoals = generateSampleGoals();
    setGoals(sampleGoals);
    setHasSampleData(true);
    localStorage.setItem(SAMPLE_DATA_FLAG_KEY, 'true');
  };

  const clearAllData = () => {
    setGoals([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.setItem(SAMPLE_DATA_FLAG_KEY, 'false');
    setHasSampleData(false);
  };

  const resetToSampleData = () => {
    loadSampleData();
    setHasSampleData(true);
    localStorage.setItem(SAMPLE_DATA_FLAG_KEY, 'true');
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'comments' | 'milestones'>) => {
    const newGoal: Goal = {
      ...goal,
      id: uuidv4(),
      createdAt: new Date(),
      comments: [],
      milestones: [],
    };
    setGoals([...goals, newGoal]);
    setHasSampleData(false);
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map(goal => (goal.id === updatedGoal.id ? updatedGoal : goal)));
    setHasSampleData(false);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const addComment = (goalId: string, text: string, author: string) => {
    const newComment: Comment = {
      id: uuidv4(),
      text,
      author,
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
    setHasSampleData(false);
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
          return {
            ...goal,
            milestones: [...goal.milestones, newMilestone],
          };
        }
        return goal;
      })
    );
    setHasSampleData(false);
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
    setHasSampleData(false);
  };

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    setGoals(
      goals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            milestones: goal.milestones.filter(milestone => milestone.id !== milestoneId),
          };
        }
        return goal;
      })
    );
    setHasSampleData(false);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(
      goals.map(goal => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map(milestone => {
            if (milestone.id === milestoneId) {
              return {
                ...milestone,
                completed: !milestone.completed,
                completedAt: !milestone.completed ? new Date() : undefined,
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
    setHasSampleData(false);
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
    setHasSampleData(false);
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
    resetToSampleData,
    clearAllData,
    hasSampleData
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