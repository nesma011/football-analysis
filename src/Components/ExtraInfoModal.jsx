import React, { useState } from 'react';

const ExtraInfoModal = ({ onConfirm, onClose, eventType ,videoRef ,setIsPlaying }) => {
  const [extraInfo, setExtraInfo] = useState('');
  const [passType, setPassType] = useState('Open Play');
  const [bodyPart, setBodyPart] = useState('');
  const [saveTechnique, setSaveTechnique] = useState('');

  const extraInfoOptions = ['Recovery', 'Interception', ''];
  const passTypeOptions = ['Open Play', 'Throw-in', 'Corner', 'Free Kick', 'Goal Kick'];
  const bodyPartOptions = ['Right Foot', 'Left Foot', 'Head', 'Chest', 'Right Hand', 'Left Hand', 'Both Hand', ''];
  const saveTechniqueOptions = ['Diving', 'Standing', ''];

const handleConfirm = () => {
  if (videoRef?.current) {
    videoRef.current.pause();
    setIsPlaying(false);
  }
  onConfirm({ extraInfo, passType, bodyPart, saveTechnique });
  onClose();
};

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg mb-2">Select Extra Information</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Extra Info</label>
          <select
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {extraInfoOptions.map((option) => (
              <option key={option} value={option}>
                {option || 'None'}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Pass Type</label>
          <select
            value={passType}
            onChange={(e) => setPassType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {passTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {eventType === 'Goalkeeper' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Body Part</label>
              <select
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {bodyPartOptions.map((option) => (
                  <option key={option} value={option}>
                    {option || 'None'}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Save Technique</label>
              <select
                value={saveTechnique}
                onChange={(e) => setSaveTechnique(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {saveTechniqueOptions.map((option) => (
                  <option key={option} value={option}>
                    {option || 'None'}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <div className="flex space-x-2">
          <button
            onClick={handleConfirm}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Confirm
          </button>
          <button onClick={onClose} className="p-2 bg-red-500 text-white rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtraInfoModal;