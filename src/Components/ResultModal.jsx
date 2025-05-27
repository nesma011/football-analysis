import React from 'react';

const ResultModal = ({ eventType, currentEvent, onConfirm, onClose, videoRef, setIsPlaying, outcomes }) => {
  const results = outcomes || (
    eventType === 'Goalkeeper' && currentEvent?.actionType === 'Punch'
      ? ['Fail', 'In Play Danger', 'In Play Safe', 'Punched Out', 'Punch Outcome']
      : eventType === 'Goalkeeper' && currentEvent?.actionType === 'Keeper Sweeper'
        ? ['Clam', 'Clear']
        : eventType === 'Goalkeeper'
          ? ['Success', 'In Play Safe', 'In Play Danger', 'Saved Twice', 'Touched Out', 'Touched In', 'No Touch']
          : eventType === 'Dribble'
            ? ['Successful', 'Unsuccessful']
            : eventType === 'Interception'
              ? ['Won', 'Lost In Play', 'Lost Out']
              : eventType === 'Duel'
                ? ['Lost Out', 'Lost In Play', 'Success In Play', 'Won']
                : ['Complete', 'Incomplete', 'Out']
  );

  const handleResultSelect = (result) => {
    onConfirm(result);
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Select Result</h2>
        <div className="flex flex-col space-y-2">
          {results.length > 0 ? (
            results.map((result) => (
              <button
                key={result}
                onClick={() => handleResultSelect(result)}
                className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
              >
                {result}
              </button>
            ))
          ) : (
            <p className="text-red-500">No results available for this event.</p>
          )}
          <button
            onClick={onClose}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded mt-4"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;