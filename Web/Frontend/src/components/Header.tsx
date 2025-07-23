import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { LogOut, RefreshCw, Menu, X } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen }) => {
  const { logout } = useAuth();
  const { refreshData, loading } = useData();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-1 md:p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors mr-2 md:mr-4"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div>
          <h2 className="text-lg md:text-2xl font-semibold text-gray-900">Factory Control Center</h2>
          <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Real-time monitoring and control</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center px-2 md:px-3 py-1 md:py-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <button
            onClick={logout}
            className="flex items-center px-2 md:px-4 py-1 md:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;