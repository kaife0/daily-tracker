import { Goal } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Generate sample goals with realistic data
export const generateSampleGoals = (): Goal[] => {
  const today = new Date();
  
  // Helper to create a date that's a certain number of days in the future
  const futureDate = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
  };
  
  // Helper to create a date that's a certain number of days in the past
  const pastDate = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date;
  };

  return [
    {
      id: uuidv4(),
      title: "Learn React and TypeScript",
      description: "Complete a comprehensive React and TypeScript course and build a portfolio project.",
      progress: 65,
      targetDate: futureDate(30),
      createdAt: pastDate(15),
      createdBy: "Current User",
      milestones: [
        {
          id: uuidv4(),
          title: "Complete React basics",
          completed: true,
          completedAt: pastDate(10),
          goalId: "1"
        },
        {
          id: uuidv4(),
          title: "Learn TypeScript fundamentals",
          completed: true,
          completedAt: pastDate(5),
          goalId: "1"
        },
        {
          id: uuidv4(),
          title: "Build a portfolio project",
          completed: false,
          goalId: "1"
        }
      ],
      comments: [
        {
          id: uuidv4(),
          text: "I'm making good progress with React hooks!",
          author: "Current User",
          createdAt: pastDate(8),
          goalId: "1"
        },
        {
          id: uuidv4(),
          text: "TypeScript is challenging but very useful.",
          author: "Current User",
          createdAt: pastDate(3),
          goalId: "1"
        }
      ]
    },
    {
      id: uuidv4(),
      title: "Run a marathon",
      description: "Train consistently and complete a full marathon by the end of the year.",
      progress: 30,
      targetDate: futureDate(120),
      createdAt: pastDate(45),
      createdBy: "Current User",
      milestones: [
        {
          id: uuidv4(),
          title: "Run 5K without stopping",
          completed: true,
          completedAt: pastDate(30),
          goalId: "2"
        },
        {
          id: uuidv4(),
          title: "Complete a 10K race",
          completed: false,
          goalId: "2"
        },
        {
          id: uuidv4(),
          title: "Run a half marathon",
          completed: false,
          goalId: "2"
        },
        {
          id: uuidv4(),
          title: "Complete full marathon",
          completed: false,
          goalId: "2"
        }
      ],
      comments: [
        {
          id: uuidv4(),
          text: "Started using a new training plan, feeling good!",
          author: "Current User",
          createdAt: pastDate(20),
          goalId: "2"
        }
      ]
    },
    {
      id: uuidv4(),
      title: "Team Project: Website Redesign",
      description: "Complete the company website redesign with improved UI/UX and modern features.",
      progress: 80,
      targetDate: futureDate(14),
      createdAt: pastDate(60),
      createdBy: "Team Lead",
      teamId: "team-1",
      milestones: [
        {
          id: uuidv4(),
          title: "Create wireframes",
          completed: true,
          completedAt: pastDate(50),
          goalId: "3"
        },
        {
          id: uuidv4(),
          title: "Design high-fidelity mockups",
          completed: true,
          completedAt: pastDate(35),
          goalId: "3"
        },
        {
          id: uuidv4(),
          title: "Develop frontend components",
          completed: true,
          completedAt: pastDate(15),
          goalId: "3"
        },
        {
          id: uuidv4(),
          title: "Backend integration",
          completed: false,
          goalId: "3"
        },
        {
          id: uuidv4(),
          title: "Launch website",
          completed: false,
          goalId: "3"
        }
      ],
      comments: [
        {
          id: uuidv4(),
          text: "The new design looks great! Let's focus on mobile responsiveness.",
          author: "Design Lead",
          createdAt: pastDate(40),
          goalId: "3"
        },
        {
          id: uuidv4(),
          text: "I've completed the frontend components, ready for backend integration.",
          author: "Frontend Dev",
          createdAt: pastDate(15),
          goalId: "3"
        },
        {
          id: uuidv4(),
          text: "Working on the API integration now.",
          author: "Backend Dev",
          createdAt: pastDate(10),
          goalId: "3"
        }
      ]
    },
    {
      id: uuidv4(),
      title: "Read 20 books this year",
      description: "Read a variety of books across different genres to expand knowledge.",
      progress: 100,
      targetDate: futureDate(-20), // Already passed (completed)
      createdAt: pastDate(200),
      createdBy: "Current User",
      milestones: [
        {
          id: uuidv4(),
          title: "Read 5 books",
          completed: true,
          completedAt: pastDate(150),
          goalId: "4"
        },
        {
          id: uuidv4(),
          title: "Read 10 books",
          completed: true,
          completedAt: pastDate(100),
          goalId: "4"
        },
        {
          id: uuidv4(),
          title: "Read 15 books",
          completed: true,
          completedAt: pastDate(50),
          goalId: "4"
        },
        {
          id: uuidv4(),
          title: "Read 20 books",
          completed: true,
          completedAt: pastDate(25),
          goalId: "4"
        }
      ],
      comments: [
        {
          id: uuidv4(),
          text: "Just finished my 20th book! Goal accomplished ahead of schedule.",
          author: "Current User",
          createdAt: pastDate(25),
          goalId: "4"
        },
        {
          id: uuidv4(),
          text: "Congratulations! What was your favorite book?",
          author: "Book Buddy",
          createdAt: pastDate(24),
          goalId: "4"
        },
        {
          id: uuidv4(),
          text: "Thanks! I really enjoyed 'Atomic Habits' - it was life-changing!",
          author: "Current User",
          createdAt: pastDate(23),
          goalId: "4"
        }
      ]
    },
    {
      id: uuidv4(),
      title: "Team Goal: Increase Customer Satisfaction",
      description: "Improve our customer satisfaction score from 7.5 to 9.0 through better service and product improvements.",
      progress: 40,
      targetDate: futureDate(90),
      createdAt: pastDate(30),
      createdBy: "Product Manager",
      teamId: "team-1",
      milestones: [
        {
          id: uuidv4(),
          title: "Conduct customer surveys",
          completed: true,
          completedAt: pastDate(20),
          goalId: "5"
        },
        {
          id: uuidv4(),
          title: "Analyze pain points",
          completed: true,
          completedAt: pastDate(15),
          goalId: "5"
        },
        {
          id: uuidv4(),
          title: "Implement quick wins",
          completed: false,
          goalId: "5"
        },
        {
          id: uuidv4(),
          title: "Develop long-term improvement plan",
          completed: false,
          goalId: "5"
        }
      ],
      comments: [
        {
          id: uuidv4(),
          text: "The survey results are in - main pain points are response time and UI complexity.",
          author: "Research Analyst",
          createdAt: pastDate(18),
          goalId: "5"
        },
        {
          id: uuidv4(),
          text: "Let's focus on improving the customer support response time first.",
          author: "Support Manager",
          createdAt: pastDate(16),
          goalId: "5"
        }
      ]
    }
  ];
};