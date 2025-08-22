# Kanban Board Application

A modern, responsive Kanban board application built with Next.js, TypeScript, Redux and Shadcn for UI. Features drag-and-drop functionality, task management, user authentication, and a clean black and white design.

## 🚀 Tech Stack

### Frontend Framework

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience

### State Management

- **Redux Toolkit** - Modern Redux with simplified setup
- **React Redux** - React bindings for Redux

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icons

### Features & Libraries

- **@hello-pangea/dnd** - Drag and drop functionality
- **Sonner** - Toast notifications
- **React Hook Form** - Form handling and validation

## 📋 Features

- ✅ **Drag & Drop**: Move tasks between columns seamlessly
- ✅ **Task Management**: Create, edit, delete, and organize tasks
- ✅ **User Authentication**: Login/signup with form validation
- ✅ **Search & Filter**: Find tasks by name and filter by labels
- ✅ **Sorting**: Sort tasks by date, priority, or title
- ✅ **View Modes**: Switch between board and list views
- ✅ **Priority Levels**: Low, Medium, High, Critical task priorities
- ✅ **Labels & Categories**: Organize tasks with custom labels
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Toast Notifications**: User feedback for all actions
- ✅ **Local Storage**: Persist user data and tasks

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd kanban-board
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install

# or

yarn install
\`\`\`

### 3. Run Development Server

\`\`\`bash
npm run dev

# or

yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 4. Build for Production

\`\`\`bash
npm run build
npm start

# or

yarn build
yarn start
\`\`\`

## 📁 Project Structure

\`\`\`
kanban-board/
├── app/ # Next.js App Router
│ ├── layout.tsx # Root layout with providers
│ └── page.tsx # Main application page
├── components/ # React components
│ ├── ui/ # shadcn/ui components
│ ├── kanban-board.tsx # Main board component
│ ├── task-card.tsx # Individual task cards
│ ├── task-dialog.tsx # Task creation/editing modal
│ ├── login-form.tsx # Authentication form
│ └── providers.tsx # Redux provider wrapper
├── store/ # Redux store configuration
│ ├── store.ts # Main store setup
│ ├── hooks.ts # Typed Redux hooks
│ └── slices/ # Redux slices
│ ├── auth-slice.ts # Authentication state
│ └── task-slice.ts # Task management state
├── lib/ # Utility functions
│ └── utils.ts # Helper functions
└── types/ # TypeScript type definitions
└── index.ts # Shared types
\`\`\`

## 🎯 Usage

### Getting Started

1. **Login/Signup**: Create an account or login with existing credentials
2. **Create Tasks**: Click the "+" button in any column to add new tasks
3. **Drag & Drop**: Move tasks between columns (Draft, To Do, In Progress, Under Review, Done)
4. **Edit Tasks**: Click on any task card to edit details, priority, labels, and assignees
5. **Search & Filter**: Use the search bar and filter options to find specific tasks
6. **Sort Tasks**: Use the sort dropdown to organize tasks by date, priority, or title
