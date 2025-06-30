import React from 'react';
import { Plus, ListTodo } from 'lucide-react';
import { useTask } from '../../contexts/TaskContext';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  onCreateTask: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onCreateTask }) => {
  const { getFilteredTasks } = useTask();
  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-4 rounded-full">
            <ListTodo className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-500 mb-6">
          Get started by creating your first task or adjust your filters.
        </p>
        <button
          onClick={onCreateTask}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};