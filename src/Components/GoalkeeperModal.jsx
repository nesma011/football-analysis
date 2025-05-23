import React from 'react';

const GoalkeeperModal = ({ onConfirm, onClose ,videoRef ,setIsPlaying }) => {
  const actions = [
    { type: 'Punch', color: 'bg-orange-500' },
    { type: 'Smother', color: 'bg-orange-600' },
    { type: 'Diving Save', color: 'bg-orange-700' },
    { type: 'Keeper Sweeper', color: 'bg-orange-800' }
  ];
    const handleActionSelect = (action) => {
    if (videoRef?.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    onConfirm(action);
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Goalkeeper Action</h2>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <button
              key={action.type}
      onClick={() => handleActionSelect(action.type)}

              className={`p-3 ${action.color} text-white rounded hover:opacity-90`}
            >
              {action.type}
            </button>
          ))}
        </div>
        <button 
          onClick={onClose}
          className="mt-4 w-full p-2 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GoalkeeperModal;