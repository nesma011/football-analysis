import React, { useState } from 'react';

const TechniqueModal = ({ eventType, onConfirm, onClose ,videoRef ,setIsPlaying}) => {
  const techniques = {
    'Shot': ['Normal Shot', 'Volley', 'Penalty', 'Half Volley', 'Overhead Kick'],
    'Ground Pass': ['Inside Foot', 'Outside Foot', 'Heel', 'Header'],
    'Goalkeeper': ['Punch', 'Smother', 'Diving Save', 'Standing Save'],
    'Duel': ['Aerial', 'Tackle', 'Block']
  };

  const [selectedTechnique, setSelectedTechnique] = useState('');

const handleSubmit = () => {
  onConfirm(selectedTechnique || 'Not Specified'); 
   if (videoRef.current) {
      videoRef.current.pause(); 
      setIsPlaying();
    }
  onClose();
};

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Select Technique</h2>

        <select
          className="w-full p-2 border rounded mb-4"
          value={selectedTechnique}
          onChange={(e) => setSelectedTechnique(e.target.value)}
        >
          <option value="">-- Choose a technique --</option>
          {techniques[eventType]?.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!selectedTechnique}
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="flex-1 p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechniqueModal;
