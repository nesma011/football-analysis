import React, { useState } from 'react';

const TeamModal = ({ onConfirm, onClose, videoRef, setIsPlaying }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const teamOptions = ['Team 1', 'Team 2'];

  const handleConfirm = () => {
    if (videoRef?.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    if (selectedTeam) {
      onConfirm(selectedTeam);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg mb-2">Select Team</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Team</label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a team</option>
            {teamOptions.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleConfirm}
            disabled={!selectedTeam}
            className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
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

export default TeamModal;