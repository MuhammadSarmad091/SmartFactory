import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface QuickStatsItem {
  name: string;
  status: 'optimal' | 'warning' | 'critical' | 'offline';
  value: string;
  maintenance?: string;
}

interface QuickStatsProps {
  title: string;
  icon: LucideIcon;
  items: QuickStatsItem[];
  navigateTo?: string;
}

const QuickStats: React.FC<QuickStatsProps> = ({ title, icon: Icon, items, navigateTo }) => {
  const navigate = useNavigate();

  const statusColors = {
    optimal: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800',
    offline: 'bg-gray-100 text-gray-800',
  };

  const handleItemClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Icon className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 ${
              navigateTo ? 'cursor-pointer hover:bg-gray-50 rounded-md px-2 -mx-2 transition-colors' : ''
            }`}
            onClick={handleItemClick}
          >
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600">{item.value}</p>
              {item.maintenance && (
                <p className={`text-xs font-medium ${
                  item.maintenance.toLowerCase() === 'normal operation' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {item.maintenance}
                </p>
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;