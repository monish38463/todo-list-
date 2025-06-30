export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'github' | 'facebook';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  sharedWith: string[];
  tags: string[];
}

export interface TaskFilter {
  status?: 'all' | 'pending' | 'in-progress' | 'completed';
  priority?: 'all' | 'low' | 'medium' | 'high';
  dueDate?: 'all' | 'today' | 'tomorrow' | 'this-week' | 'overdue';
  search?: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}