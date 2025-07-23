import React from 'react';
import { Link } from 'react-router-dom';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red';
  trend: 'up' | 'down' | 'stable';
  linkTo?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend, linkTo }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  };

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    stable: 'text-gray-500',
  };

  const TrendIcon = trendIcons[trend];

  const CardContent = () => (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <TrendIcon className={`h-4 w-4 ${trendColors[trend]}`} />
        <span className={`text-sm ml-1 ${trendColors[trend]}`}>
          {trend === 'up' ? 'Good' : trend === 'down' ? 'Attention' : 'Stable'}
        </span>
      </div>
    </>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer hover:bg-gray-50">
          <CardContent />
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <CardContent />
    </div>
  );
};

export default StatCard;