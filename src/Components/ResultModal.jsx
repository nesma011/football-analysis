

import React from 'react';


const ResultModal = ({ eventType, onConfirm, onClose, videoRef, setIsPlaying  }) => {
  const results = eventType === 'Goalkeeper' 
    ? ['Success', 'In play Safe', 'In play Danger', 'Saved Twice', 'Touched out', 'Touched in', 'No Touch'] 
    : eventType === 'Foul Won' 
      ? ['Penalty', 'Advantage', 'Defensive'] 
      : ['Complete', 'Incomplete', 'Out'];

       const handleResultSelect = (result) => {
    if (videoRef?.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    onConfirm(result);
  };
  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg mb-2">Select Result</h2>
        <div className="flex flex-col space-y-2">
          {results.map((result) => (
            <button
              key={result}
      onClick={() => handleResultSelect(result)}
              className="p-2 bg-gray-500 text-white rounded"
            >
              {result}
            </button>
          ))}
          <button onClick={onClose} className="p-2 bg-red-500 text-white rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;