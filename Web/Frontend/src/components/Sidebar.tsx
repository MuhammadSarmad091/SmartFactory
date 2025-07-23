import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Cog, Building2, BarChart3, Factory, Gamepad2, AlertTriangle, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/machines', icon: Cog, label: 'Machines' },
    { to: '/rooms', icon: Building2, label: 'Rooms' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/alerts', icon: AlertTriangle, label: 'Alerts' },
    { to: '/unity-model', icon: Gamepad2, label: 'Unity Model' },
  ];

  return (
    <div className={`
      fixed md:relative z-30 h-full bg-white shadow-lg border-r border-gray-200 transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      ${isOpen ? 'w-64' : 'w-0'}
    `}>
      <div className={`${isOpen ? 'block' : 'hidden'} w-64`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Factory className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Smart Factory</h1>
        </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      </div>
    </div>
  );
};

export default Sidebar;