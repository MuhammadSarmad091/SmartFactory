import React from 'react';
import { useData } from '../contexts/DataContext';
import { Power, Thermometer, Activity, Zap, Volume2, Wrench, Gauge, AlertTriangle } from 'lucide-react';

interface Machine {
  name: string;
  manufacturer: string;
  model: string;
  installation_date: string;
  location: string;
  img_src?: string;
  power: boolean;
  temperature: number;
  vibration: number;
  power_usage: number;
  noise_level: number;
  production_speed?: number;
  maintenance: string | undefined;
}

interface MachineCardProps {
  machine: Machine;
}

const MachineCard: React.FC<MachineCardProps> = ({ machine }) => {
  const { toggleMachine } = useData();

  // Define upper bounds for machine attributes
  const upperBounds = {
    temperature: 80, // °C
    vibration: 50, // Hz
    power_usage: 100, // kW
    noise_level: 85, // dB
    production_speed: 1000 // units/hr
  };

  const isOutOfBounds = (value: number, bound: number) => value > bound;

  const getMaintenanceStatus = (maintenance: string) => {
    switch ((maintenance || '').toLowerCase()) {
      case 'normal operation':
        return { color: 'text-green-600 bg-green-50' };
      case 'unavailable':
        return { color: 'text-gray-600 bg-gray-50' };
      default:
        return { color: 'text-red-600 bg-red-50' };
    }
  };

  const maintenanceStatus = getMaintenanceStatus(machine.maintenance);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Machine Image */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
        <img
          src={machine.img_src || "https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=500"}
          alt="Industrial Machine"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold text-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{machine.name}</h3>
          <p className="text-sm opacity-90" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{machine.manufacturer} {machine.model}</p>
        </div>
      </div>

      {/* Machine Details */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-600">Temperature</span>
            {isOutOfBounds(machine.temperature, upperBounds.temperature) && (
              <AlertTriangle className="h-3 w-3 text-red-500" />
            )}
          </div>
          <span className={`text-sm font-medium ${
            isOutOfBounds(machine.temperature, upperBounds.temperature) 
              ? 'text-red-600 font-bold' 
              : 'text-gray-900'
          }`}>
            {machine.temperature}°C
          </span>

          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">Vibration</span>
            {isOutOfBounds(machine.vibration, upperBounds.vibration) && (
              <AlertTriangle className="h-3 w-3 text-red-500" />
            )}
          </div>
          <span className={`text-sm font-medium ${
            isOutOfBounds(machine.vibration, upperBounds.vibration) 
              ? 'text-red-600 font-bold' 
              : 'text-gray-900'
          }`}>
            {machine.vibration} Hz
          </span>

          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-600">Power Usage</span>
            {isOutOfBounds(machine.power_usage, upperBounds.power_usage) && (
              <AlertTriangle className="h-3 w-3 text-red-500" />
            )}
          </div>
          <span className={`text-sm font-medium ${
            isOutOfBounds(machine.power_usage, upperBounds.power_usage) 
              ? 'text-red-600 font-bold' 
              : 'text-gray-900'
          }`}>
            {machine.power_usage} kW
          </span>

          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-gray-600">Noise Level</span>
            {isOutOfBounds(machine.noise_level, upperBounds.noise_level) && (
              <AlertTriangle className="h-3 w-3 text-red-500" />
            )}
          </div>
          <span className={`text-sm font-medium ${
            isOutOfBounds(machine.noise_level, upperBounds.noise_level) 
              ? 'text-red-600 font-bold' 
              : 'text-gray-900'
          }`}>
            {machine.noise_level} dB
          </span>

          {machine.production_speed !== undefined && (
            <>
              <div className="flex items-center space-x-2">
                <Gauge className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Production Speed</span>
                {isOutOfBounds(machine.production_speed, upperBounds.production_speed) && (
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                )}
              </div>
              <span className={`text-sm font-medium ${
                isOutOfBounds(machine.production_speed, upperBounds.production_speed) 
                  ? 'text-red-600 font-bold' 
                  : 'text-gray-900'
              }`}>
                {machine.production_speed} units/hr
              </span>
            </>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wrench className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Maintenance</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${maintenanceStatus.color}`}>
              {maintenanceStatus.icon} {machine.maintenance || 'Unknown'}
            </span>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            <p>Location: {machine.location}</p>
            <p>Installed: {new Date(machine.installation_date).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Power Status Indicator */}
        <button
          onClick={() => toggleMachine(machine.name)}
          className={`mt-4 w-full flex items-center justify-center py-2 rounded-lg transition-colors ${
          machine.power ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
        } hover:${machine.power ? 'bg-green-100' : 'bg-gray-100'}`}
        >
          <Power className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {machine.power ? 'Online' : 'Offline'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MachineCard;