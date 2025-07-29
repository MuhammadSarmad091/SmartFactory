import React from 'react';
import { Gamepad2 } from 'lucide-react';

const UnityModel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Unity 3D Model</h1>
          <p className="text-gray-600 mt-1">Interactive 3D factory visualization</p>
        </div>
        <div className="flex items-center space-x-2 text-blue-600">
          <Gamepad2 className="h-5 w-5" />
          <span className="font-medium">3D Visualization</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Factory 3D Model</h2>
          <p className="text-gray-600 text-sm mt-1">
            Interactive Unity WebGL model of the factory layout and operations
          </p>
        </div>
        
        <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src="/unity/index.html"
            className="absolute top-0 left-0 w-full h-full border-0"
            title="Unity 3D Factory Model"
            allowFullScreen
          />
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Use mouse to navigate: Left click + drag to rotate, scroll to zoom, right click + drag to pan
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnityModel;