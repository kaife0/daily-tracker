export interface Goal {
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

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
  goalId: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  goalId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[]; // User IDs
}