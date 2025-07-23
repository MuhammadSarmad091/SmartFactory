import React from 'react';
import { useData } from '../contexts/DataContext';
import { Activity, Package, Cog, Building2, Thermometer, Zap, AlertTriangle } from 'lucide-react';
import StatCard from '../components/StatCard';
import QuickStats from '../components/QuickStats';

const Dashboard: React.FC = () => {
  const { rooms, machines, cartons_num, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activeMachines = machines.filter(m => m.power).length;
  const totalMachines = machines.length;
  const avgTemperature = rooms.reduce((sum, room) => sum + room.temperature, 0) / rooms.length || 0;
  const maintenanceRequired = machines.filter(m => m.power && m.maintenance && m.maintenance.toLowerCase() !== 'normal operation').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Factory Overview</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Activity className="h-4 w-4" />
          <span>Live Data</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Cartons in Stock"
          value={cartons_num.toLocaleString()}
          icon={Package}
          color="blue"
          trend={cartons_num > 1000 ? 'up' : cartons_num > 500 ? 'stable' : 'down'}
          linkTo="/analytics"
        />
        
        <StatCard
          title="Active Machines"
          value={`${activeMachines}/${totalMachines}`}
          icon={Cog}
          color="green"
          trend={activeMachines === totalMachines ? 'up' : activeMachines > totalMachines/2 ? 'stable' : 'down'}
          linkTo="/machines"
        />
        
        <StatCard
          title="Avg Temperature"
          value={`${avgTemperature.toFixed(1)}°C`}
          icon={Thermometer}
          color="orange"
          trend={avgTemperature < 25 ? 'up' : avgTemperature < 30 ? 'stable' : 'down'}
          linkTo="/rooms"
        />
        
        <StatCard
          title="Maintenance Alerts"
          value={maintenanceRequired.toString()}
          icon={AlertTriangle}
          color={maintenanceRequired > 0 ? 'red' : 'green'}
          trend={maintenanceRequired === 0 ? 'up' : 'down'}
          linkTo="/alerts"
        />
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickStats
          title="Rooms Status"
          icon={Building2}
          navigateTo="/rooms"
          items={rooms.map(room => ({
            name: room.name,
            status: room.temperature < 30 ? 'optimal' : room.temperature < 35 ? 'warning' : 'critical',
            value: `${room.temperature}°C, ${room.humidity}% humidity`
          }))}
        />
        
        <QuickStats
          title="Machine Status"
          icon={Zap}
          navigateTo="/machines"
          items={machines.map(machine => ({
            name: machine.name,
            status: !machine.power ? 'offline' : (machine.maintenance && machine.maintenance.toLowerCase() !== 'normal operation') ? 'critical' : 'optimal',
            value: machine.power ? `${machine.power_usage}kW` : 'Offline',
            maintenance: machine.maintenance || 'Unknown'
          }))}
        />
      </div>

      {/* Production Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Production Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{totalMachines}</div>
            <div className="text-gray-600">Total Machines</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{rooms.length}</div>
            <div className="text-gray-600">Production Rooms</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{cartons_num}</div>
            <div className="text-gray-600">Cartons Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;