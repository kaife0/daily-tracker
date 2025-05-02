# Daily Tracker - Goal Management Application

A modern, responsive web application built with React, TypeScript, and Material UI that helps users set, track, and achieve their personal and team goals.

![Goal Tracker](https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)

## Features

- **Goal Management**: Create, update, and delete personal and team goals
- **Progress Tracking**: Visualize goal progress with interactive charts and metrics
- **Milestone System**: Break down goals into manageable milestones
- **Dashboard Analytics**: Get insights into your goal progress with comprehensive analytics
- **Team Collaboration**: Set and track goals with your team
- **Local Storage**: All data is saved in the browser's local storage for persistence
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive UI**: Built with Material UI components and Framer Motion animations

## Tech Stack

- **React 19** - Modern UI library for building component-based interfaces
- **TypeScript** - Typed JavaScript for better developer experience and code quality
- **Vite** - Fast, modern build tool for frontend development
- **Material UI 7** - Component library with Material Design implementation
- **React Router** - For client-side routing
- **Framer Motion** - For smooth animations and transitions
- **Recharts** - For data visualization and analytics
- **UUID** - For generating unique IDs

## Pages and Components

### Main Pages
1. **Landing Page** - Introduction to the application with feature highlights
2. **Dashboard** - Overview of all goals with analytics and charts
3. **Goals Page** - Manage personal and team goals with filtering options

### Key Components
- **Goal Cards** - Display goal details with progress indicators
- **Milestone Tracking** - Toggle and track milestone completion
- **Progress Charts** - Visualize goal progress and distribution
- **Comments System** - Add comments to goals for collaboration

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/daily-tracker.git
cd daily-tracker
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run dev
```

4. Build for production:
```
npm run build
```

## Project Structure

```
daily-tracker/
├── public/               # Static files
├── src/
│   ├── assets/           # Images and assets
│   ├── components/       # Reusable components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── goals/        # Goal management components
│   │   └── layout/       # Layout components (Navbar, Footer)
│   ├── context/          # React context providers
│   ├── pages/            # Main application pages
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions and sample data
├── App.tsx               # Main application component
└── main.tsx              # Application entry point
```

## Data Management

The application uses React Context API for state management. Goals, milestones, and comments are stored in the browser's local storage for data persistence between sessions.

## Customization

You can customize the application by:

1. Modifying the theme in `App.tsx`
2. Adding new components in the components directory
3. Extending types in the types directory

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Material UI](https://mui.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Recharts](https://recharts.org/)
- [Framer Motion](https://www.framer.com/motion/)
