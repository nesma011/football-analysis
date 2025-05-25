import { useState } from 'react';
import React from 'react';

const players = [
  'Mohamed Salah',
  'Lionel Messi',
  'Cristiano Ronaldo',
  'Neymar Jr',
  'Kylian Mbappé',
  'Kevin De Bruyne',
  'Sadio Mané',
  'Virgil van Dijk',
  'Robert Lewandowski',
  'Erling Haaland',
];

const teams = ['Team A', 'Team B'];

const PlayerModal = ({ onConfirm, onClose, videoRef, setIsPlaying, title }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const handleConfirm = () => {
    if (selectedPlayer) {
      onConfirm(selectedPlayer);
      if (videoRef?.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      onClose();
    } else {
      alert('Please select an option');
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg mb-2">{title || 'Select Player'}</h2>
        <select
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="" disabled>Select an option</option>
          {(title === 'Select Team' ? teams : players).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="mt-2 flex space-x-2">
          <button
            onClick={() => handleConfirm()}
            className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={!selectedPlayer}
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
export default PlayerModal;