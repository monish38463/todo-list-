import React, { useState } from 'react';
import { Share2, Mail, X, Plus } from 'lucide-react';
import { Task } from '../../types';
import { useTask } from '../../contexts/TaskContext';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../UI/Modal';

interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export const ShareTaskModal: React.FC<ShareTaskModalProps> = ({ isOpen, onClose, task }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateTask } = useTask();
  const { addToast } = useToast();

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      addToast({
        type: 'error',
        message: 'Please enter an email address',
      });
      return;
    }

    if (!email.includes('@')) {
      addToast({
        type: 'error',
        message: 'Please enter a valid email address',
      });
      return;
    }

    if (task.sharedWith.includes(email)) {
      addToast({
        type: 'warning',
        message: 'Task is already shared with this email',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateTask(task.id, {
        sharedWith: [...task.sharedWith, email.trim()],
      });
      
      addToast({
        type: 'success',
        message: `Task shared with ${email}`,
      });
      
      setEmail('');
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to share task',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveShare = (emailToRemove: string) => {
    updateTask(task.id, {
      sharedWith: task.sharedWith.filter(email => email !== emailToRemove),
    });
    
    addToast({
      type: 'success',
      message: 'Removed task access',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Task" size="md">
      <div className="space-y-6">
        {/* Task Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600">{task.description}</p>
          )}
        </div>

        {/* Share Form */}
        <form onSubmit={handleShare}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Share with email
          </label>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </form>

        {/* Shared With List */}
        {task.sharedWith.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Shared with ({task.sharedWith.length})
            </h4>
            <div className="space-y-2">
              {task.sharedWith.map((email) => (
                <div key={email} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <Mail className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-sm text-gray-900">{email}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveShare(email)}
                    className="text-gray-400 hover:text-error-600 transition-colors"
                    title="Remove access"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Share2 className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-primary-900 mb-1">
                About Task Sharing
              </h4>
              <p className="text-xs text-primary-700">
                People you share this task with will be able to view and edit it. 
                They'll receive notifications about updates and changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};