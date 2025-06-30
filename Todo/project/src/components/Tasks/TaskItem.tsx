import React, { useState } from 'react';
import { 
  Calendar, 
  Flag, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Share2, 
  CheckCircle,
  Clock,
  User,
  Tag
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { Task } from '../../types';
import { useTask } from '../../contexts/TaskContext';
import { useToast } from '../../contexts/ToastContext';
import { TaskForm } from './TaskForm';
import { ShareTaskModal } from './ShareTaskModal';
import { Modal } from '../UI/Modal';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { updateTask, deleteTask } = useTask();
  const { addToast } = useToast();

  const handleStatusChange = (status: Task['status']) => {
    updateTask(task.id, { status });
    addToast({
      type: 'success',
      message: `Task marked as ${status}`,
    });
  };

  const handleDelete = () => {
    deleteTask(task.id);
    addToast({
      type: 'success',
      message: 'Task deleted successfully',
    });
    setShowDeleteModal(false);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-700 border-error-200';
      case 'medium':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'low':
        return 'bg-success-100 text-success-700 border-success-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'in-progress':
        return 'bg-primary-100 text-primary-700 border-primary-200';
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDueDateColor = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isPast(date) && task.status !== 'completed') {
      return 'text-error-600';
    }
    if (isToday(date)) {
      return 'text-warning-600';
    }
    if (isTomorrow(date)) {
      return 'text-primary-600';
    }
    return 'text-gray-600';
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Task Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleStatusChange(task.status === 'completed' ? 'pending' : 'completed')}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.status === 'completed'
                      ? 'bg-success-500 border-success-500'
                      : 'border-gray-300 hover:border-success-500'
                  }`}
                >
                  {task.status === 'completed' && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </button>
                
                <div>
                  <h3 className={`font-semibold ${
                    task.status === 'completed' 
                      ? 'text-gray-500 line-through' 
                      : 'text-gray-900'
                  }`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`text-sm mt-1 ${
                      task.status === 'completed' 
                        ? 'text-gray-400' 
                        : 'text-gray-600'
                    }`}>
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[160px]">
                    <button
                      onClick={() => {
                        setShowEditModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Task
                    </button>
                    <button
                      onClick={() => {
                        setShowShareModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Task
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Task
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Task Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {/* Due Date */}
              <div className={`flex items-center space-x-1 ${getDueDateColor(task.dueDate)}`}>
                <Calendar className="w-4 h-4" />
                <span>{formatDueDate(task.dueDate)}</span>
              </div>

              {/* Priority */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                <Flag className="w-3 h-3 inline mr-1" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>

              {/* Status */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                {task.status === 'in-progress' ? (
                  <Clock className="w-3 h-3 inline mr-1" />
                ) : (
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                )}
                {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
              </span>

              {/* Shared indicator */}
              {task.sharedWith.length > 0 && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <User className="w-4 h-4" />
                  <span>Shared with {task.sharedWith.length}</span>
                </div>
              )}

              {/* Tags */}
              {task.tags.length > 0 && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <Tag className="w-4 h-4" />
                  <span>{task.tags.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Task"
        size="lg"
      >
        <TaskForm
          task={task}
          onSubmit={() => setShowEditModal(false)}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* Share Modal */}
      <ShareTaskModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        task={task}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="text-center">
          <div className="bg-error-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-error-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete this task?
          </h3>
          <p className="text-gray-500 mb-6">
            This action cannot be undone. The task will be permanently deleted.
          </p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors"
            >
              Delete Task
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};