import React, { useState } from 'react';
import PlayerModal from '../PlayerModal';
import LocationModal from '../LocationModal';
import ResultModal from '../ResultModal';
import GoalkeeperModal from '../GoalkeeperModal';
import BodyPartModal from '../BodyPartModal';
import ExtraInfoModal from '../ExtraInfoModal';

const defensiveEvents = [
  { type: 'Foul Won', text: 'Foul Won', shortcut: '8', color: 'bg-yellow-500' },
  { type: 'Duel', text: 'Duel', shortcut: 'A', color: 'bg-yellow-600' },
  { type: 'Interception', text: 'Interception', shortcut: 'X', color: 'bg-yellow-700' },
  { type: 'Clearance', text: 'Clearance', shortcut: 'F', color: 'bg-yellow-800' },
  { type: 'Block', text: 'Block', shortcut: 'B', color: 'bg-yellow-900' },
  { type: 'Goalkeeper', text: 'Goalkeeper', shortcut: null, color: 'bg-orange-500' },
  { type: 'Dribbled Past', text: 'Dribbled Past', shortcut: 'N', color: 'bg-orange-600' },
  { type: 'Foul Commit', text: 'Foul Commit', shortcut: '9', color: 'bg-orange-700' },
];

const DefensiveEvents = ({ videoRef, setIsPlaying, events, setEvents, finalizeEvent }) => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showGoalkeeperModal, setShowGoalkeeperModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showBodyPartModal, setShowBodyPartModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showExtraInfoModal, setShowExtraInfoModal] = useState(false);
  const [locationType, setLocationType] = useState(null);

  const handleStartEvent = (eventType) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setCurrentEvent({
      type: eventType,
      videoTimestamp: videoRef.current?.currentTime || 0,
    });
    if (eventType === 'Goalkeeper') {
      setShowGoalkeeperModal(true);
    } else {
      setShowPlayerModal(true);
    }
  };

  const handleGoalkeeperSelect = (action) => {
    setCurrentEvent({ ...currentEvent, actionType: action });
    setShowGoalkeeperModal(false);
    setLocationType('start');
    setShowLocationModal(true);
  };

  const handlePlayerSelect = (playerName) => {
    setCurrentEvent({ ...currentEvent, player: playerName });
    setShowPlayerModal(false);
    setLocationType('start');
    setShowLocationModal(true);
  };

  const handleLocationSelect = async (x, y) => {
    if (locationType === 'start') {
      setCurrentEvent({ ...currentEvent, startLocation: { x, y }, endLocation: { x, y } });
      setShowLocationModal(false);
      if (currentEvent.type === 'Goalkeeper') {
        setShowBodyPartModal(true);
      } else if (['Duel', 'Interception'].includes(currentEvent.type)) {
        setShowResultModal(true);
      } else {
        finalizeEvent({ ...currentEvent, startLocation: { x, y } });
      }
    }
  };

  const handleBodyPartSelect = (bodyPart) => {
    setCurrentEvent({ ...currentEvent, bodyPart });
    setShowBodyPartModal(false);
    setShowResultModal(true);
  };

  const handleResultSelect = (result) => {
    setCurrentEvent({ ...currentEvent, result });
    setShowResultModal(false);
    setShowExtraInfoModal(true);
  };

  const handleExtraInfoSelect = ({ extraInfo, passType, bodyPart, saveTechnique }) => {
    const updatedEvent = {
      ...currentEvent,
      extraInfo: extraInfo || '-',
      passType: passType || '-',
      bodyPart: currentEvent.type === 'Goalkeeper' ? bodyPart || '-' : '-',
      saveTechnique: saveTechnique || '-',
      endTime: currentEvent.endTime || Date.now() / 1000,
    };
    updatedEvent.duration =
      updatedEvent.endTime && updatedEvent.videoTimestamp
        ? (updatedEvent.endTime - updatedEvent.videoTimestamp) * 1000 / 1000
        : 0;
    setCurrentEvent(updatedEvent);
    setShowExtraInfoModal(false);
    finalizeEvent(updatedEvent);
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Defensive Events</h3>
      <div className="grid grid-cols-3 gap-2">
        {defensiveEvents.map((event) => (
          <button
            key={event.type}
            data-type={event.type}
            onClick={() => handleStartEvent(event.type)}
            className={`${event.color} text-white text-sm py-1 px-2 rounded-lg hover:opacity-80 transition-opacity w-full text-center flex items-center justify-center gap-1`}
          >
            <span>{event.text}</span>
            {event.shortcut && (
              <span className="text-xs text-white px-1 rounded">({event.shortcut})</span>
            )}
          </button>
        ))}
      </div>
      {showPlayerModal && (
        <PlayerModal
          onConfirm={handlePlayerSelect}
          onClose={() => setShowPlayerModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
      {showGoalkeeperModal && (
        <GoalkeeperModal
          onConfirm={handleGoalkeeperSelect}
          onClose={() => setShowGoalkeeperModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
      {showLocationModal && (
        <LocationModal
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
      {showBodyPartModal && (
        <BodyPartModal
          onConfirm={handleBodyPartSelect}
          onClose={() => setShowBodyPartModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
      {showResultModal && (
        <ResultModal
          eventType={currentEvent?.type}
          currentEvent={currentEvent}
          onConfirm={handleResultSelect}
          onClose={() => setShowResultModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
      {showExtraInfoModal && (
        <ExtraInfoModal
          eventType={currentEvent?.type}
          onConfirm={handleExtraInfoSelect}
          onClose={() => setShowExtraInfoModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
    </div>
  );
};

export default DefensiveEvents;