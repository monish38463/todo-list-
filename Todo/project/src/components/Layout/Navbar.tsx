import React from 'react';
import { CheckSquare, User, LogOut, Settings, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOffline } from '../../hooks/useOffline';
import { useRealTimeSync } from '../../hooks/useRealTimeSync';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isOnline } = useOffline();
  const { forceSync } = useRealTimeSync();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Online/Offline indicator */}
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <button
                  onClick={forceSync}
                  className="flex items-center space-x-1 px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium hover:bg-success-200 transition-colors"
                >
                  <Wifi className="w-4 h-4" />
                  <span>Online</span>
                </button>
              ) : (
                <div className="flex items-center space-x-1 px-3 py-1 bg-error-100 text-error-700 rounded-full text-sm font-medium">
                  <WifiOff className="w-4 h-4" />
                  <span>Offline</span>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.name}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};