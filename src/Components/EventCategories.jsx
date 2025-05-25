import React from 'react';

const eventCategories = [
  {
    name: 'Pass Events',
    events: [
      { type: 'Ground Pass', text: 'Ground Pass', shortcut: 'W', color: 'bg-blue-500' },
      { type: 'High Pass', text: 'High Pass', shortcut: 'Q', color: 'bg-blue-600' },
      { type: 'Low Pass', text: 'Low Pass', shortcut: 'E', color: 'bg-blue-700' },
    ],
  },
  {
    name: 'Shot Events',
    events: [
      { type: 'Shot', text: 'Shot', shortcut: 'D', color: 'bg-red-500' },
    ],
  },
  {
    name: 'Possession & Dribbling',
    events: [
      { type: 'Dribble', text: 'Dribble', shortcut: 'T', color: 'bg-green-500' },
      { type: 'Dispossessed', text: 'Dispossessed', shortcut: 'S', color: 'bg-green-600' },
      { type: 'Miss control', text: 'Miss control', shortcut: '5', color: 'bg-green-700' },
      { type: 'Ball Recovery', text: 'Ball Recovery', shortcut: 'R', color: 'bg-green-800' },
      { type: 'Press', text: 'Press', shortcut: 'G', color: 'bg-green-900' },
    ],
  },
  {
    name: 'Defensive Events',
    events: [
      { type: 'Foul Won', text: 'Foul Won', shortcut: '8', color: 'bg-yellow-500' },
      { type: 'Duel', text: 'Duel', shortcut: 'A', color: 'bg-yellow-600' },
      { type: 'Interception', text: 'Interception', shortcut: 'X', color: 'bg-yellow-700' },
      { type: 'Clearance', text: 'Clearance', shortcut: 'F', color: 'bg-yellow-800' },
      { type: 'Block', text: 'Block', shortcut: 'B', color: 'bg-yellow-900' },
      { type: 'Goalkeeper', text: 'Goalkeeper', shortcut: null, color: 'bg-orange-500' },
      { type: 'Dribbled Past', text: 'Dribbled Past', shortcut: 'N', color: 'bg-orange-600' },
      { type: 'Foul Commit', text: 'Foul Commit', shortcut: '9', color: 'bg-orange-700' },
    ],
  },
  {
    name: 'Set Pieces & Special Events',
    events: [
      { type: 'Own Goal For', text: 'Own Goal For', shortcut: null, color: 'bg-purple-500' },
      { type: 'Offside', text: 'Offside', shortcut: null, color: 'bg-purple-600' },
      { type: 'Own Goal', text: 'Own Goal', shortcut: null, color: 'bg-purple-700' },
      { type: 'Error', text: 'Error', shortcut: null, color: 'bg-purple-800' },
      { type: 'Bad Behaviour', text: 'Bad Behaviour', shortcut: null, color: 'bg-gray-500' },
      { type: 'Injury Stop', text: 'Injury Stop', shortcut: null, color: 'bg-gray-600' },
      { type: 'Var Stop', text: 'Var Stop', shortcut: null, color: 'bg-gray-700' },
      { type: 'Ball Drop', text: 'Ball Drop', shortcut: null, color: 'bg-gray-800' },
      { type: 'Water Break', text: 'Water Break', shortcut: null, color: 'bg-gray-900' },
      { type: 'Sub', text: 'Sub', shortcut: null, color: 'bg-purple-600' },
    ],
  },
];

const EventCategories = ({ startEvent, setIsPlaying, videoRef }) => {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-4">
        {eventCategories.map((category) => (
          <div key={category.name}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{category.name}</h3>
            <div className="grid grid-cols-3 gap-2">
              {category.events.map((event) => (
                <button
                  key={event.type}
                  onClick={() => {
                    if (videoRef?.current) {
                      videoRef.current.pause();
                      setIsPlaying(false);
                    }
                    startEvent(event.type);
                  }}
                  className={`${event.color} text-white text-sm py-1 px-2 rounded-lg hover:opacity-80 transition-opacity w-full text-center flex items-center justify-center gap-1`}
                >
                  <span>{event.text}</span>
                  {event.shortcut && <span className="text-xs text-white px-1 rounded">({event.shortcut})</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCategories;