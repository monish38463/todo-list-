import React, { useState } from 'react';
import { CheckSquare, Mail, Github, Chrome, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { login } = useAuth();
  const { addToast } = useToast();

  const handleLogin = async (provider: 'google' | 'github' | 'facebook') => {
    setIsLoading(provider);
    
    try {
      await login(provider);
      addToast({
        type: 'success',
        message: `Successfully logged in with ${provider}!`,
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to login. Please try again.',
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-2xl">
              <CheckSquare className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Welcome to TaskFlow
          </h1>
          
          <p className="text-gray-600">
            Your modern task management solution
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Sign in to continue
          </h2>
          
          <div className="space-y-4">
            {/* Google Login */}
            <button
              onClick={() => handleLogin('google')}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
              ) : (
                <Chrome className="w-5 h-5 mr-3 text-red-500" />
              )}
              Continue with Google
            </button>

            {/* GitHub Login */}
            <button
              onClick={() => handleLogin('github')}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === 'github' ? (
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
              ) : (
                <Github className="w-5 h-5 mr-3" />
              )}
              Continue with GitHub
            </button>

            {/* Facebook Login */}
            <button
              onClick={() => handleLogin('facebook')}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === 'facebook' ? (
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
              ) : (
                <Mail className="w-5 h-5 mr-3 text-blue-600" />
              )}
              Continue with Facebook
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};