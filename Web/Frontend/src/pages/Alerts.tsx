import React from 'react';
import { useData } from '../contexts/DataContext';
import { AlertTriangle, Thermometer, Wind, Volume2, Wrench, Zap, Clock } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'machine' | 'room' | 'maintenance' | 'production';
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  icon: React.ComponentType<any>;
}

const Alerts: React.FC = () => {
  const { rooms, machines, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Generate alerts based on current data
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];
    let alertId = 1;

    // Room temperature alerts
    rooms.forEach(room => {
      if (room.temperature > 35) {
        alerts.push({
          id: `alert-${alertId++}`,
          type: 'critical',
          category: 'room',
          title: 'Critical Temperature Alert',
          description: `${room.name} temperature is ${room.temperature}°C (Critical: >35°C)`,
          timestamp: new Date(),
          source: room.name,
          icon: Thermometer
        });
      } else if (room.temperature > 30) {
        alerts.push({
          id: `alert-${alertId++}`,
          type: 'warning',
          category: 'room',
          title: 'High Temperature Warning',
          description: `${room.name} temperature is ${room.temperature}°C (Warning: >30°C)`,
          timestamp: new Date(),
          source: room.name,
          icon: Thermometer
        });
      }

      // Smoke level alerts
      if (room.smoke > 50) {
        alerts.push({
          id: `alert-${alertId++}`,
          type: 'critical',
          category: 'room',
          title: 'Critical Smoke Level',
          description: `${room.name} smoke level is ${room.smoke} ppm (Critical: >50 ppm)`,
          timestamp: new Date(),
          source: room.name,
          icon: Wind
        });
      } else if (room.smoke > 30) {
        alerts.push({
          id: `alert-${alertId++}`,
          type: 'warning',
          category: 'room',
          title: 'Elevated Smoke Level',
          description: `${room.name} smoke level is ${room.smoke} ppm (Warning: >30 ppm)`,
          timestamp: new Date(),
          source: room.name,
          icon: Wind
        });
      }

      // Noise level alerts
      if (room.noise_level > 80) {
        alerts.push({
          id: `alert-${alertId++}`,
          type: 'warning',
          category: 'room',
          title: 'High Noise Level',
          description: `${room.name} noise level is ${room.noise_level} dB (Warning: >80 dB)`,
          timestamp: new Date(),
          source: room.name,
          icon: Volume2
        });
      }
    });

    // Machine alerts
    machines.forEach(machine => {
      // Maintenance alerts
      if (machine.maintenance && machine.maintenance.toLowerCase() !== 'normal operation') {
        alerts.push({
          id: `alert-${alertId++}`,
          type: machine.maintenance.toLowerCase().includes('critical') ? 'critical' : 'warning',
          category: 'maintenance',
          title: 'Maintenance Required',
          description: `${machine.name}: ${machine.maintenance}`,
          timestamp: new Date(),
          source: machine.name,
          icon: Wrench
        });
      }

      // Machine offline alerts
      if (!machine.power) {
        alerts.push({
          id: `alert-${alertId++}`,
          type: 'warning',
          category: 'machine',
          title: 'Machine Offline',
          description: `${machine.name} is currently offline`,
          timestamp: new Date(),
          source: machine.name,
          icon: Zap
        });
      }

      // High temperature alerts for machines
      if (machine.power && machine.temperature > 80) {
        alerts.push({
          id: `alert-${alertId++}`,
          type: 'critical',
          category: 'machine',
          title: 'Machine Overheating',
          description: `${machine.name} temperature is ${machine.temperature}°C (Critical: >80°C)`,
          timestamp: new Date(),
          source: machine.name,
          icon: Thermometer
        });
      }

      // High power usage alerts
      if (machine.power && machine.power_usage > 100) {
        alerts.push({
          id: `alert-${alertId++}`,
          type: 'warning',
          category: 'machine',
          title: 'High Power Consumption',
          description: `${machine.name} power usage is ${machine.power_usage} kW (Warning: >100 kW)`,
          timestamp: new Date(),
          source: machine.name,
          icon: Zap
        });
      }
    });

    // Sort alerts by severity and timestamp
    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      
      // First sort by severity
      if (severityOrder[a.type] !== severityOrder[b.type]) {
        return severityOrder[a.type] - severityOrder[b.type];
      }
      
      // Then by source name (alphabetical) for stable ordering
      if (a.source !== b.source) {
        return a.source.localeCompare(b.source);
      }
      
      // Finally by alert title for consistent sub-ordering
      return a.title.localeCompare(b.title);
    });
  };

  const alerts = generateAlerts();
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical');
  const warningAlerts = alerts.filter(alert => alert.type === 'warning');

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-red-500 bg-red-50 hover:bg-red-100';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50 hover:bg-yellow-100';
      default:
        return 'border-l-blue-500 bg-blue-50 hover:bg-blue-100';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Alerts</h1>
          <p className="text-gray-600 mt-1">Monitor critical events and maintenance requirements</p>
        </div>
        <div className="flex items-center space-x-2 text-blue-600">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">{alerts.length} Active Alerts</span>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Warning Alerts</p>
              <p className="text-2xl font-bold text-yellow-600">{warningAlerts.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Alerts</p>
              <p className="text-2xl font-bold text-blue-600">{alerts.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Alerts</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {alerts.length === 0 ? (
            <div className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
              <p className="text-gray-600">All systems are operating normally.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const IconComponent = alert.icon;
              return (
                <div
                  key={alert.id}
                  className={`p-6 border-l-4 transition-colors ${getAlertStyles(alert.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${getAlertIcon(alert.type)} bg-white`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.type === 'critical' 
                              ? 'bg-red-100 text-red-800' 
                              : alert.type === 'warning'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">{alert.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{alert.timestamp.toLocaleString()}</span>
                          </div>
                          <span>Source: {alert.source}</span>
                          <span className="capitalize">Category: {alert.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;