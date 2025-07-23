import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  isOn, 
  onToggle, 
  size = 'md', 
  disabled = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-10 h-5',
    lg: 'w-12 h-6',
  };

  const circleClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const translateClasses = {
    sm: isOn ? 'translate-x-4' : 'translate-x-0.5',
    md: isOn ? 'translate-x-5' : 'translate-x-0.5',
    lg: isOn ? 'translate-x-6' : 'translate-x-0.5',
  };

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`
        relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out
        ${sizeClasses[size]}
        ${isOn ? 'bg-green-500' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        hover:${isOn ? 'bg-green-600' : 'bg-gray-400'}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
      `}
    >
      <span
        className={`
          inline-block bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out
          ${circleClasses[size]}
          ${translateClasses[size]}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;