import React from 'react';
import { useData } from '../contexts/DataContext';
import { Thermometer, Droplets, Wind, Volume2, Lightbulb, AlertTriangle } from 'lucide-react';
import CCTVModal from './CCTVModal';

interface Room {
  name: string;
  img_src?: string;
  temperature: number;
  humidity: number;
  smoke: number;
  noise_level: number;
  lights: boolean[];
}

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const { toggleLight } = useData();
  const [showCCTV, setShowCCTV] = React.useState(false);

  // Define upper bounds for room attributes
  const upperBounds = {
    temperature: 30, // °C
    humidity: 70, // %
    smoke: 30, // ppm
    noise_level: 70 // dB
  };

  const isOutOfBounds = (value: number, bound: number) => value > bound;

  const getEnvironmentalStatus = () => {
    if (room.temperature > 35 || room.humidity > 80 || room.smoke > 50) return 'critical';
    if (room.temperature > 30 || room.humidity > 70 || room.smoke > 30) return 'warning';
    return 'optimal';
  };

  const status = getEnvironmentalStatus();
  const statusColors = {
    optimal: 'border-green-500 bg-green-50',
    warning: 'border-yellow-500 bg-yellow-50',
    critical: 'border-red-500 bg-red-50',
  };

  return (
    <>
      <div 
        className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-l-4 cursor-pointer ${statusColors[status]}`}
        onClick={() => setShowCCTV(true)}
      >
      {/* Room Image */}
      <div className="h-48 bg-gradient-to-br from-gray-500 to-gray-700 relative">
        <img
          src={room.img_src || "https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=500"}
          alt="Factory Room"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{room.name}</h3>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            status === 'optimal' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
          }`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
            {status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Room Details */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-600">Temperature</span>
            {isOutOfBounds(room.temperature, upperBounds.temperature) && (
              <AlertTriangle className="h-3 w-3 text-red-500" />
            )}
          </div>
          <span className={`text-sm font-medium ${
            isOutOfBounds(room.temperature, upperBounds.temperature) 
              ? 'text-red-600 font-bold' 
              : 'text-gray-900'
          }`}>
            {room.temperature}°C
          </span>

          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">Humidity</span>
            {isOutOfBounds(room.humidity, upperBounds.humidity) && (
              <AlertTriangle className="h-3 w-3 text-red-500" />
            )}
          </div>
          <span className={`text-sm font-medium ${
            isOutOfBounds(room.humidity, upperBounds.humidity) 
              ? 'text-red-600 font-bold' 
              : 'text-gray-900'
          }`}>
            {room.humidity}%
          </span>

          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Smoke Level</span>
            {isOutOfBounds(room.smoke, upperBounds.smoke) && (
              <AlertTriangle className="h-3 w-3 text-red-500" />
            )}
          </div>
          <span className={`text-sm font-medium ${
            isOutOfBounds(room.smoke, upperBounds.smoke) 
              ? 'text-red-600 font-bold' 
              : 'text-gray-900'
          }`}>
            {room.smoke} ppm
          </span>

          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-gray-600">Noise Level</span>
            {isOutOfBounds(room.noise_level, upperBounds.noise_level) && (
              <AlertTriangle className="h-3 w-3 text-red-500" />
            )}
          </div>
          <span className={`text-sm font-medium ${
            isOutOfBounds(room.noise_level, upperBounds.noise_level) 
              ? 'text-red-600 font-bold' 
              : 'text-gray-900'
          }`}>
            {room.noise_level} dB
          </span>
        </div>

        {/* Lighting Control */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Lighting Control</span>
            </div>
            <span className="text-xs text-gray-500">
              {room.lights.filter(Boolean).length}/{room.lights.length} ON
            </span>
          </div>
          
          <div className="flex space-x-3">
            {room.lights.map((isOn, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLight(room.name, index);
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  isOn
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                Light {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Environmental Alert */}
        {status !== 'optimal' && (
          <div className={`mt-4 p-3 rounded-lg ${
            status === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm font-medium ${
              status === 'warning' ? 'text-yellow-800' : 'text-red-800'
            }`}>
              {status === 'warning' ? '⚠️ Environmental Warning' : '🚨 Critical Conditions'}
            </p>
            <p className={`text-xs mt-1 ${
              status === 'warning' ? 'text-yellow-700' : 'text-red-700'
            }`}>
              {status === 'warning' 
                ? 'Monitor conditions closely' 
                : 'Immediate attention required'
              }
            </p>
          </div>
        )}
      </div>
      </div>
      
      <CCTVModal 
        isOpen={showCCTV}
        onClose={() => setShowCCTV(false)}
        roomName={room.name}
      />
    </>
  );
};

export default RoomCard;