import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Type Definitions
interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  targetDate: Date;
  createdAt: Date;
  createdBy: string;
  teamId?: string;
  milestones: Milestone[];
  comments: Comment[];
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
  goalId: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  goalId: string;
}

// Goal Context
interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'comments'>) => void;
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

const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error("Failed to save goals to localStorage:", error);
    }
  }, [goals]);

  const clearAllData = () => {
    setGoals([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const getUserName = () => {
    return localStorage.getItem(USER_NAME_KEY) || 'Current User';
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'comments'>) => {
    const newGoal: Goal = {
      ...goal,
      id: uuidv4(), 
      createdAt: new Date(),
      createdBy: goal.createdBy || getUserName(),
      comments: [],
      milestones: goal.milestones || [],
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
          const updatedMilestones = [...goal.milestones, newMilestone];
          return {
            ...goal,
            milestones: updatedMilestones,
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
          const updatedMilestones = goal.milestones.filter(milestone => milestone.id !== milestoneId);
          return {
            ...goal,
            milestones: updatedMilestones,
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
          
          // Calculate new progress based on completed milestones
          const totalMilestones = updatedMilestones.length;
          const completedMilestones = updatedMilestones.filter(m => m.completed).length;
          const newProgress = totalMilestones > 0 
            ? Math.round((completedMilestones / totalMilestones) * 100) 
            : goal.progress;
            
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

const useGoals = (): GoalContextType => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};

// This is your consolidated Daily Tracker application component
const DailyTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'goals' | 'create'>('dashboard');
  
  return (
    <GoalProvider>
      <div className="daily-tracker-app" style={{ 
        fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        color: '#333' 
      }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '10px'
        }}>
          <h1 style={{ margin: 0, color: '#1976d2' }}>Daily Goal Tracker</h1>
          <nav>
            <ul style={{ display: 'flex', gap: '15px', listStyle: 'none', padding: 0 }}>
              <li>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  style={{
                    background: activeTab === 'dashboard' ? '#1976d2' : 'transparent',
                    color: activeTab === 'dashboard' ? 'white' : '#1976d2',
                    border: '1px solid #1976d2',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('goals')}
                  style={{
                    background: activeTab === 'goals' ? '#1976d2' : 'transparent',
                    color: activeTab === 'goals' ? 'white' : '#1976d2',
                    border: '1px solid #1976d2',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Goals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('create')}
                  style={{
                    background: activeTab === 'create' ? '#1976d2' : 'transparent',
                    color: activeTab === 'create' ? 'white' : '#1976d2',
                    border: '1px solid #1976d2',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Create Goal
                </button>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'goals' && <GoalsPage />}
          {activeTab === 'create' && <CreateGoalForm onClose={() => setActiveTab('goals')} />}
        </main>

        <footer style={{ 
          marginTop: '40px', 
          borderTop: '1px solid #e0e0e0',
          paddingTop: '20px',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          <p>© {new Date().getFullYear()} Daily Goal Tracker - All rights reserved</p>
        </footer>
      </div>
    </GoalProvider>
  );
};

// Dashboard Component
const Dashboard: React.FC = () => {
  const { goals, clearAllData } = useGoals();
  const [confirmClear, setConfirmClear] = useState(false);
  
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

  const handleClearData = () => {
    if (confirmClear) {
      clearAllData();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>Dashboard</h2>
        <button 
          onClick={handleClearData}
          style={{
            background: confirmClear ? '#f44336' : '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          {confirmClear ? 'Confirm Clear All Data' : 'Clear All Data'}
        </button>
      </div>

      {/* Dashboard Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Total Goals Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Total Goals</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2', marginBottom: '10px' }}>
            {goals.length}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ 
              fontSize: '0.8rem',
              background: '#e8f5e9',
              color: '#2e7d32',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid #c8e6c9'
            }}>
              {completedGoals.length} Completed
            </span>
            <span style={{ 
              fontSize: '0.8rem',
              background: '#e3f2fd',
              color: '#1565c0',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid #bbdefb'
            }}>
              {inProgressGoals.length} In Progress
            </span>
          </div>
        </div>

        {/* Milestones Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Milestones</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2', marginBottom: '10px' }}>
            {totalMilestones}
          </div>
          <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
            {completedMilestones} of {totalMilestones} completed
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            background: '#e0e0e0', 
            borderRadius: '4px', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              height: '100%', 
              width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%`,
              background: '#4caf50',
              borderRadius: '4px',
              transition: 'width 0.5s ease-out'
            }}></div>
          </div>
        </div>

        {/* Progress Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Average Progress</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2', marginBottom: '10px' }}>
            {averageProgress}%
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            background: '#e0e0e0', 
            borderRadius: '4px', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              height: '100%', 
              width: `${averageProgress}%`,
              background: averageProgress > 75 ? '#4caf50' : averageProgress > 50 ? '#2196f3' : '#ff9800',
              borderRadius: '4px',
              transition: 'width 0.5s ease-out'
            }}></div>
          </div>
        </div>
      </div>

      {/* Goal List Preview */}
      <div>
        <h3>Recent Goals</h3>
        {goals.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {goals.slice(0, 3).map(goal => (
              <div key={goal.id} style={{ 
                background: 'white',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>{goal.title}</h4>
                  <span style={{ 
                    background: goal.progress === 100 ? '#e8f5e9' : goal.progress > 0 ? '#e3f2fd' : '#fff3e0',
                    color: goal.progress === 100 ? '#2e7d32' : goal.progress > 0 ? '#1565c0' : '#e65100',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '0.8rem'
                  }}>
                    {goal.progress === 100 ? 'Completed' : goal.progress > 0 ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#666' }}>{goal.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                    {goal.progress}% Complete
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ 
                  width: '100%', 
                  height: '6px', 
                  background: '#e0e0e0', 
                  borderRadius: '3px', 
                  marginTop: '10px',
                  overflow: 'hidden' 
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${goal.progress}%`,
                    background: goal.progress === 100 ? '#4caf50' : goal.progress > 60 ? '#2196f3' : '#ff9800',
                    borderRadius: '3px',
                    transition: 'width 0.5s ease-out'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>
            No goals created yet. Click on "Create Goal" to get started!
          </p>
        )}
      </div>
    </div>
  );
};

// Goals Page Component
const GoalsPage: React.FC = () => {
  const { goals } = useGoals();
  const [activeFilter, setActiveFilter] = useState<'all' | 'personal' | 'team' | 'completed'>('all');
  
  const filteredGoals = activeFilter === 'all' ? goals :
    activeFilter === 'personal' ? goals.filter(goal => !goal.teamId) :
    activeFilter === 'team' ? goals.filter(goal => goal.teamId) :
    goals.filter(goal => goal.progress === 100);

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>My Goals</h2>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        {['all', 'personal', 'team', 'completed'].map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter as any)}
            style={{
              background: activeFilter === filter ? '#1976d2' : '#e0e0e0',
              color: activeFilter === filter ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontWeight: activeFilter === filter ? 'bold' : 'normal'
            }}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredGoals.length > 0 ? (
          filteredGoals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            background: 'white', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              {activeFilter === 'all' ? "You don't have any goals yet." :
               activeFilter === 'personal' ? "You don't have any personal goals yet." :
               activeFilter === 'team' ? "You don't have any team goals yet." :
               "You haven't completed any goals yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Goal Card Component
const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
  const { updateGoal, deleteGoal, addComment, toggleMilestone, updateProgress } = useGoals();
  const [expandMilestones, setExpandMilestones] = useState(false);
  const [expandComments, setExpandComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(goal.progress);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(goal.id, newComment);
      setNewComment('');
    }
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMilestoneTitle.trim()) {
      const newMilestone: Milestone = {
        id: uuidv4(),
        title: newMilestoneTitle,
        completed: false,
        goalId: goal.id,
      };
      
      const updatedGoal = {
        ...goal,
        milestones: [...goal.milestones, newMilestone]
      };
      
      updateGoal(updatedGoal);
      setNewMilestoneTitle('');
    }
  };

  const handleProgressUpdate = () => {
    updateProgress(goal.id, progressValue);
    setIsEditingProgress(false);
  };

  const handleDelete = () => {
    if (showConfirmDelete) {
      deleteGoal(goal.id);
    } else {
      setShowConfirmDelete(true);
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Progress color
  const getProgressColor = (progress: number): string => {
    if (progress === 100) return '#4caf50';
    if (progress >= 70) return '#2196f3';
    if (progress >= 30) return '#ff9800';
    return '#f44336';
  };

  return (
    <div style={{ 
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }}>
      {/* Status Badge */}
      {goal.progress === 100 && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '20px',
          background: '#4caf50',
          color: 'white',
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          Completed
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{goal.title}</h3>
        <div>
          <button
            onClick={() => setIsEditingProgress(!isEditingProgress)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#1976d2',
              marginRight: '10px',
              padding: '5px'
            }}
          >
            Edit Progress
          </button>
          <button
            onClick={handleDelete}
            style={{
              background: showConfirmDelete ? '#f44336' : 'transparent',
              color: showConfirmDelete ? 'white' : '#f44336',
              border: showConfirmDelete ? 'none' : '1px solid #f44336',
              borderRadius: '4px',
              padding: '5px 10px',
              cursor: 'pointer'
            }}
          >
            {showConfirmDelete ? 'Confirm Delete' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Description */}
      <p style={{ margin: '0 0 15px 0', color: '#555' }}>{goal.description}</p>

      {/* Dates & Progress */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        <div>Created: {formatDate(goal.createdAt)}</div>
        <div>Target: {formatDate(goal.targetDate)}</div>
      </div>
      
      {/* Progress Bar */}
      {isEditingProgress ? (
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="range"
              min="0"
              max="100"
              value={progressValue}
              onChange={(e) => setProgressValue(parseInt(e.target.value))}
              style={{ flexGrow: 1 }}
            />
            <span>{progressValue}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              onClick={() => setIsEditingProgress(false)}
              style={{
                background: 'transparent',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '5px 10px',
                marginRight: '10px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleProgressUpdate}
              style={{
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 10px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Progress</span>
            <span style={{ fontWeight: 'bold' }}>{goal.progress}%</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '10px', 
            background: '#e0e0e0', 
            borderRadius: '5px', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              height: '100%', 
              width: `${goal.progress}%`,
              background: getProgressColor(goal.progress),
              borderRadius: '5px',
              transition: 'width 0.5s ease-out'
            }}></div>
          </div>
        </div>
      )}

      {/* Milestones Section */}
      <div style={{ marginBottom: '20px' }}>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '10px',
            background: '#f5f5f5',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
          onClick={() => setExpandMilestones(!expandMilestones)}
        >
          <span style={{ fontWeight: 'bold' }}>
            Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
          </span>
          <span>{expandMilestones ? '▲' : '▼'}</span>
        </div>
        
        {expandMilestones && (
          <div style={{ padding: '0 10px' }}>
            {goal.milestones.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {goal.milestones.map(milestone => (
                  <li 
                    key={milestone.id} 
                    style={{ 
                      padding: '8px 0',
                      borderBottom: '1px solid #eee',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={milestone.completed}
                      onChange={() => toggleMilestone(goal.id, milestone.id)}
                      style={{ marginRight: '10px' }}
                      aria-label={`Mark milestone "${milestone.title}" as ${milestone.completed ? 'incomplete' : 'complete'}`}
                      title={`Mark as ${milestone.completed ? 'incomplete' : 'complete'}`}
                    />
                    <span style={{ 
                      textDecoration: milestone.completed ? 'line-through' : 'none',
                      color: milestone.completed ? '#888' : 'inherit'
                    }}>
                      {milestone.title}
                    </span>
                    {milestone.completedAt && (
                      <span style={{ 
                        marginLeft: 'auto',
                        fontSize: '0.8rem',
                        color: '#888'
                      }}>
                        Completed: {formatDate(milestone.completedAt)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#666', textAlign: 'center' }}>No milestones yet</p>
            )}
            
            {/* Add new milestone */}
            <form 
              onSubmit={handleAddMilestone}
              style={{ 
                display: 'flex', 
                marginTop: '15px',
                gap: '10px'
              }}
            >
              <input 
                type="text"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="Add a new milestone"
                style={{
                  flexGrow: 1,
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '0.9rem'
                }}
              />
              <button 
                type="submit"
                disabled={!newMilestoneTitle.trim()}
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  opacity: newMilestoneTitle.trim() ? 1 : 0.5
                }}
              >
                Add
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '10px',
            background: '#f5f5f5',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
          onClick={() => setExpandComments(!expandComments)}
        >
          <span style={{ fontWeight: 'bold' }}>
            Comments ({goal.comments.length})
          </span>
          <span>{expandComments ? '▲' : '▼'}</span>
        </div>
        
        {expandComments && (
          <div style={{ padding: '0 10px' }}>
            {goal.comments.length > 0 ? (
              <div>
                {goal.comments.map(comment => (
                  <div 
                    key={comment.id}
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                      marginBottom: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold' }}>{comment.author}</span>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>{formatDate(comment.createdAt)}</span>
                    </div>
                    <p style={{ margin: '5px 0 0 0' }}>{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666', textAlign: 'center' }}>No comments yet</p>
            )}
            
            {/* Add new comment */}
            <form 
              onSubmit={handleAddComment}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                marginTop: '15px',
                gap: '10px'
              }}
            >
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                rows={3}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              ></textarea>
              <button 
                type="submit"
                disabled={!newComment.trim()}
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  alignSelf: 'flex-end',
                  opacity: newComment.trim() ? 1 : 0.5
                }}
              >
                Post Comment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Create Goal Form Component
const CreateGoalForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addGoal } = useGoals();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    progress: 0,
    targetDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    isTeamGoal: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: Omit<Goal, 'id' | 'createdAt' | 'comments'> = {
      title: formData.title,
      description: formData.description,
      progress: Number(formData.progress),
      targetDate: new Date(formData.targetDate),
      createdBy: 'Current User',
      teamId: formData.isTeamGoal ? 'team-1' : undefined,
      milestones: []
    };
    
    addGoal(newGoal);
    onClose();
  };

  return (
    <div>
      <h2>Create New Goal</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Goal Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter goal title"
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your goal"
            rows={4}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="progress" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Initial Progress
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="range"
              id="progress"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
              style={{ flexGrow: 1, marginRight: '10px' }}
            />
            <span>{formData.progress}%</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="targetDate" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Target Date
          </label>
          <input
            type="date"
            id="targetDate"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="isTeamGoal"
            name="isTeamGoal"
            checked={formData.isTeamGoal}
            onChange={handleChange}
            aria-label="Mark as team goal"
            title="Check if this is a team goal"
          />
          <label htmlFor="isTeamGoal">
            This is a team goal
          </label>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#e0e0e0',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              background: '#1976d2',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Create Goal
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyTracker;