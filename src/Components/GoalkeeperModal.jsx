import React from 'react';

const GoalkeeperModal = ({ onConfirm, onClose, videoRef, setIsPlaying, eventType }) => {
const goalkeeperTechniques = [
  { type: 'Shot Saved', color: 'bg-orange-500' },
  { type: 'Save', color: 'bg-orange-600' },
  { type: 'Collected', color: 'bg-orange-700' },
  { type: 'Smother', color: 'bg-orange-800' },
];

  const handleActionSelect = (technique) => {
    if (!technique) {
      alert('Please select a technique.'); 
      return;
    }

    if (videoRef?.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    onConfirm(technique);
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Goalkeeper Action</h2>
        <div className="grid grid-cols-2 gap-2">
          {goalkeeperTechniques.map((technique) => (
            <button
              key={technique.type}
              onClick={() => handleActionSelect(technique.type)}
              className={`p-3 ${technique.color} text-white rounded hover:opacity-90`}
            >
              {technique.type}
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