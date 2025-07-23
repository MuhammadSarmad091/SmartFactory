import React from 'react';
import { useData } from '../contexts/DataContext';
import RoomCard from '../components/RoomCard';
import { Building2 } from 'lucide-react';

const Rooms: React.FC = () => {
  const { rooms, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room Monitoring</h1>
          <p className="text-gray-600 mt-1">Environmental control and lighting management</p>
        </div>
        <div className="flex items-center space-x-2 text-blue-600">
          <Building2 className="h-5 w-5" />
          <span className="font-medium">{rooms.length} Active Rooms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, index) => (
          <RoomCard key={`${room.name}-${index}`} room={room} />
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
          <p className="text-gray-600">Check your backend connection or add rooms to the system.</p>
        </div>
      )}
    </div>
  );
};

export default Rooms;