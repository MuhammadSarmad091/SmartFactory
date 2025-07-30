import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Factory, Lock, User, Eye, EyeOff, Shield } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    var tUsername = username.trim();
    const success = await login(tUsername, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'slideIn 1s ease-out'
          }}
        />
        
        <div 
          className="absolute top-20 left-20 w-24 h-24 border-2 border-blue-400/30 rounded-full"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        />
        <div 
          className="absolute top-32 right-24 w-16 h-16 border border-orange-400/20 rotate-45"
          style={{ animation: 'float 4s ease-in-out infinite 0.5s' }}
        />
        <div 
          className="absolute bottom-24 left-32 w-12 h-12 bg-blue-500/10 rounded-lg"
          style={{ animation: 'float 3.5s ease-in-out infinite 1s' }}
        />
      </div>

      {/* Main Login Card with Entrance Animation */}
      <div 
        className="relative z-10 bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20"
        style={{
          animation: 'cardEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div 
            className="relative inline-flex items-center justify-center w-16 h-16 mb-4"
            style={{ animation: 'logoSpin 1s ease-out 0.3s both' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg" />
            <div className="relative bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl w-full h-full flex items-center justify-center">
              <Factory className="h-8 w-8 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          
          <h1 
            className="text-2xl font-bold text-slate-900 mb-1"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}
          >
            Smart Factory
          </h1>
          <p 
            className="text-slate-600 text-sm mb-3"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.5s both' }}
          >
            Control Center Access
          </p>
          
          <div 
            className="inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-green-50 to-blue-50 rounded-full border border-green-200/50 text-xs"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.6s both' }}
          >
            <Shield className="h-3 w-3 text-green-600" />
            <span className="font-medium text-slate-700">Secure</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div 
            className="space-y-2"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.7s both' }}
          >
            <label className="block text-sm font-semibold text-slate-700">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-lg transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 hover:border-slate-300"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div 
            className="space-y-2"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.8s both' }}
          >
            <label className="block text-sm font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-lg transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 hover:border-slate-300"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div 
              className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg"
              style={{ animation: 'shake 0.5s ease-in-out' }}
            >
              <div className="text-red-700 text-sm font-medium">{error}</div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:from-blue-700 hover:to-blue-900 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-75 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.9s both' }}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div 
          className="mt-6 pt-4 border-t border-slate-200"
          style={{ animation: 'fadeInUp 0.6s ease-out 1s both' }}
        >
          <div className="flex items-center justify-center text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span>Secure encrypted connection</span>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes cardEntrance {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes logoSpin {
          0% {
            opacity: 0;
            transform: rotate(-180deg) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-100%);
          }
          100% {
            opacity: 0.2;
            transform: translateX(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
};

export default Login;