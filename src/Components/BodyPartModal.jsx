import React, { useState } from 'react';

const BodyPartModal = ({ onConfirm, onClose, videoRef, setIsPlaying }) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState('');

  const bodyParts = [
    'Right Foot',
    'Left Foot',
    'Head',
    'Chest',
    'Right Hand',
    'Left Hand',
    'Both Hands',
  ];

  const handleConfirm = () => {
    if (selectedBodyPart) {
      onConfirm(selectedBodyPart);
      if (videoRef?.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Select Body Part</h2>
        <select
          value={selectedBodyPart}
          onChange={(e) => setSelectedBodyPart(e.target.value)}
          className="w-full p-2 border rounded mb-4">
          <option value="">-- Select Body Part --</option>
          {bodyParts.map((part) => (
            <option key={part} value={part}>
              {part}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedBodyPart}
            className={`px-4 py-2 text-white rounded ${
              selectedBodyPart ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BodyPartModal;