import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, TaskFilter } from '../types';
import { useAuth } from './AuthContext';

interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  isLoading: boolean;
}

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTER'; payload: TaskFilter }
  | { type: 'SET_LOADING'; payload: boolean };

interface TaskContextType extends TaskState {
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setFilter: (filter: TaskFilter) => void;
  getFilteredTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    filter: { status: 'all', priority: 'all', dueDate: 'all', search: '' },
    isLoading: false,
  });

  useEffect(() => {
    if (user) {
      // Load tasks from localStorage or API
      const storedTasks = localStorage.getItem('taskflow_tasks');
      if (storedTasks) {
        try {
          const tasks = JSON.parse(storedTasks);
          dispatch({ type: 'SET_TASKS', payload: tasks });
        } catch {
          dispatch({ type: 'SET_TASKS', payload: [] });
        }
      }
    }
  }, [user]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (!user) return;

    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.id,
    };

    const updatedTasks = [...state.tasks, newTask];
    localStorage.setItem('taskflow_tasks', JSON.stringify(updatedTasks));
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = state.tasks.map(t => t.id === id ? updatedTask : t);
    localStorage.setItem('taskflow_tasks', JSON.stringify(updatedTasks));
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  const deleteTask = (id: string) => {
    const updatedTasks = state.tasks.filter(t => t.id !== id);
    localStorage.setItem('taskflow_tasks', JSON.stringify(updatedTasks));
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const setFilter = (filter: TaskFilter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const getFilteredTasks = (): Task[] => {
    let filtered = state.tasks;

    // Filter by status
    if (state.filter.status && state.filter.status !== 'all') {
      filtered = filtered.filter(task => task.status === state.filter.status);
    }

    // Filter by priority
    if (state.filter.priority && state.filter.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === state.filter.priority);
    }

    // Filter by due date
    if (state.filter.dueDate && state.filter.dueDate !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      filtered = filtered.filter(task => {
        const dueDate = new Date(task.dueDate);
        
        switch (state.filter.dueDate) {
          case 'today':
            return dueDate.toDateString() === today.toDateString();
          case 'tomorrow':
            return dueDate.toDateString() === tomorrow.toDateString();
          case 'this-week':
            return dueDate >= today && dueDate <= nextWeek;
          case 'overdue':
            return dueDate < today && task.status !== 'completed';
          default:
            return true;
        }
      });
    }

    // Filter by search
    if (state.filter.search) {
      const searchTerm = state.filter.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    return filtered;
  };

  return (
    <TaskContext.Provider
      value={{
        ...state,
        addTask,
        updateTask,
        deleteTask,
        setFilter,
        getFilteredTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};