import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "draft" | "todo" | "in-progress" | "under-review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assignee?: string;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
  score?: number;
}

export interface Column {
  id: string;
  title: string;
  status: Task["status"];
  count: number;
}

interface TaskState {
  tasks: Task[];
  columns: Column[];
  searchTerm: string;
  selectedLabels: string[];
  sortBy: "date" | "priority" | "title";
  viewMode: "board" | "list";
}
// Initial tasks data coz we don't have a backend
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Server Side Template Injection (Blind)",
    description: "Critical security vulnerability found in template processing",
    status: "draft",
    priority: "critical",
    assignee: "Jaggu",
    labels: ["Security", "Backend"],
    createdAt: new Date("2024-01-03T16:35:00"),
    updatedAt: new Date("2024-01-03T16:35:00"),
    score: 8.8,
  },
  {
    id: "2",
    title: "PII Disclosure",
    description: "Personal information exposed in API response",
    status: "draft",
    priority: "medium",
    assignee: "Chhota Bheem",
    labels: ["Privacy", "API"],
    createdAt: new Date("2024-01-03T16:35:00"),
    updatedAt: new Date("2024-01-03T16:35:00"),
    score: 4.5,
  },
  {
    id: "3",
    title: ".svn/entries Found",
    description: "Version control files exposed publicly",
    status: "todo",
    priority: "low",
    assignee: "Dholu",
    labels: ["Configuration"],
    createdAt: new Date("2024-01-03T16:35:00"),
    updatedAt: new Date("2024-01-03T16:35:00"),
    score: 2.3,
  },
  {
    id: "4",
    title: "JSON Web Key Set Disclosed",
    description: "JWT keys exposed in public endpoint",
    status: "under-review",
    priority: "high",
    assignee: "Bholu",
    labels: ["Authentication", "API"],
    createdAt: new Date("2024-01-03T16:35:00"),
    updatedAt: new Date("2024-01-03T16:35:00"),
    score: 6.5,
  },
  {
    id: "5",
    title: "WordPress Database Backup File Found",
    description: "Database backup accessible via web",
    status: "under-review",
    priority: "medium",
    assignee: "Kalliya",
    labels: ["Database", "WordPress"],
    createdAt: new Date("2024-01-03T16:35:00"),
    updatedAt: new Date("2024-01-03T16:35:00"),
    score: 6.5,
  },
  {
    id: "6",
    title: "SQL Injection Vulnerability",
    description: "Vulnerable to SQL injection attacks",
    status: "in-progress",
    priority: "high",
    assignee: "Indumati",
    labels: ["Security", "Database"],
    createdAt: new Date("2024-01-03T16:35:00"),
    updatedAt: new Date("2024-01-03T16:35:00"),
    score: 7.2,
  },
  {
    id: "7",
    title: "XSS Vulnerability",
    description: "Vulnerable to cross-site scripting attacks",
    status: "in-progress",
    priority: "medium",
    assignee: "Chota Bheem",
    labels: ["Security", "Frontend"],
    createdAt: new Date("2024-01-03T16:35:00"),
    updatedAt: new Date("2024-01-03T16:35:00"),
    score: 5.8,
  },
  {
    id: "8",
    title: "SQL Injection Vulnerability",
    description: "Vulnerable to SQL injection attacks",
    status: "done",
    priority: "high",
    assignee: "Mighty Raju",
    labels: ["Security", "Database"],
    createdAt: new Date("2024-01-03T16:35:00"),
    updatedAt: new Date("2024-01-03T16:35:00"),
    score: 7.2,
  },
];

const initialColumns: Column[] = [
  { id: "draft", title: "Draft", status: "draft", count: 0 },
  { id: "todo", title: "To Do", status: "todo", count: 0 },
  { id: "in-progress", title: "In Progress", status: "in-progress", count: 0 },
  {
    id: "under-review",
    title: "Under Review",
    status: "under-review",
    count: 0,
  },
  { id: "done", title: "Done", status: "done", count: 0 },
];

const initialState: TaskState = {
  tasks: initialTasks,
  columns: initialColumns,
  searchTerm: "",
  selectedLabels: [],
  sortBy: "date",
  viewMode: "board",
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (
      state,
      action: PayloadAction<Omit<Task, "id" | "createdAt" | "updatedAt">>
    ) => {
      const newTask: Task = {
        ...action.payload,
        id: (state.tasks.length + 1).toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      state.tasks.push(newTask);
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Task> }>
    ) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: new Date(),
        };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    moveTask: (
      state,
      action: PayloadAction<{ taskId: string; newStatus: Task["status"] }>
    ) => {
      const { taskId, newStatus } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex].status = newStatus;
        state.tasks[taskIndex].updatedAt = new Date();
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedLabels: (state, action: PayloadAction<string[]>) => {
      state.selectedLabels = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<"date" | "priority" | "title">
    ) => {
      state.sortBy = action.payload;
    },
    setViewMode: (state, action: PayloadAction<"board" | "list">) => {
      state.viewMode = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  setSearchTerm,
  setSelectedLabels,
  setSortBy,
  setViewMode,
} = taskSlice.actions;

export default taskSlice.reducer;
