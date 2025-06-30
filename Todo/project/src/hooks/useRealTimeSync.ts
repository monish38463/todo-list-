import { useEffect, useRef } from 'react';
import { useTask } from '../contexts/TaskContext';
import { useToast } from '../contexts/ToastContext';

export const useRealTimeSync = () => {
  const { tasks } = useTask();
  const { addToast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate real-time sync with polling
    intervalRef.current = setInterval(() => {
      // In a real app, this would fetch from your backend
      // For now, we'll simulate occasional sync notifications
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        addToast({
          type: 'info',
          message: 'Tasks synchronized',
          duration: 2000,
        });
      }
    }, 30000); // Poll every 30 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [addToast]);

  const forceSync = () => {
    addToast({
      type: 'success',
      message: 'Tasks synchronized successfully',
      duration: 2000,
    });
  };

  return { forceSync };
};