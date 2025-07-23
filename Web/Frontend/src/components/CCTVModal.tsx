import React from 'react';
import { X, Camera } from 'lucide-react';

interface CCTVModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
}

const CCTVModal: React.FC<CCTVModalProps> = ({ isOpen, onClose, roomName }) => {
  if (!isOpen) return null;

  const getCCTVFootage = (roomName: string) => {
    const lowerRoomName = roomName.toLowerCase();
    
    if (lowerRoomName.includes('machine') || lowerRoomName.includes('bottle') || lowerRoomName.includes('production')) {
      return {
        title: 'Machine Room CCTV',
        videoUrl: 'https://www.shutterstock.com/shutterstock/videos/1029889022/preview/stock-footage-automatic-machines-work-with-metal-in-a-large-factory-cctv-record-the-process.webm',
        description: 'Live feed from machine room'
      };
    } else if (lowerRoomName.includes('security') || lowerRoomName.includes('control')) {
      return {
        title: 'Security Room CCTV',
        videoUrl: 'https://www.shutterstock.com/shutterstock/videos/1056388097/preview/stock-footage-static-shot-of-a-group-of-professionals-working-in-a-surveillance-center-with-cctv-video-footage.webm',
        description: 'Live feed from security control room'
      };
    } else if (lowerRoomName.includes('warehouse') || lowerRoomName.includes('storage')) {
      return {
        title: 'Warehouse CCTV',
        videoUrl: 'https://www.shutterstock.com/shutterstock/videos/3450363327/preview/stock-footage-cctv-camera-surveillance-video-security-system-footage.webm',
        description: 'Live feed from warehouse storage area'
      };
    } else {
      return {
        title: 'Room CCTV',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        description: 'Live feed from factory room'
      };
    }
  };

  const footage = getCCTVFootage(roomName);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Camera className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{footage.title}</h2>
              <p className="text-sm text-gray-600">{roomName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            <video
              src={footage.videoUrl}
              className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
              title={`${roomName} CCTV Footage`}
              controlsList="nodownload nofullscreen noremoteplayback"
              disablePictureInPicture
              autoPlay
              muted
              loop
              style={{ objectFit: 'cover' }}
            >
              <p>Your browser does not support the video tag.</p>
            </video>
            <div className="absolute bottom-2 right-2">
              <button
                onClick={() => {
                  const video = document.querySelector('video');
                  if (video) {
                    if (video.requestFullscreen) {
                      video.requestFullscreen();
                    }
                  }
                }}
                className="bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70 transition-opacity"
                title="Fullscreen"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{footage.description}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Status: <span className="text-green-600 font-medium">● LIVE</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Quality: HD 1080p</p>
                <p className="text-xs text-gray-600">FPS: 30</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTVModal;